import async from "async";
import colors from "colors";
import retry from "async-retry";
import spinClient from "spinnies";
import { randomUUID } from "crypto";
import { chromium } from "playwright";
import YouTubeID from "../backend/util/YouTubeId";

const spinnies = new spinClient();
const proxyList = [
  "http://38.62.222.219:3128",
  "http://154.6.97.227:3128",
  "http://154.6.97.129:3128",
  "http://154.6.99.45:3128",
  "http://38.62.220.3:3128",
  "http://154.6.96.253:3128",
  "http://38.62.222.236:3128",
  "http://38.62.221.46:3128",
  "http://154.6.97.24:3128",
  "http://38.62.222.102:3128",
  "http://154.6.97.130:3128",
  "http://154.6.96.148:3128",
  "http://38.62.221.70:3128",
  "http://38.62.220.225:3128",
  "http://154.6.99.166:3128",
  "http://38.62.221.105:3128",
  "http://154.6.96.102:3128",
  "http://154.6.99.255:3128",
  "http://154.6.97.235:3128",
  "http://38.62.222.180:3128",
  "http://38.62.221.173:3128",
  "http://38.62.221.240:3128",
  "http://38.62.220.123:3128",
  "http://38.62.223.208:3128",
  "http://38.62.222.52:3128",
  "http://38.62.221.58:3128",
  "http://38.62.223.233:3128",
  "http://38.62.220.67:3128",
  "http://154.6.98.95:3128",
  "http://38.62.223.113:3128",
  "http://154.6.98.172:3128",
  "http://154.6.97.170:3128",
  "http://38.62.220.21:3128",
  "http://154.6.97.177:3128",
  "http://154.6.96.214:3128",
  "http://38.62.220.81:3128",
  "http://38.62.220.218:3128",
  "http://38.62.221.237:3128",
  "http://38.62.222.172:3128",
  "http://154.6.98.60:3128",
  "http://154.6.97.43:3128",
  "http://38.62.220.51:3128",
  "http://38.62.223.72:3128",
  "http://154.6.98.151:3128",
  "http://38.62.223.133:3128",
  "http://154.6.99.141:3128",
  "http://38.62.220.244:3128",
  "http://38.62.220.222:3128",
  "http://154.6.99.24:3128",
  "http://154.6.98.45:3128",
  "http://38.62.221.226:3128",
  "http://154.6.99.42:3128",
  "http://154.6.97.184:3128",
  "http://154.6.96.228:3128",
  "http://154.6.97.107:3128",
  "http://38.62.223.74:3128",
  "http://38.62.222.63:3128",
  "http://38.62.222.33:3128",
  "http://154.6.96.75:3128",
  "http://38.62.221.28:3128",
  "http://154.6.99.95:3128",
  "http://154.6.97.152:3128",
  "http://38.62.223.185:3128",
  "http://38.62.223.102:3128",
  "http://154.6.99.214:3128",
  "http://38.62.223.119:3128",
  "http://38.62.220.240:3128",
  "http://38.62.222.238:3128",
  "http://38.62.222.36:3128",
  "http://38.62.223.215:3128",
  "http://154.6.97.39:3128",
  "http://154.6.98.66:3128",
  "http://154.6.96.183:3128",
  "http://154.6.99.169:3128",
  "http://38.62.220.22:3128",
  "http://154.6.97.178:3128",
  "http://154.6.97.48:3128",
  "http://154.6.98.185:3128",
  "http://38.62.220.87:3128",
  "http://154.6.98.253:3128",
  "http://38.62.222.43:3128",
  "http://38.62.221.76:3128",
  "http://38.62.223.57:3128",
  "http://154.6.99.53:3128",
  "http://38.62.222.154:3128",
  "http://38.62.223.159:3128",
  "http://38.62.223.43:3128",
  "http://38.62.221.248:3128",
  "http://154.6.98.67:3128",
  "http://154.6.96.83:3128",
  "http://154.6.96.22:3128",
  "http://154.6.99.75:3128",
  "http://38.62.223.187:3128",
  "http://38.62.221.113:3128",
  "http://154.6.98.191:3128",
  "http://154.6.97.100:3128",
  "http://154.6.98.146:3128",
  "http://38.62.220.5:3128",
  "http://38.62.220.226:3128",
  "http://154.6.96.26:3128",
];

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
}: YouTubeSearch): Promise<reYouTubeSearch[] | null> {
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
      const rproxy: any =
        proxyList[Math.floor(Math.random() * proxyList.length)];
      const browser = await chromium.launch({
        proxy: { server: rproxy },
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
    return null;
  }
}
async function YouTubeVideo({ videoLink }: { videoLink: string }) {
  if (!videoLink) return null;
  const retryOptions = {
    maxTimeout: 4000,
    minTimeout: 2000,
    retries: 2,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const rproxy: any =
        proxyList[Math.floor(Math.random() * proxyList.length)];
      const browser = await chromium.launch({
        proxy: { server: rproxy },
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
            : null;
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
    return null;
  }
}

async.waterfall(
  [
    async function searchYouTube() {
      const searchData = await YouTubeSearch({
        query: "Ek chaturnar",
        number: 10,
      });
      if (!searchData) return null;
      console.log(colors.green("@videos:"), searchData);
      console.log(colors.green("@videos:"), searchData.length);
      return searchData;
    },
    async function getVideoInfo(searchData: any) {
      if (!searchData) return null;
      const videoData = await YouTubeVideo({
        videoLink: searchData[0].videoLink,
      });
      return videoData;
    },
  ],
  function (error, result) {
    if (error) console.error(colors.red("@error:"), error);
    console.log(colors.blue("@stdout:"), result);
    process.exit(0);
  }
);
