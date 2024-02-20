import colors from "colors";
import Spinnies from "spinnies";
import { randomUUID } from "crypto";
import { chromium } from "playwright";

// const spinnies = new Spinnies();
// const metaSpin = randomUUID().toString();

// async function YouTubeScraper(query) {
// spinnies.add(metaSpin, { text: colors.yellow("Spinning Chromium...") });
// const browser = await chromium.launch({ headless: true });
// const context = await browser.newContext({ ignoreHTTPSErrors: true });
// const page = await context.newPage();
// const searchUrl =
// "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
// await page.goto(searchUrl);
// spinnies.update(metaSpin, {
// text: colors.yellow("Loading dynamic content..."),
// });
// let videos = [];
// while (videos.length < 100) {
// await page.waitForSelector(".ytd-video-renderer");
// const newVideos = await page.$$("ytd-video-renderer");
// videos = [...videos, ...newVideos];
// await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
// await page.waitForTimeout(4000);
// }
// const data = [];
// for (const vid of videos) {
// const title = await vid.$eval("#video-title", (el) =>
// el.textContent.trim()
// );
// const videoLink =
// "https://www.youtube.com" +
// (await vid.$eval("a", (el) => el.getAttribute("href")));
// const videoId = videoLink.match(
// /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
// )[1];
// const authorContainer = await vid.$(".ytd-channel-name a");
// const author = await authorContainer
// .getProperty("textContent")
// .then((property) => property.jsonValue());
// const authorUrl = await authorContainer
// .getProperty("href")
// .then((property) => property.jsonValue());
// let description = "";
// const descriptionElement = await vid.$(".metadata-snippet-text");
// if (descriptionElement) {
// description = await descriptionElement
// .getProperty("innerText")
// .then((property) => property.jsonValue());
// }
// const viewsContainer = await vid.$(
// ".inline-metadata-item.style-scope.ytd-video-meta-block"
// );
// const views = await viewsContainer
// .getProperty("innerText")
// .then((property) => property.jsonValue());
// data.push({
// title,
// author,
// videoId,
// authorUrl,
// videoLink,
// thumbnailUrl:
// "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg",
// description,
// views: views.replace(/ views/g, ""),
// });
// }
// await browser.close();
// spinnies.succeed(metaSpin, {
// text: colors.green("Total videos: ") + videos.length,
// });
// return data;
// }

// YouTubeScraper("ZULFAAN (Official Audio) SARRB | Starboy X")
// .then((data) => console.log(data))
// .catch((error) => console.error(error));

async function getYouTubeVideoData(videoId) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  await page.goto(videoUrl);
  const data = await page.evaluate(() => {
    const title = document.querySelector("h1.title").innerText.trim();
    const author = document.querySelector(".ytd-channel-name").innerText.trim();
    const authorUrl = document
      .querySelector(".ytd-channel-name a")
      .getAttribute("href");
    const description = document.querySelector("#description").innerText.trim();
    const views = document.querySelector(".view-count").innerText.trim();
    const likes = document
      .querySelector(".like-button-renderer-like-button-unclicked span")
      .innerText.trim();
    const dislikes = document
      .querySelector(".like-button-renderer-dislike-button-unclicked span")
      .innerText.trim();
    return {
      title,
      author,
      authorUrl,
      description,
      views,
      likes,
      dislikes,
    };
  });
  await browser.close();
  return data;
}

getYouTubeVideoData("suAR1PYFNYA")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
