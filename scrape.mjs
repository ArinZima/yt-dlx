import colors from "colors";
import { chromium } from "playwright";

async function YouTubeScraper(query) {
  console.log(colors.yellow("Creating new page..."));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const searchUrl =
    "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
  await page.goto(searchUrl);
  console.log(colors.yellow("Waiting for dynamic content to load..."));
  let videos = [];
  while (videos.length < 80) {
    await page.waitForSelector(".ytd-video-renderer");
    const newVideos = await page.$$("ytd-video-renderer");
    videos = [...videos, ...newVideos];
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(8000);
  }
  const data = [];
  for (const vid of videos) {
    const title = await vid.$eval("#video-title", (el) =>
      el.textContent.trim()
    );
    const link =
      "https://www.youtube.com" +
      (await vid.$eval("a", (el) => el.getAttribute("href")));
    const videoId = link.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
    )[1];
    const authorContainer = await vid.$(".ytd-channel-name a");
    const author = await authorContainer
      .getProperty("textContent")
      .then((property) => property.jsonValue());
    const authorUrl = await authorContainer
      .getProperty("href")
      .then((property) => property.jsonValue());
    data.push({
      title,
      link,
      author,
      videoId,
      authorUrl: "https://www.youtube.com" + authorUrl,
      thumbnailUrl:
        "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg",
    });
  }
  await browser.close();
  return data;
}

YouTubeScraper("ZULFAAN")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
