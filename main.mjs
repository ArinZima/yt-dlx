console.clear();
import colors from "colors";
import { chromium } from "playwright";

async function YouTubeSearch(query) {
  let videos = [];
  const data = [];
  console.log(colors.yellow("@scrape:"), "spinning chromium...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const searchUrl =
    "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
  await page.goto(searchUrl);
  console.log(colors.yellow("@scrape:"), "waiting for hydration...");
  while (videos.length < 40) {
    await page.waitForSelector(".ytd-video-renderer");
    const newVideos = await page.$$(
      'ytd-video-renderer:not([class*="ytd-rich-grid-video-renderer"])'
    );
    videos = [...videos, ...newVideos];
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
  for (const vid of videos) {
    const title = await vid.$eval("#video-title", (el) =>
      el.textContent.trim()
    );
    const videoLink =
      "https://www.youtube.com" +
      (await vid.$eval("a", (el) => el.getAttribute("href")));
    const videoId = videoLink.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
    )[1];
    const authorContainer = await vid.$(".ytd-channel-name a");
    const author = await authorContainer
      .getProperty("textContent")
      .then((property) => property.jsonValue());
    const authorUrl = await authorContainer
      .getProperty("href")
      .then((property) => property.jsonValue());
    let description = "";
    const descriptionElement = await vid.$(".metadata-snippet-text");
    if (descriptionElement) {
      description = await descriptionElement
        .getProperty("innerText")
        .then((property) => property.jsonValue());
    }
    const viewsContainer = await vid.$(
      ".inline-metadata-item.style-scope.ytd-video-meta-block"
    );
    const views = await viewsContainer
      .getProperty("innerText")
      .then((property) => property.jsonValue());
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

async function YouTubeSingle(videoUrl) {
  console.log(colors.yellow("@scrape:"), "spinning chromium...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  try {
    await page.goto(videoUrl);
    console.log(colors.yellow("@scrape:"), "waiting for hydration...");
    await page.waitForSelector(".style-scope.ytd-watch-metadata");
    const title = await page.$eval(".style-scope.ytd-watch-metadata", (el) =>
      el.textContent.trim()
    );
    const author = await page.$eval(
      ".yt-simple-endpoint.style-scope.yt-formatted-string",
      (el) => el.textContent.trim()
    );
    const views = await page.$eval(
      ".bold.style-scope.yt-formatted-string",
      (el) => el.textContent.trim()
    );
    const videoId = videoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
    )[1];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    await page.waitForSelector(".item.style-scope.ytd-watch-metadata");
    const description = await page.$eval(
      ".item.style-scope.ytd-watch-metadata",
      (el) => el.textContent.trim()
    );
    const uploadOn = await page.$eval(
      "span.bold.style-scope.yt-formatted-string",
      (el) => el.textContent.trim()
    );
    const data = {
      title: title.split("\n")[0].trim(),
      author,
      videoId,
      videoUrl,
      thumbnailUrl,
      views: views.replace(/ views/g, ""),
      description,
      uploadOn,
    };
    console.log(
      colors.green("browser @scrape:"),
      "Video data retrieved successfully."
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await browser.close();
  }
}

(async () => {
  await YouTubeSearch("ZULFAAN (Official Audio) SARRB | Starboy X")
    .then((data) => {
      if (data) console.log(data);
      else console.log("Failed to retrieve video data.");
    })
    .catch((error) => console.error(error));

  await YouTubeSingle("https://www.youtube.com/watch?v=_oTgwjM6mBU")
    .then((data) => {
      if (data) console.log(data);
      else console.log("Failed to retrieve video data.");
    })
    .catch((error) => console.error(error));
})();
