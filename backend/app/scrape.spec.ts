console.clear();
import colors from "colors";
import { chromium } from "playwright";

async function YouTubeScraper(query: string | number | boolean) {
  console.log(colors.yellow("browser @scrape:"), "spinning chromium...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const searchUrl =
    "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
  await page.goto(searchUrl);
  console.log(
    colors.yellow("browser @scrape:"),
    "hydrating dynamic content..."
  );
  let videos: string | any[] = [];
  while (videos.length < 100) {
    await page.waitForSelector(".ytd-video-renderer");
    const newVideos = await page.$$("ytd-video-renderer");
    videos = [...videos, ...newVideos];
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(4000);
  }
  const data = [];
  for (const vid of videos) {
    const title = await vid.$eval(
      "#video-title",
      (el: { textContent: string }) => el.textContent.trim()
    );
    const videoLink: any =
      "https://www.youtube.com" +
      (await vid.$eval("a", (el: { getAttribute: (arg0: string) => any }) =>
        el.getAttribute("href")
      ));
    const videoId = videoLink.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
    )[1];
    const authorContainer = await vid.$(".ytd-channel-name a");
    const author = await authorContainer
      .getProperty("textContent")
      .then((property: { jsonValue: () => any }) => property.jsonValue());
    const authorUrl = await authorContainer
      .getProperty("href")
      .then((property: { jsonValue: () => any }) => property.jsonValue());
    let description = "";
    const descriptionElement = await vid.$(".metadata-snippet-text");
    if (descriptionElement) {
      description = await descriptionElement
        .getProperty("innerText")
        .then((property: { jsonValue: () => any }) => property.jsonValue());
    }
    const viewsContainer = await vid.$(
      ".inline-metadata-item.style-scope.ytd-video-meta-block"
    );
    const views = await viewsContainer
      .getProperty("innerText")
      .then((property: { jsonValue: () => any }) => property.jsonValue());
    data.push({
      title,
      author,
      videoId,
      authorUrl,
      videoLink,
      thumbnailUrl:
        "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg",
      description,
      views: views.replace(/ views/g, ""),
    });
  }
  await browser.close();
  console.log(
    colors.green("browser @scrape:"),
    "found total videos:",
    videos.length
  );
  return data;
}
YouTubeScraper("ZULFAAN (Official Audio) SARRB | Starboy X")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
