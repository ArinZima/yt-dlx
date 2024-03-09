import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";

async function proTube(videoUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(videoUrl);
  await page.waitForSelector("script");
  const src = await page.evaluate(() => {
    const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
    if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
      const streamingData = ytInitialPlayerResponse.streamingData;
      const formats = streamingData.formats || [];
      const adaptiveFormats = streamingData.adaptiveFormats || [];
      const allFormats = formats.concat(adaptiveFormats);
      return allFormats.map((format) => format);
    } else return null;
  });
  if (src) {
    console.log(src);
    const fluent = ffmpeg(src[0].url);
    fluent.output("public/music.mkv");
    fluent.format("matroska");
    fluent.run();
  } else console.log("@error: failed to extract URLs.");
  if (page) await page.close();
  if (browser) await browser.close();
}

proTube("https://www.youtube.com/watch?v=AbFnsaDQMYQ");
