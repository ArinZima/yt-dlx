console.clear();
import * as fs from "fs";
import SpinClient from "spinnies";
import puppeteer from "puppeteer";

async function proTube({ videoUrl }) {
  const fsfile = "metadata.json";
  const spinner = new SpinClient();
  const vid = new URL(videoUrl).searchParams.get("v");
  spinner.add("proTube", { text: "browser spinning for " + vid });
  try {
    if (fs.existsSync(fsfile)) {
      const metaTube = fs.readFileSync(fsfile, "utf-8");
      const { AudioStore, VideoStore } = procData(JSON.parse(metaTube));
      spinner.succeed("proTube", { text: "payload sent for " + vid });
      return { AudioStore, VideoStore };
    } else {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-zygote",
          "--incognito",
          "--no-sandbox",
          "--enable-automation",
          "--disable-dev-shm-usage",
        ],
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
      );
      await page.goto(videoUrl);
      await page.waitForSelector("script");
      spinner.update("proTube", { text: "grabbing content for " + vid });
      const metaTube = await page.evaluate(() => {
        const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
        if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
          const streamingData = ytInitialPlayerResponse.streamingData;
          const formats = streamingData.formats || [];
          const pops = formats.concat(streamingData.adaptiveFormats || []);
          return pops.map((ipop) => ipop);
        } else return undefined;
      });
      if (page) await page.close();
      if (browser) await browser.close();
      if (metaTube) {
        spinner.update("proTube", { text: "preparing payload for " + vid });
        const { AudioStore, VideoStore } = procData(metaTube);
        spinner.succeed("proTube", { text: "payload sent for " + vid });
        fs.writeFileSync(fsfile, JSON.stringify(metaTube, null, 2));
        return { AudioStore, VideoStore };
      } else return undefined;
    }
  } catch (error) {
    spinner.fail("proTube", { text: error.message });
  }
}

function procData(metaTube) {
  const AudioStore = [];
  const VideoStore = [];
  for (const Tube of metaTube) {
    if (Tube.mimeType && Tube.mimeType.includes("audio")) {
      const codec = Tube.mimeType
        ? Tube.mimeType.split(";")[1]?.trim()
        : undefined;
      const qualityLabel = Tube.qualityLabel || undefined;
      if (!AudioStore[qualityLabel]) AudioStore[qualityLabel] = [];
      AudioStore[qualityLabel].push({
        ...Tube,
        resolution: qualityLabel,
        codec: codec ? codec.split("=")[1].replace(/"/g, "").trim() : undefined,
        mimeType: Tube.mimeType
          ? Tube.mimeType.split(";")[0].trim()
          : undefined,
      });
    } else if (Tube.mimeType && Tube.mimeType.includes("video")) {
      const codec = Tube.mimeType
        ? Tube.mimeType.split(";")[1]?.trim()
        : undefined;
      const qualityLabel = Tube.qualityLabel || undefined;
      if (!VideoStore[qualityLabel]) VideoStore[qualityLabel] = [];
      VideoStore[qualityLabel].push({
        ...Tube,
        resolution: qualityLabel,
        codec: codec ? codec.split("=")[1].replace(/"/g, "").trim() : undefined,
        mimeType: Tube.mimeType
          ? Tube.mimeType.split(";")[0].trim()
          : undefined,
      });
    }
  }
  return { AudioStore, VideoStore };
}

(async () => {
  try {
    const metaTube = await proTube({
      videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    if (metaTube) console.log(metaTube);
    else process.exit(1);
  } catch (error) {
    console.error(error);
  }
})();
