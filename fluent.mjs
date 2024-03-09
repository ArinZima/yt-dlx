import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";

async function proTube({ videoUrl }) {
  const browser = await puppeteer.launch({
    userDataDir: "others",
    headless: false,
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
  const metaData = await page.evaluate(() => {
    const titleElement = document.querySelector("h1.title");
    const title = titleElement ? titleElement.textContent.trim() : undefined;
    const descriptionElement = document.querySelector("#description");
    const description = descriptionElement
      ? descriptionElement.textContent.trim()
      : undefined;
    const viewsElement = document.querySelector(".view-count");
    const views = viewsElement ? viewsElement.textContent.trim() : undefined;
    const likesElement = document.querySelector(
      ".like-button-renderer .like-button-renderer-like-button"
    );
    const likes = likesElement ? likesElement.textContent.trim() : undefined;
    const dislikesElement = document.querySelector(
      ".like-button-renderer .like-button-renderer-dislike-button"
    );
    const dislikes = dislikesElement
      ? dislikesElement.textContent.trim()
      : undefined;
    return { title, description, views, likes, dislikes };
  });
  const metaTube = await page.evaluate(() => {
    const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
    if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
      const streamingData = ytInitialPlayerResponse.streamingData;
      const AdaptFormats = streamingData.AdaptFormats || [];
      const Formats = streamingData.formats || [];
      const pops = Formats.concat(AdaptFormats);
      const AudioStore = [];
      const VideoStore = [];
      pops.forEach((p) => {
        if (p.mimeType.includes("audio")) AudioStore.push(p);
        else if (p.mimeType.includes("video")) VideoStore.push(p);
      });
      return { AudioStore, VideoStore };
    } else return undefined;
  });
  if (page) await page.close();
  if (browser) await browser.close();
  if (metaTube & metaData) return { metaTube, metaData };
  else throw new Error("Error fetching video data");
}

(async () => {
  const { metaTube, metaData } = await proTube({
    videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
  });
  console.log({ metaTube, metaData });
  const fluent = ffmpeg(metaTube[0].url);
  fluent.output("temp/music.mkv");
  fluent.format("matroska");
  fluent.run();
})();
