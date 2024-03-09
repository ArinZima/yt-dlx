console.clear();
import SpinClient from "spinnies";
import puppeteer from "puppeteer";

async function proTube({ videoUrl }) {
  const spinner = new SpinClient();
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
  const metaTube = await page.evaluate((window) => {
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
    const VideoStore = [];
    for (const p of metaTube) {
      if (p.mimeType && p.mimeType.includes("audio")) AudioStore.push(p);
      else if (p.mimeType && p.mimeType.includes("video")) VideoStore.push(p);
    }
    spinner.succeed("proTube", { text: "payload sent." });
    return { AudioStore, VideoStore };
  } else return undefined;
}

(async () => {
  const metaTube = await proTube({
    videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
  });
  console.log(metaTube.VideoStore);
  console.log(metaTube.AudioStore);
})();
