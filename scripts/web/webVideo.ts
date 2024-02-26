import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
import { randomUUID } from "crypto";
import YouTubeID from "./YouTubeId";

const spinnies = new spinClient();

export interface WebVideo {
  thumbnailUrls: string[];
  videoLink: string;
  uploadOn: string;
  videoId: string;
  author: string;
  title: string;
  views: string;
}

export default async function webVideo({
  videoLink,
}: {
  videoLink: string;
}): Promise<WebVideo | undefined> {
  if (!videoLink) return undefined;
  const retryOptions = {
    maxTimeout: 6000,
    minTimeout: 1000,
    retries: 4,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const browser = await puppeteer.launch({
        userDataDir: "other",
        headless: true,
      });
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "booting chromium...",
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      );
      const videoId = await YouTubeID(videoLink);
      if (!videoId) {
        throw new Error("Failed to extract video ID");
      }
      const newLink = "https://www.youtube.com/watch?v=" + videoId;
      await page.goto(newLink);
      await page.waitForSelector(
        "yt-formatted-string.style-scope.ytd-watch-metadata",
        { timeout: 10000 }
      );
      await page.waitForSelector(
        "a.yt-simple-endpoint.style-scope.yt-formatted-string",
        { timeout: 10000 }
      );
      await page.waitForSelector(
        "yt-formatted-string.style-scope.ytd-watch-info-text",
        { timeout: 10000 }
      );
      setTimeout(() => {}, 1000);
      const htmlContent = await page.content();
      const $ = load(htmlContent);
      const title = $("yt-formatted-string.style-scope.ytd-watch-metadata")
        .text()
        .trim();
      const author = $("a.yt-simple-endpoint.style-scope.yt-formatted-string")
        .text()
        .trim();
      const viewsElement = $(
        "yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('views')"
      ).first();
      const views = viewsElement.text().trim().replace(" views", "");
      const uploadOnElement = $(
        "yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('ago')"
      ).first();
      const uploadOn = uploadOnElement.text().trim();
      const thumbnailUrls = [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/default.jpg`,
      ];
      const data: WebVideo = {
        views,
        author,
        videoId,
        thumbnailUrls,
        videoLink: newLink,
        title,
        uploadOn,
      };
      await browser.close();
      return data;
    }, retryOptions);
    spinnies.succeed(spin, {
      text:
        colors.yellow("@info: ") +
        colors.white("scrapping done, video found " + metaTube.title),
    });
    return metaTube;
  } catch (error: any) {
    spinnies.fail(spin, {
      text: colors.red("@error: ") + error.message,
    });

    return undefined;
  }
}
