// =====================================[ scrapping ]===========================================
// console.clear();
// import colors from "colors";
// import Spinnies from "spinnies";
// import { randomUUID } from "crypto";
// import { chromium } from "playwright";
// const spinnies = new Spinnies();
// const metaSpin = randomUUID().toString();
// async function YouTubeScraper(query: string | number | boolean) {
// spinnies.add(metaSpin, { text: colors.yellow("Spinning Chromium...") });
// const browser = await chromium.launch({ headless: true });
// const context = await browser.newContext({ ignoreHTTPSErrors: true });
// const page = await context.newPage();
// const searchUrl =
// "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
// await page.goto(searchUrl);
// spinnies.update(metaSpin, {
// text: colors.yellow("Hydrating dynamic content..."),
// });
// let videos: string | any[] = [];
// while (videos.length < 100) {
// await page.waitForSelector(".ytd-video-renderer");
// const newVideos = await page.$$("ytd-video-renderer");
// videos = [...videos, ...newVideos];
// await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
// await page.waitForTimeout(4000);
// }
// const data = [];
// for (const vid of videos) {
// const title = await vid.$eval(
// "#video-title",
// (el: { textContent: string }) => el.textContent.trim()
// );
// const videoLink: any =
// "https://www.youtube.com" +
// (await vid.$eval("a", (el: { getAttribute: (arg0: string) => any }) =>
// el.getAttribute("href")
// ));
// const videoId = videoLink.match(
// /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
// )[1];
// const authorContainer = await vid.$(".ytd-channel-name a");
// const author = await authorContainer
// .getProperty("textContent")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
// const authorUrl = await authorContainer
// .getProperty("href")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
// let description = "";
// const descriptionElement = await vid.$(".metadata-snippet-text");
// if (descriptionElement) {
// description = await descriptionElement
// .getProperty("innerText")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
// }
// const viewsContainer = await vid.$(
// ".inline-metadata-item.style-scope.ytd-video-meta-block"
// );
// const views = await viewsContainer
// .getProperty("innerText")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
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
// =====================================[ scrapping ]===========================================
console.clear();
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
(async () => {
  try {
    await ListAudioHighest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PLDIoUOhQQPlWvtxdeVTG3i7-SlSN0jfWj&si=9GB2vLYUskpGJ--C",
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
        "https://youtube.com/playlist?list=PLDIoUOhQQPlWt8OpaGG43OjNYuJ2q9jEN&si=0k8__KXk8gxgPaf5",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ListAudioLowest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PLDIoUOhQQPlWvtxdeVTG3i7-SlSN0jfWj&si=9GB2vLYUskpGJ--C",
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
        "https://youtube.com/playlist?list=PLDIoUOhQQPlWt8OpaGG43OjNYuJ2q9jEN&si=0k8__KXk8gxgPaf5",
      ],
      folderName: "temp",
      verbose: false,
    });
  } catch (error) {
    console.error(error);
  }
})();
