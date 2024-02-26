import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
import { randomUUID } from "crypto";
import YouTubeID from "./YouTubeId";

const spinnies = new spinClient();

export interface webVideo {
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
}): Promise<any | undefined> {
  if (!videoLink) return undefined;
  const retryOptions = {
    maxTimeout: 2000,
    minTimeout: 1000,
    retries: 2,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const browser = await puppeteer.launch({
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
      const newLink = "https://www.youtube.com/watch?v=" + videoId;
      await page.goto(newLink);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      const htmlContent = await page.content();
      const $ = load(htmlContent);
      const title: any = $(".style-scope.ytd-watch-metadata").text().trim();
      const views = $(".bold.style-scope.yt-formatted-string")
        .filter((_, vide) => $(vide).text().includes("views"))
        .text()
        .trim()
        .replace(/ views/g, "");
      const thumbnailUrls = [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/default.jpg`,
      ];
      const uploadElements = $(".bold.style-scope.yt-formatted-string")
        .map((_, vide) => {
          const text = $(vide).text().trim();
          return text.includes("ago") ? text : undefined;
        })
        .get();
      const author = $(".ytd-channel-name a").text().trim();
      const data = {
        views,
        author,
        videoId,
        thumbnailUrls,
        videoLink: newLink,
        title: title.split("\n")[0].trim(),
        uploadOn: uploadElements.length > 0 ? uploadElements[0] : undefined,
      };
      await browser.close();
      return data;
    }, retryOptions);
    spinnies.succeed(spin, {
      text:
        colors.yellow("@info: ") +
        "scrapping done, video found " +
        metaTube.title,
    });
    return metaTube;
  } catch (error: any) {
    spinnies.fail(spin, {
      text: colors.red("@error: ") + error.message,
    });
    return undefined;
  }
}
