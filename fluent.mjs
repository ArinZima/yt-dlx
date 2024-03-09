import ffmpeg from "fluent-ffmpeg";
import puppeteer from "puppeteer";
async function proTube({ videoUrl }) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(videoUrl);
  await page.waitForSelector("script");
  const metaTube = await page.evaluate(() => {
    const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
    if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
      const streamingData = ytInitialPlayerResponse.streamingData;
      const formats = streamingData.formats || [];
      const allFormats = formats.concat(streamingData.adaptiveFormats || []);
      return allFormats.map((format) => format);
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
    fluent.output("public/music.mkv");
    fluent.format("matroska");
    fluent.run();
  }
})();
