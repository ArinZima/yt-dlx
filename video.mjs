import puppeteer from "puppeteer";
import https from "https";
import fs from "fs";

const downloadVideo = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(
        url,
        { headers: { "X-Forwarded-For": "152.58.146.220" } },
        (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve(filePath);
          });
        }
      )
      .on("error", (err) => {
        fs.unlink(filePath);
        reject(err.message);
      });
  });
};

const proTube = async (videoUrl) => {
  const browser = await puppeteer.launch({ headless: true });
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
      return allFormats.map((format) => format.url);
    }
    return null;
  });
  if (videoSrc) {
    console.log(videoSrc);
    const videoUrl = videoSrc[0];
    await downloadVideo(videoUrl, "video.webm");
  } else console.log("@error: failed to extract URLs.");
  if (page) await page.close();
  if (browser) await browser.close();
};

proTube("https://www.youtube.com/watch?v=AbFnsaDQMYQ");
