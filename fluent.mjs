console.clear();
import SpinClient from "spinnies";
import puppeteer from "puppeteer";

async function proTube({ videoUrl }) {
  const spinner = new SpinClient();
  try {
    spinner.add("proTube", { text: "browser spinning." });
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
    spinner.update("proTube", { text: "grabbing content." });
    const metaTube = await page.evaluate(() => {
      const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
      if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
        const streamingData = ytInitialPlayerResponse.streamingData;
        const formats = streamingData.formats || [];
        const pops = formats.concat(streamingData.adaptiveFormats || []);
        return pops.map((ipop) => ipop);
      } else return null;
    });
    if (page) await page.close();
    if (browser) await browser.close();
    if (metaTube) {
      spinner.update("proTube", { text: "preparing payload." });
      const AudioStore = [];
      const UnStore = [];
      const VideoStore = [];
      for (const Tube of metaTube) {
        if (Tube.mimeType && Tube.mimeType.includes("audio")) {
          const codec = Tube.mimeType
            ? Tube.mimeType.split(";")[1]?.trim()
            : null;
          AudioStore.push({
            ...Tube,
            codec: codec ? codec.split("=")[1].replace(/"/g, "").trim() : null,
            mimeType: Tube.mimeType ? Tube.mimeType.split(";")[0].trim() : null,
          });
        } else if (Tube.mimeType && Tube.mimeType.includes("video")) {
          const codec = Tube.mimeType
            ? Tube.mimeType.split(";")[1]?.trim()
            : null;
          VideoStore.push({
            ...Tube,
            codec: codec ? codec.split("=")[1].replace(/"/g, "").trim() : null,
            mimeType: Tube.mimeType ? Tube.mimeType.split(";")[0].trim() : null,
          });
        } else {
          const codec = Tube.mimeType
            ? Tube.mimeType.split(";")[1]?.trim()
            : null;
          UnStore.push({
            ...Tube,
            codec: codec ? codec.split("=")[1].replace(/"/g, "").trim() : null,
            mimeType: Tube.mimeType ? Tube.mimeType.split(";")[0].trim() : null,
          });
        }
      }
      spinner.succeed("proTube", { text: "payload sent." });
      return { AudioStore, VideoStore };
    } else return undefined;
  } catch (error) {
    spinner.fail("proTube", { text: error.message });
  }
}

(async () => {
  try {
    const metaTube = await proTube({
      videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    if (metaTube) {
      console.log(metaTube.VideoStore);
      console.log(metaTube.AudioStore);
    } else process.exit(1);
  } catch (error) {
    console.error(error);
  }
})();
