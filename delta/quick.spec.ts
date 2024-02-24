import async from "async";
import colors from "colors";
import retry from "async-retry";
import spinClient from "spinnies";
import { randomUUID } from "crypto";
import { chromium } from "playwright";

const spinnies = new spinClient();

async function YouTubeSearch(query: string | number | boolean) {
  const retryOptions = {
    minTimeout: 2000,
    maxTimeout: 4000,
    retries: 4,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      let videos: string | any[] = [];
      const data = [];
      const browser = await chromium.launch({ headless: true });
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "started chromium...",
      });
      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        serviceWorkers: "allow",
        bypassCSP: true,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
      });
      const page = await context.newPage();
      const searchUrl =
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(query);
      await page.goto(searchUrl);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      while (videos.length < 40) {
        await page.waitForSelector(".ytd-video-renderer");
        const newVideos = await page.$$(
          'ytd-video-renderer:not([class*="ytd-rich-grid-video-renderer"])'
        );
        videos = [...videos, ...newVideos];
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
      }
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
          description,
          views: views.replace(/ views/g, ""),
          thumbnailUrl:
            "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg",
        });
      }
      await browser.close();
      return data;
    }, retryOptions);
    spinnies.succeed(spin, {
      text: colors.yellow("@info: ") + "scrapping done...",
    });
    return metaTube;
  } catch (error: any) {
    spinnies.fail(spin, {
      text: colors.red("@error: ") + error.message,
    });
    return null;
  }
}

async function YouTubeVideo(videoUrl: any) {
  const retryOptions = {
    minTimeout: 2000,
    maxTimeout: 4000,
    retries: 4,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const browser = await chromium.launch({ headless: true });
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "started chromium...",
      });
      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        serviceWorkers: "allow",
        bypassCSP: true,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
      });
      const page = await context.newPage();
      await page.goto(videoUrl);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      await page.waitForSelector(".style-scope.ytd-watch-metadata");
      const title = await page.$eval(
        ".style-scope.ytd-watch-metadata",
        (el: any) => el.textContent.trim()
      );
      const author = await page.$eval(
        ".yt-simple-endpoint.style-scope.yt-formatted-string",
        (el: any) => el.textContent.trim()
      );
      const views = await page.$eval(
        ".bold.style-scope.yt-formatted-string",
        (el: any) => el.textContent.trim()
      );
      const videoId = videoUrl.match(
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
      )[1];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const uploadDateElements = await page.$$eval(
        ".bold.style-scope.yt-formatted-string",
        (spans: any) => {
          const uploadDateIndex = spans.findIndex((span: any) =>
            span.textContent.includes("ago")
          );
          return uploadDateIndex >= 0
            ? spans[uploadDateIndex].textContent.trim()
            : null;
        }
      );
      const data = {
        author,
        videoId,
        videoUrl,
        thumbnailUrl,
        uploadOn: uploadDateElements,
        title: title.split("\n")[0].trim(),
        views: views.replace(/ views/g, ""),
      };
      await browser.close();
      return data;
    }, retryOptions);
    spinnies.succeed(spin, {
      text: colors.yellow("@info: ") + "scrapping done...",
    });
    return metaTube;
  } catch (error: any) {
    spinnies.fail(spin, {
      text: colors.red("@error: ") + error.message,
    });
    return null;
  }
}

async.waterfall(
  [
    async function searchYouTube() {
      const searchData = await YouTubeSearch("Angel Numbers / Ten Toes");
      return searchData;
    },
    async function getVideoInfo(searchData: any) {
      const videoData = await YouTubeVideo(searchData[0].videoLink);
      return videoData;
    },
  ],
  function (error, result) {
    if (error) console.error(colors.red("@error:"), error);
    console.log(colors.blue("@stdout:"), result);
    process.exit(0);
  }
);
