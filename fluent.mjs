import retry from "async-retry";
import SpinClient from "spinnies";
import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";

async function proTube({ videoUrl }) {
  const response = await retry(
    async () => {
      const spinner = new SpinClient();
      const vid = new URL(videoUrl).searchParams.get("v");
      spinner.add("proTube", { text: "browser spinning for " + vid });
      try {
        const browser = await puppeteer.launch({
          ignoreHTTPSErrors: true,
          headless: true,
          args: [
            "--no-zygote",
            "--incognito",
            "--no-sandbox",
            "--lang=en-US",
            "--enable-automation",
            "--disable-dev-shm-usage",
            "--ignore-certificate-errors",
            "--allow-running-insecure-content",
            "--proxy-server=socks5://127.0.0.1:9050",
          ],
        });
        const ipage = await browser.newPage();
        await ipage.goto("https://checkip.amazonaws.com");
        const ipAddress = await ipage.evaluate(() => {
          return document.body.textContent.trim();
        });
        if (ipAddress) await ipage.close();
        const page = await browser.newPage();
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
        );
        await page.goto(videoUrl);
        await page.waitForSelector("script");
        spinner.update("proTube", { text: "grabbing content for " + vid });
        const metaTube = await page.evaluate(() => {
          const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
          if (
            ytInitialPlayerResponse &&
            ytInitialPlayerResponse.streamingData
          ) {
            const streamingData = ytInitialPlayerResponse.streamingData;
            const formats = streamingData.formats || [];
            const pops = formats.concat(streamingData.adaptiveFormats || []);
            return pops.map((p) => p);
          } else return undefined;
        });
        if (metaTube) {
          spinner.update("proTube", { text: "preparing payload for " + vid });
          const AudioStore = [];
          const VideoStore = [];
          for (const T of metaTube) {
            const {
              averageBitrate,
              projectionType,
              lastModified,
              indexRange,
              colorInfo,
              initRange,
              ...nTube
            } = T;
            switch (true) {
              case nTube.mimeType && nTube.mimeType.includes("audio"):
                const audioCodec = nTube.mimeType
                  ? nTube.mimeType.split(";")[1]?.trim()
                  : undefined;
                AudioStore.push({
                  itag: nTube.itag,
                  mediaLink: nTube.url,
                  bitRate: nTube.bitrate,
                  channels: nTube.audioChannels,
                  duration: parseInt(nTube.approxDurationMs),
                  contentLength: parseInt(nTube.contentLength),
                  mimeType: nTube.mimeType.split(";")[0].trim(),
                  audioSampleRate: parseInt(nTube.audioSampleRate),
                  approxDurationMs: parseInt(nTube.approxDurationMs),
                  codec: audioCodec.split("=")[1].replace(/"/g, "").trim(),
                  quality: nTube.audioQuality
                    .replace("AUDIO_QUALITY_", "")
                    .toLowerCase(),
                });
                break;
              case nTube.mimeType &&
                !nTube.audioQuality &&
                nTube.mimeType.includes("video"):
                const videoCodec = nTube.mimeType
                  ? nTube.mimeType.split(";")[1]?.trim()
                  : undefined;
                VideoStore.push({
                  fps: nTube.fps,
                  itag: nTube.itag,
                  width: nTube.width,
                  mediaLink: nTube.url,
                  height: nTube.height,
                  bitRate: nTube.bitrate,
                  resolution: nTube.qualityLabel,
                  contentLength: parseInt(nTube.contentLength),
                  mimeType: nTube.mimeType.split(";")[0].trim(),
                  approxDurationMs: parseInt(nTube.approxDurationMs),
                  codec: videoCodec.split("=")[1].replace(/"/g, "").trim(),
                });
                break;
              default:
                break;
            }
          }
          const payLoad = { AudioStore, VideoStore, ipAddress };
          spinner.succeed("proTube", { text: "payload sent for " + vid });
          if (page) await page.close();
          if (browser) await browser.close();
          return payLoad;
        } else return undefined;
      } catch (error) {
        spinner.fail("proTube", { text: error.message });
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 6000,
      onRetry: (err, attempt) =>
        console.log(`Retrying ${attempt}. Error: ${err}`),
    }
  );
  return response;
}

(async () => {
  const metaTube = await proTube({
    videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
  });
  if (metaTube) {
    const fluent = ffmpeg(metaTube.VideoStore[0].mediaLink);
    fluent.input(metaTube.AudioStore[0].mediaLink);
    fluent.videoCodec("copy");
    fluent.audioCodec("copy");
    fluent.audioChannels(metaTube.AudioStore[0].channels);
    fluent.addOption("-headers", `X-Forwarded-For: ${metaTube.ipAddress}`);
    fluent.on("progress", (prog) => console.log(prog.percent));
    fluent.on("start", (cmd) => console.log(cmd));
    fluent.output(`${metaTube.ipAddress}.mkv`);
    fluent.format("matroska");
    fluent.run();
  } else process.exit(1);
})();
