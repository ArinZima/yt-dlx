import ffmpeg from "fluent-ffmpeg";
import puppeteer from "puppeteer";
async function proTube({ videoUrl }) {
  const browser = await puppeteer.launch({
    userDataDir: "others",
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
  if (metaTube) return metaTube;
  else return undefined;
}

(async () => {
  const YouTube = await proTube({
    videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
  });
  if (YouTube) {
    const fluent = ffmpeg(YouTube[0].url);
    fluent.output("temp/music.mkv");
    fluent.format("matroska");
    fluent.run();
  }
})();
