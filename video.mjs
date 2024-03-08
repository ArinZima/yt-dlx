// =======================================================================================
import puppeteer from "puppeteer";
const proTube = async (videoUrl) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(videoUrl);
  await page.waitForSelector("script");
  const videoSrc = await page.evaluate(() => {
    const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
    if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
      const streamingData = ytInitialPlayerResponse.streamingData;
      const formats = streamingData.formats || [];
      const adaptiveFormats = streamingData.adaptiveFormats || [];
      const allFormats = formats.concat(adaptiveFormats);
      return allFormats.map((format) => decodeURIComponent(format.url));
    }
    return null;
  });
  if (videoSrc) console.log(videoSrc);
  else console.log("@error: failed to extract URLs.");
  if (page) await page.close();
  if (browser) await browser.close();
};
proTube("https://www.youtube.com/watch?v=AbFnsaDQMYQ");
