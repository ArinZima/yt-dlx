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

export interface IpOp {
  query: string;
  verbose?: boolean;
  screenshot?: boolean;
  type: keyof { video: "video"; playlist: "playlist" };
}

export interface TypePlaylist {
  playlistId: string;
  playlistLink: string;
  title: string | undefined;
  author: string | undefined;
  authorUrl: string | undefined;
  videoCount: number | undefined;
}

export interface TypeVideo {
  videoId: string;
  videoLink: string;
  thumbnailUrls: string[];
  title: string | undefined;
  views: string | undefined;
  author: string | undefined;
  uploadOn: string | undefined;
  authorUrl: string | undefined;
  description: string | undefined;
}

export default async function SearchVideos(
  input: IpOp
): Promise<TypeVideo[] | TypePlaylist[] | undefined> {
  try {
    const QuerySchema = z.object({
      query: z
        .string()
        .min(1)
        .refine(
          async (query) => {
            const result = await YouTubeId(query);
            return result === undefined;
          },
          {
            message: "Query must not be a YouTube video/Playlist link",
          }
        ),
      verbose: z.boolean().optional(),
      screenshot: z.boolean().optional(),
    });
    const { query, screenshot, verbose } = await QuerySchema.parseAsync(input);
    await crawler(verbose);
    const retryOptions = {
      maxTimeout: 6000,
      minTimeout: 1000,
      retries: 4,
    };
    let url: string;
    let $: cheerio.Root;
    const spin = randomUUID();
    let content: string | Buffer;
    let metaTube: TypeVideo[] = [];
    const spinnies = new spinClient();
    let videoElements: cheerio.Cheerio;
    let playlistMeta: TypePlaylist[] = [];
    let TubeResp: TypeVideo[] | TypePlaylist[];
    let snapshot: string | Buffer | NodeJS.ArrayBufferView;
    spinnies.add(spin, {
      text: colors.green("@scrape: ") + "booting chromium...",
    });
    switch (input.type) {
      case "video":
        TubeResp = await retry(async () => {
          url =
            "https://www.youtube.com/results?search_query=" +
            encodeURIComponent(query) +
            "&sp=EgIQAQ%253D%253D";
          await page.goto(url);
          for (let i = 0; i < 40; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          }
          spinnies.update(spin, {
            text: colors.yellow("@scrape: ") + "waiting for hydration...",
          });
          if (screenshot) {
            snapshot = await page.screenshot({
              path: "TypeVideo.png",
            });
            fs.writeFileSync("TypeVideo.png", snapshot);
            spinnies.update(spin, {
              text: colors.yellow("@scrape: ") + "took snapshot...",
            });
          }
          content = await page.content();
          $ = load(content);
          videoElements = $(
            "ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])"
          );
          videoElements.each(async (_: any, vide: any) => {
            const videoId: any = await YouTubeId(
              "https://www.youtube.com" + $(vide).find("a").attr("href")
            );
            const authorContainer = $(vide).find(".ytd-channel-name a");
            const uploadedOnElement = $(vide).find(
              ".inline-metadata-item.style-scope.ytd-video-meta-block"
            );
            metaTube.push({
              title: $(vide).find("#video-title").text().trim() || undefined,
              views:
                $(vide)
                  .find(
                    ".inline-metadata-item.style-scope.ytd-video-meta-block"
                  )
                  .filter((_: any, vide: any) =>
                    $(vide).text().includes("views")
                  )
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
                $(vide).find(".metadata-snippet-text").text().trim() ||
                undefined,
            });
          });
          spinnies.succeed(spin, {
            text:
              colors.green("@info: ") +
              colors.white("scrapping done for ") +
              query,
          });
          return metaTube;
        }, retryOptions);
        await closers(browser);
        return TubeResp;
      case "playlist":
        TubeResp = await retry(async () => {
          url =
            "https://www.youtube.com/results?search_query=" +
            encodeURIComponent(query) +
            "&sp=EgIQAw%253D%253D";
          await page.goto(url);
          for (let i = 0; i < 80; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          }
          spinnies.update(spin, {
            text: colors.yellow("@scrape: ") + "waiting for hydration...",
          });
          if (screenshot) {
            snapshot = await page.screenshot({
              path: "TypePlaylist.png",
            });
            fs.writeFileSync("TypePlaylist.png", snapshot);
            spinnies.update(spin, {
              text: colors.yellow("@scrape: ") + "took snapshot...",
            });
          }
          const content = await page.content();
          const $ = load(content);
          const playlistElements = $("ytd-playlist-renderer");
          playlistElements.each((_index, element) => {
            const playlistLink: any = $(element)
              .find(".style-scope.ytd-playlist-renderer #view-more a")
              .attr("href");
            const vCount = $(element).text().trim();
            playlistMeta.push({
              title:
                $(element)
                  .find(".style-scope.ytd-playlist-renderer #video-title")
                  .text()
                  .replace(/\s+/g, " ")
                  .trim() || undefined,
              author:
                $(element)
                  .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                  .text()
                  .replace(/\s+/g, " ")
                  .trim() || undefined,
              playlistId: playlistLink.split("list=")[1],
              playlistLink: "https://www.youtube.com" + playlistLink,
              authorUrl: $(element)
                .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                .attr("href")
                ? "https://www.youtube.com" +
                  $(element)
                    .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                    .attr("href")
                : undefined,
              videoCount:
                parseInt(vCount.replace(/ videos\nNOW PLAYING/g, "")) ||
                undefined,
            });
          });
          spinnies.succeed(spin, {
            text:
              colors.green("@info: ") +
              colors.white("scrapping done for ") +
              query,
          });
          return playlistMeta;
        }, retryOptions);
        await closers(browser);
        return TubeResp;
      default:
        spinnies.fail(spin, {
          text:
            colors.red("@error: ") +
            colors.white("wrong filter type provided."),
        });
        await closers(browser);
        return undefined;
    }
  } catch (error) {
    await closers(browser);
    switch (true) {
      case error instanceof ZodError:
        throw new Error(
          colors.red("@error: ") +
            error.errors.map((error) => error.message).join(", ")
        );
      case error instanceof Error:
        throw new Error(colors.red("@error: ") + error.message);
      default:
        throw new Error(colors.red("@error: ") + "internal server error");
    }
  }
}

process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));
