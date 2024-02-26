import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
import { randomUUID } from "crypto";
import YouTubeID from "./YouTubeId";

const spinnies = new spinClient();
export interface webSearch {
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
export default async function webSearch({
  query,
}: {
  query: string;
}): Promise<webSearch[] | undefined> {
  if (!query) return undefined;
  const retryOptions = {
    maxTimeout: 2000,
    minTimeout: 1000,
    retries: 2,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const data: any[] = [];
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
      const searchUrl =
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(query);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      await page.goto(searchUrl);
      const content = await page.content();
      const $ = load(content);
      const videoElements: any = $(
        "ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])"
      );
      videoElements.each(async (_: any, vide: any) => {
        const title = $(vide).find("#video-title").text().trim();
        const videoLink =
          "https://www.youtube.com" + $(vide).find("a").attr("href");
        const videoId = await YouTubeID(videoLink);
        const newLink = "https://www.youtube.com/watch?v=" + videoId;
        const authorContainer = $(vide).find(".ytd-channel-name a");
        const author = authorContainer.text().trim();
        const authorUrl = authorContainer.attr("href");
        let description = "";
        const descriptionElement = $(vide).find(".metadata-snippet-text");
        if (descriptionElement) {
          description = descriptionElement.text().trim();
        }
        const views = $(vide)
          .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
          .filter((_, vide) => $(vide).text().includes("views"))
          .text()
          .trim()
          .replace(/ views/g, "");
        const uploadedOnElement = $(vide).find(
          ".inline-metadata-item.style-scope.ytd-video-meta-block"
        );
        const uploadOn =
          uploadedOnElement.length >= 2
            ? $(uploadedOnElement[1]).text().trim()
            : undefined;
        const thumbnailUrls = [
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/default.jpg`,
        ];
        data.push({
          title,
          views,
          author,
          videoId,
          uploadOn,
          authorUrl,
          description,
          thumbnailUrls,
          videoLink: newLink,
        });
      });
      await browser.close();
      return data;
    }, retryOptions);
    spinnies.succeed(spin, {
      text:
        colors.yellow("@info: ") +
        colors.white("scrapping done, total videos found " + metaTube.length),
    });
    return metaTube;
  } catch (error: any) {
    spinnies.fail(spin, {
      text: colors.red("@error: ") + error.message,
    });
    return undefined;
  }
}
