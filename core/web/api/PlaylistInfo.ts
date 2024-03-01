import fs from "fs";
import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import { z, ZodError } from "zod";
import spinClient from "spinnies";
import { randomUUID } from "crypto";
import YouTubeId from "../YouTubeId";
import crawler, { browser, page } from "../crawler";
export interface InputYouTube {
  query: string;
  screenshot?: boolean;
}
export interface PlaylistVideos {
  ago: string;
  videoLink: string;
  title: string;
  views: string;
  author: string;
  videoId: string;
  authorUrl: string;
  thumbnailUrls: string[];
}
export interface PlaylistInfoType {
  playlistViews: number;
  playlistTitle: string;
  playlistVideoCount: number;
  playlistDescription: string;
  playlistVideos: PlaylistVideos[];
}

export default async function PlaylistInfo(
  input: InputYouTube
): Promise<PlaylistInfoType | undefined> {
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
      screenshot: z.boolean().optional(),
    });
    const { screenshot } = await QuerySchema.parseAsync(input);
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
      const videoCountText: any = $("yt-formatted-string.byline-item").text();
      const playlistVideoCount = parseInt(videoCountText.match(/\d+/)[0]);
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
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
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
      await page.close();
      await browser.close();
      return {
        playlistVideos: metaTube,
        playlistDescription: playlistDescription.trim(),
        playlistVideoCount,
        playlistViews,
        playlistTitle,
      };
    }, retryOptions);
    return TubeResp;
  } catch (error) {
    if (page) await page.close();
    if (browser) await browser.close();
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
