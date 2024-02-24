import async from "async";
import colors from "colors";
import retry from "async-retry";
import puppeteer from "puppeteer";
import spinClient from "spinnies";
import { randomUUID } from "crypto";

const spinnies = new spinClient();

async function YouTubeSearch(query) {
  const retryOptions = {
    maxTimeout: 4000,
    minTimeout: 2000,
    retries: 4,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      let videos = [];
      const data = [];
      const browser = await puppeteer.launch({
        defaultViewport: false,
        userDataDir: "bin",
        headless: false,
      });
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "started chromium...",
      });
      const page = await browser.newPage();
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
  } catch (error) {
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
  ],
  function (error, result) {
    if (error) console.error(colors.red("@error:"), error);
    console.log(colors.blue("@stdout:"), result);
    process.exit(0);
  }
);
