import colors from "colors";
import retry from "async-retry";
import spinClient from "spinnies";
import { randomUUID } from "crypto";
import { chromium } from "playwright";
import YouTubeID from "../../backend/util/YouTubeId";

const spinnies = new spinClient();
export default async function YouTubeVideo({
  videoLink,
}: {
  videoLink: string;
}) {
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
