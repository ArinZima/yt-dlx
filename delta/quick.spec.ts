import async from "async";
import colors from "colors";
import retry from "async-retry";
import spinClient from "spinnies";
import { randomUUID } from "crypto";
import { chromium } from "playwright";
import YouTubeID from "../backend/util/YouTubeId";

const spinnies = new spinClient();

interface reYouTubeSearch {
  title: string;
  views?: string;
  author?: string;
  videoId: string;
  uploadOn?: string;
  videoLink: string;
  authorUrl?: string;
  description?: string;
  authorImage?: string;
  thumbnailUrls: string[];
}
interface YouTubeSearch {
  query: string;
  number: number;
}
async function YouTubeSearch({
  query,
  number,
}: YouTubeSearch): Promise<reYouTubeSearch[] | undefined> {
  const retryOptions = {
    maxTimeout: 4000,
    minTimeout: 2000,
    retries: 2,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      let videos: string | any[] = [];
      const data = [];
      const browser = await chromium.launch({
        headless: true,
      });
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
      while (videos.length < number) {
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
        const uploadedOnElement = await vid.$$(
          ".inline-metadata-item.style-scope.ytd-video-meta-block"
        );
        const uploadOn =
          uploadedOnElement && uploadedOnElement.length >= 2
            ? await uploadedOnElement[1]
                .getProperty("innerText")
                .then((property: { jsonValue: () => any }) =>
                  property.jsonValue()
                )
            : undefined;
        const thumbnailUrls = [
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/default.jpg`,
        ];
        const authorImageElement = await vid.$(".style-scope.yt-img-shadow");
        const authorImage = authorImageElement
          ? await authorImageElement
              .getProperty("src")
              .then((property: { jsonValue: () => any }) =>
                property.jsonValue()
              )
          : undefined;
        data.push({
          title,
          author,
          videoId,
          uploadOn,
          authorUrl,
          videoLink,
          description,
          authorImage,
          thumbnailUrls,
          views: views.replace(/ views/g, ""),
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
    return undefined;
  }
}
async function YouTubeVideo({ videoLink }: { videoLink: string }) {
  if (!videoLink) return undefined;
  const retryOptions = {
    maxTimeout: 4000,
    minTimeout: 2000,
    retries: 2,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const browser = await chromium.launch({
        headless: true,
      });
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
      await page.goto(videoLink);
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
      const videoId: any = await YouTubeID(videoLink);
      const thumbnailUrls = [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/default.jpg`,
      ];
      const uploadDateElements = await page.$$eval(
        ".bold.style-scope.yt-formatted-string",
        (spans: any) => {
          const uploadDateIndex = spans.findIndex((span: any) =>
            span.textContent.includes("ago")
          );
          return uploadDateIndex >= 0
            ? spans[uploadDateIndex].textContent.trim()
            : undefined;
        }
      );
      const data = {
        author,
        videoId,
        videoLink,
        thumbnailUrls,
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
    return undefined;
  }
}
async function YouTubePlaylist({ playlistLink }: { playlistLink: string }) {
  const retryOptions = {
    maxTimeout: 4000,
    minTimeout: 2000,
    retries: 2,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const playlistData = [];
      const browser = await chromium.launch({
        headless: true,
      });
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
      await page.goto(playlistLink);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      const titleElement: any = await page.$(
        "yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string"
      );
      const playlistTitle = await titleElement.textContent();
      const videoCountElement: any = await page.$(
        "yt-formatted-string.byline-item"
      );
      const videoCountText = await videoCountElement.textContent();
      const videoCount = parseInt(videoCountText.match(/\d+/)[0]);
      const viewsElement: any = await page.$$(
        "yt-formatted-string.byline-item"
      );
      const viewsText = await viewsElement[1].textContent();
      const views = viewsText.replace(/,/g, "").match(/\d+/)[0];
      const descriptionElement: any = await page.$("span#plain-snippet-text");
      let playlistDescription = await descriptionElement.textContent();
      const VideoElements = await page.$$("ytd-playlist-video-renderer");
      for (const vide of VideoElements) {
        const TitleElement: any = await vide.$("h3");
        let title = await TitleElement.textContent();
        title = title.trim();
        const urlElement: any = await vide.$("a");
        const url: any =
          "https://www.youtube.com" + (await urlElement.getAttribute("href"));
        const videoId = url.match(/(?<=v=)[^&\s]+/)[0];
        const AuthorElement: any = await vide.$(
          ".yt-simple-endpoint.style-scope.yt-formatted-string"
        );
        const author = await AuthorElement.textContent();
        const authorUrl = await AuthorElement.getAttribute("href");
        const ViewsElement: any = await vide.$(
          ".style-scope.ytd-video-meta-block span:first-child"
        );
        const views = await ViewsElement.textContent();
        const AgoElement: any = await vide.$(
          ".style-scope.ytd-video-meta-block span:last-child"
        );
        const ago = await AgoElement.textContent();
        const thumbnailUrls = [
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/default.jpg`,
        ];
        playlistData.push({
          ago,
          url,
          title,
          author,
          videoId,
          thumbnailUrls,
          views: views.replace(/ views/g, ""),
          authorUrl: "https://www.youtube.com" + authorUrl,
        });
      }
      await browser.close();
      return {
        views,
        count: videoCount,
        title: playlistTitle,
        description: playlistDescription.trim(),
        videos: playlistData,
      };
    }, retryOptions);
    spinnies.succeed(spin, {
      text: colors.yellow("@info: ") + "scrapping done...",
    });
    return metaTube;
  } catch (error: any) {
    spinnies.fail(spin, {
      text: colors.red("@error: ") + error.message,
    });
    return undefined;
  }
}

await async.waterfall([
  async function searchPlaylist() {
    const metaTube = await YouTubePlaylist({
      playlistLink:
        "https://youtube.com/playlist?list=PL3oW2tjiIxvQ60uIjLdo7vrUe4ukSpbKl&si=Z6SMzOT_2xNMfGlg",
    });
    if (!metaTube) {
      console.log(
        colors.red("@error:"),
        "no data found from YouTubePlaylist()"
      );
      process.exit(500);
    }
    console.log(colors.magenta("@playlist:"), metaTube);
    console.log(colors.magenta("@total-views:"), metaTube.views);
    console.log(colors.magenta("@count:"), metaTube.videos.length);
    return metaTube;
  },
  async function searchYouTube() {
    const metaTube = await YouTubeSearch({
      query: "Ek chaturnar",
      number: 10,
    });
    if (!metaTube) {
      console.log(colors.red("@error:"), "no data found from YouTubeSearch()");
      process.exit(500);
    }
    console.log(colors.blue("@count:"), metaTube.length);
    return metaTube;
  },
  async function getVideoInfo(metaTube: any) {
    if (!metaTube) {
      console.log(colors.red("@error:"), "no data found from YouTubeSearch()");
      process.exit(500);
    }
    const videoData = await YouTubeVideo({
      videoLink: metaTube[0].videoLink,
    });
    if (!videoData) {
      console.log(colors.red("@error:"), "no data found from YouTubeVideo()");
      process.exit(500);
    }
    console.log(colors.green("@video:"), videoData);
    return videoData;
  },
]);
