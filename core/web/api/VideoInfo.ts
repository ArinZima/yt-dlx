import fs from "fs";
import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import closers from "../closers";
import spinClient from "spinnies";
import { z, ZodError } from "zod";
import { randomUUID } from "crypto";
import YouTubeId from "../YouTubeId";
import crawler, { browser, page } from "../crawler";

export interface InputYouTube {
  query: string;
  screenshot?: boolean;
}
export interface VideoInfoType {
  views: string;
  title: string;
  author: string;
  videoId: string;
  uploadOn: string;
  videoLink: string;
  thumbnailUrls: string[];
}
export default async function VideoInfo(
  input: InputYouTube
): Promise<VideoInfoType | undefined> {
  try {
    await crawler();
    let query: string;
    const spinnies = new spinClient();
    const QuerySchema = z.object({
      query: z
        .string()
        .min(1)
        .refine(
          async (input) => {
            switch (true) {
              case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
                input
              ):
                const resultLink = await YouTubeId(input);
                if (resultLink !== undefined) {
                  query = input;
                  return true;
                }
                break;
              default:
                const resultId = await YouTubeId(
                  `https://www.youtube.com/watch?v=${input}`
                );
                if (resultId !== undefined) {
                  query = `https://www.youtube.com/watch?v=${input}`;
                  return true;
                }
                break;
            }
            return false;
          },
          {
            message: "Query must be a valid YouTube video Link or ID.",
          }
        ),
      screenshot: z.boolean().optional(),
    });
    const { screenshot } = await QuerySchema.parseAsync(input);
    const retryOptions = {
      maxTimeout: 6000,
      minTimeout: 1000,
      retries: 4,
    };
    let TubeResp: VideoInfoType;
    const spin = randomUUID();
    let snapshot: string | Buffer | NodeJS.ArrayBufferView;
    TubeResp = await retry(async () => {
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "booting chromium...",
      });
      await page.goto(query);
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      if (screenshot) {
        snapshot = await page.screenshot({
          path: "FilterVideo.png",
        });
        fs.writeFileSync("FilterVideo.png", snapshot);
        spinnies.update(spin, {
          text: colors.yellow("@scrape: ") + "took snapshot...",
        });
      }
      const videoId = (await YouTubeId(query)) as string;
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
      const metaTube: VideoInfoType = {
        views,
        author,
        videoId,
        uploadOn,
        thumbnailUrls,
        title: title.trim(),
        videoLink: "https://www.youtube.com/watch?v=" + videoId,
      };
      spinnies.succeed(spin, {
        text:
          colors.green("@info: ") + colors.white("scrapping done for ") + query,
      });
      return metaTube;
    }, retryOptions);
    await closers(browser);
    return TubeResp;
  } catch (error) {
    await closers(browser);
    switch (true) {
      case error instanceof ZodError:
        throw error.errors.map((err) => err.message).join(", ");
      case error instanceof Error:
        throw error.message;
      default:
        throw "Internal server error";
    }
  }
}

process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));
