import async from "async";
import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
import { randomUUID } from "crypto";

const spinnies = new spinClient();
export interface webSearch {
  title?: string;
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
    maxTimeout: 6000,
    minTimeout: 1000,
    retries: 4,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const data: webSearch[] = [];
      const browser = await puppeteer.launch({
        userDataDir: "other",
        headless: false,
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
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      const content = await page.content();
      const $ = load(content);
      const videoElements: any = $(
        "ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])"
      );
      videoElements.each(async (_: any, vide: any) => {
        const videoUrl =
          "https://www.youtube.com" + $(vide).find("a").attr("href");
        const videoId = videoUrl.match(
          /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*[=\/]([^&\n?#]+)/i
        )?.[1] as string;
        const authorContainer = $(vide).find(".ytd-channel-name a");
        const uploadedOnElement = $(vide).find(
          ".inline-metadata-item.style-scope.ytd-video-meta-block"
        );
        data.push({
          title: $(vide).find("#video-title").text().trim() || undefined,
          views:
            $(vide)
              .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
              .filter((_, vide) => $(vide).text().includes("views"))
              .text()
              .trim()
              .replace(/ views/g, "") || undefined,
          author: authorContainer.text().trim() || undefined,
          videoId,
          uploadOn:
            uploadedOnElement.length >= 2
              ? $(uploadedOnElement[1]).text().trim()
              : undefined,
          authorUrl:
            "https://www.youtube.com" + authorContainer.attr("href") ||
            undefined,
          videoLink: "https://www.youtube.com/watch?v=" + videoId,
          thumbnailUrls: [
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/default.jpg`,
          ],
          description:
            $(vide).find(".metadata-snippet-text").text().trim() || undefined,
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

async.waterfall([
  async function runTest() {
    const metaTube = await webSearch({
      query: "Angel Numbers | Ten Toes",
    });
    if (!metaTube) return console.log(colors.red("@error:"), "no data found");
    console.log(colors.blue("@webSearch:"), metaTube);
    console.log(colors.blue("@count:"), metaTube.length);
    return metaTube;
  },
]);
