import colors from "colors";
import { chromium } from "playwright";

async function YouTubeScraper() {
  console.log(colors.yellow("Creating new page..."));
  let browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const searchUrl = "https://www.youtube.com/results?search_query=Houdini";
  await page.goto(searchUrl);
  console.log(colors.yellow("Waiting for dynamic content to load..."));
  let videos = [];
  while (videos.length < 40) {
    await page.waitForSelector(".ytd-video-renderer");
    const newVideos = await page.$$("ytd-video-renderer");
    videos = [...videos, ...newVideos];
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(4000);
  }
  const links = [];
  const titles = [];
  const authors = [];
  const videoIds = [];
  const authorUrls = [];
  for (const vid of videos) {
    const title = await vid.$eval("#video-title", (el) =>
      el.textContent.trim()
    );
    const link =
      "https://www.youtube.com" +
      (await vid.$eval("a", (el) => el.getAttribute("href")));
    titles.push(title);
    links.push(link);
    const videoId = link.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
    )[1];
    videoIds.push(videoId);
    const authorContainer = await vid.$(".ytd-channel-name");
    const author = await authorContainer.$eval("#text", (el) =>
      el.textContent.trim()
    );
    const authorUrl =
      "https://www.youtube.com" + (await authorContainer.getAttribute("href"));
    authors.push(author);
    authorUrls.push(authorUrl);
  }
  for (let i = 0; i < videos.length; i++) {
    console.log(colors.green("Link: ") + links[i]);
    console.log(colors.green("Title: ") + titles[i]);
    console.log(colors.green("Author: ") + authors[i]);
    console.log(colors.green("Video ID: ") + videoIds[i]);
    console.log(colors.green("Author URL: ") + authorUrls[i]);
    console.log(colors.reset(""));
  }
  await browser.close();
}

YouTubeScraper().catch((error) => {
  console.error(colors.red("Error during scraping:"), error);
});
