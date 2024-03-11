import fs from "fs";
import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import closers from "../closers";
import { z, ZodError } from "zod";
import spinClient from "spinnies";
import { randomUUID } from "crypto";
import YouTubeId from "../YouTubeId";
import crawler, { browser, page } from "../crawler";

export interface InputYouTube {
  query: string;
  proxy?: string;
  verbose?: boolean;
  screenshot?: boolean;
}
export interface PlaylistInfoType {
  playlistViews: number;
  playlistTitle: string;
  playlistVideoCount: number;
  playlistDescription: string;
  playlistVideos: {
    ago: string;
    title: string;
    views: string;
    author: string;
    videoId: string;
    videoLink: string;
    authorUrl: string;
    thumbnailUrls: string[];
  }[];
}

export default async function PlaylistInfo(
  input: InputYouTube
): Promise<PlaylistInfoType | undefined> {
  try {
    let query: string;
    const spinnies = new spinClient();
    const QuerySchema = z.object({
      query: z
        .string()
        .min(1)
        .refine(
          async (input) => {
            switch (true) {
              case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
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
                  `https://www.youtube.com/playlist?list=${input}`
                );
                if (resultId !== undefined) {
                  query = `https://www.youtube.com/playlist?list=${input}`;
                  return true;
                }
                break;
            }
            return false;
          },
          {
            message: "Query must be a valid YouTube Playlist Link or ID.",
          }
        ),
      proxy: z.string().optional(),
      verbose: z.boolean().optional(),
      screenshot: z.boolean().optional(),
    });
    const { screenshot, verbose, proxy } = await QuerySchema.parseAsync(input);
    await crawler(verbose, proxy);
    const retryOptions = {
      maxTimeout: 6000,
      minTimeout: 1000,
      retries: 4,
    };
    let metaTube: any[] = [];
    const spin = randomUUID();
    let TubeResp: PlaylistInfoType;
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
      const content = await page.content();
      const $ = load(content);
      const playlistTitle = $(
        "yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string"
      )
        .text()
        .trim();
      const viewsText: any = $("yt-formatted-string.byline-item").eq(1).text();
      const playlistViews = parseInt(
        viewsText.replace(/,/g, "").match(/\d+/)[0]
      );
      let playlistDescription = $("span#plain-snippet-text").text();
      $("ytd-playlist-video-renderer").each(async (_index, element) => {
        const title = $(element).find("h3").text().trim();
        const videoLink =
          "https://www.youtube.com" + $(element).find("a").attr("href");
        const videoId = await YouTubeId(videoLink);
        const newLink = "https://www.youtube.com/watch?v=" + videoId;
        const author = $(element)
          .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
          .text();
        const authorUrl =
          "https://www.youtube.com" +
          $(element)
            .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
            .attr("href");
        const views = $(element)
          .find(".style-scope.ytd-video-meta-block span:first-child")
          .text();
        const ago = $(element)
          .find(".style-scope.ytd-video-meta-block span:last-child")
          .text();
        const thumbnailUrls = [
          `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/default.jpg`,
        ];
        metaTube.push({
          ago,
          author,
          videoId,
          authorUrl,
          thumbnailUrls,
          videoLink: newLink,
          title: title.trim(),
          views: views.replace(/ views/g, ""),
        });
      });
      spinnies.succeed(spin, {
        text:
          colors.green("@info: ") + colors.white("scrapping done for ") + query,
      });
      return {
        playlistVideos: metaTube,
        playlistDescription: playlistDescription.trim(),
        playlistVideoCount: metaTube.length,
        playlistViews,
        playlistTitle,
      };
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
