import fs from "fs";
import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import getId from "get-video-id";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
import { z, ZodError } from "zod";
import { randomUUID } from "crypto";

interface TypeVideo {
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
interface TypeSearch {
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
interface TypePlaylist {
  playlistId: string;
  playlistLink: string;
  title: string | undefined;
  author: string | undefined;
  authorUrl: string | undefined;
  videoCount: number | undefined;
}
interface InputTypeTube {
  query: string;
  screenshot?: boolean;
  filter:
    | "Search"
    | "Video"
    | "Playlist"
    | "InfoVideo"
    | "InfoSearch"
    | "InfoPlaylist";
}
interface InfoVideo {
  views: string;
  title: string;
  author: string;
  videoId: string;
  uploadOn: string;
  videoLink: string;
  thumbnailUrls: string[];
}

interface InfoPlaylist {
  views: string;
  count: number;
  title: string;
  description: string;
  videos: [
    {
      ago: string;
      videoLink: string;
      title: string;
      views: string;
      author: string;
      videoId: string;
      authorUrl: string;
      thumbnailUrls: string[];
    }
  ];
}

const TypeTubeSchema = z.object({
  query: z.string().min(1),
  screenshot: z.boolean().optional(),
  filter: z.enum([
    "Search",
    "Video",
    "Playlist",
    "InfoVideo",
    "InfoSearch",
    "InfoPlaylist",
  ]),
});

const spinnies = new spinClient();
async function TypeTube(
  input: InputTypeTube
): Promise<
  | TypeVideo[]
  | TypeSearch[]
  | TypePlaylist[]
  | InfoVideo
  | InfoPlaylist
  | undefined
> {
  try {
    const { query, screenshot, filter } = TypeTubeSchema.parse(input);
    const retryOptions = {
      maxTimeout: 6000,
      minTimeout: 1000,
      retries: 4,
    };
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: "other",
      args: [
        "--incognito",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
    );
    const spin = randomUUID();
    let metaTube: any[] = [];
    let url, snapshot, content, $: any, videoElements;
    let TubeResp: TypeVideo[] | TypeSearch[] | TypePlaylist[] | InfoVideo;
    switch (filter) {
      case "Video":
        TubeResp = await retry(async () => {
          spinnies.add(spin, {
            text: colors.green("@scrape: ") + "booting chromium...",
          });
          url =
            "https://www.youtube.com/results?search_query=" +
            decodeURIComponent(query) +
            "&sp=EgIIAQ%253D%253D";
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
            const videoId = getId(
              "https://www.youtube.com" + $(vide).find("a").attr("href")
            ).id;
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
            text: colors.green("@info: ") + colors.white("scrapping done"),
          });
          await page.close();
          await browser.close();
          return metaTube;
        }, retryOptions);
        return TubeResp;
      case "Search":
      case "InfoSearch":
        TubeResp = await retry(async () => {
          spinnies.add(spin, {
            text: colors.green("@scrape: ") + "booting chromium...",
          });
          url =
            "https://www.youtube.com/results?search_query=" +
            decodeURIComponent(query);
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
            const videoId = getId(
              "https://www.youtube.com" + $(vide).find("a").attr("href")
            ).id;
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
            text: colors.green("@info: ") + colors.white("scrapping done"),
          });
          await page.close();
          await browser.close();
          return metaTube;
        }, retryOptions);
        return TubeResp;
      case "Playlist":
        TubeResp = await retry(async () => {
          spinnies.add(spin, {
            text: colors.green("@scrape: ") + "booting chromium...",
          });
          url =
            "https://www.youtube.com/results?search_query=" +
            decodeURIComponent(query) +
            "&sp=EgIQAw%253D%253D";
          await page.goto(url);
          for (let i = 0; i < 40; i++) {
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
          const playlistElements = await page.$$("ytd-playlist-renderer");
          for (const playlist of playlistElements) {
            const playlistLink: any = await playlist.$eval(
              ".style-scope.ytd-playlist-renderer #view-more a",
              (element) => element.getAttribute("href")
            );
            const vCount = await playlist.$eval(
              ".style-scope.ytd-playlist-renderer",
              (element: any) => element.innerText.trim()
            );
            metaTube.push({
              title:
                (
                  await playlist.$eval(
                    ".style-scope.ytd-playlist-renderer #video-title",
                    (element: any) => element.innerText.trim()
                  )
                ).trim() || undefined,
              author:
                (
                  await playlist.$eval(
                    ".yt-simple-endpoint.style-scope.yt-formatted-string",
                    (element: any) => element.innerText
                  )
                ).trim() || undefined,
              playlistId: playlistLink.split("list=")[1] || undefined,
              playlistLink: "https://www.youtube.com" + playlistLink,
              authorUrl:
                "https://www.youtube.com" +
                  (await playlist.$eval(
                    ".yt-simple-endpoint.style-scope.yt-formatted-string",
                    (element) => element.getAttribute("href")
                  )) || undefined,
              videoCount:
                parseInt(vCount.replace(/ videos\nNOW PLAYING/g, "")) ||
                undefined,
            });
          }
          spinnies.succeed(spin, {
            text: colors.green("@info: ") + colors.white("scrapping done"),
          });
          await page.close();
          await browser.close();
          return metaTube;
        }, retryOptions);
        return TubeResp;
      case "InfoVideo":
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
              path: "TypeVideo.png",
            });
            fs.writeFileSync("TypeVideo.png", snapshot);
            spinnies.update(spin, {
              text: colors.yellow("@scrape: ") + "took snapshot...",
            });
          }
          const videoId = getId(query).id as string;
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
          const author = $(
            "a.yt-simple-endpoint.style-scope.yt-formatted-string"
          )
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
          const metaTube: InfoVideo = {
            views,
            title,
            author,
            videoId,
            uploadOn,
            thumbnailUrls,
            videoLink: "https://www.youtube.com/watch?v=" + videoId,
          };
          spinnies.succeed(spin, {
            text: colors.green("@info: ") + colors.white("scrapping done"),
          });
          await page.close();
          await browser.close();
          return metaTube;
        }, retryOptions);
        return TubeResp;
      case "InfoPlaylist":
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
              path: "TypeVideo.png",
            });
            fs.writeFileSync("TypeVideo.png", snapshot);
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
          const videoCountText: any = $(
            "yt-formatted-string.byline-item"
          ).text();
          const playlistVideoCount = parseInt(videoCountText.match(/\d+/)[0]);
          const viewsText: any = $("yt-formatted-string.byline-item")
            .eq(1)
            .text();
          const playlistViews = viewsText.replace(/,/g, "").match(/\d+/)[0];
          let playlistDescription = $("span#plain-snippet-text").text();
          const VideoElements: any = $("ytd-playlist-video-renderer");
          VideoElements.each(async (_: any, vide: any) => {
            const title = $(vide).find("h3").text().trim();
            const videoLink =
              "https://www.youtube.com" + $(vide).find("a").attr("href");
            const videoId = getId(videoLink).id;
            const newLink = "https://www.youtube.com/watch?v=" + videoId;
            const author = $(vide)
              .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
              .text();
            const authorUrl =
              "https://www.youtube.com" +
              $(vide)
                .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                .attr("href");
            const views = $(vide)
              .find(".style-scope.ytd-video-meta-block span:first-child")
              .text();
            const ago = $(vide)
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
              title,
              author,
              videoId,
              authorUrl,
              thumbnailUrls,
              videoLink: newLink,
              views: views.replace(/ views/g, ""),
            });
          });
          spinnies.succeed(spin, {
            text: colors.green("@info: ") + colors.white("scrapping done"),
          });
          await page.close();
          await browser.close();
          return {
            ...metaTube,
            playlistDescription: playlistDescription.trim(),
            playlistVideoCount,
            playlistTitle,
            playlistViews,
          };
        }, retryOptions);
        return TubeResp;
      default:
        spinnies.add(spin, {
          text: colors.green("@scrape: ") + "booting chromium...",
        });
        spinnies.fail(spin, {
          text: colors.red("@error: ") + "incorrect filter parameter.",
        });
        await page.close();
        await browser.close();
        return undefined;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw error.errors.map((err) => err.message).join(", ");
    } else if (error instanceof Error) throw error.message;
    else throw "Internal server error";
  }
}

(async () => {
  console.clear();
  let FnTube:
    | TypeVideo[]
    | TypeSearch[]
    | TypePlaylist[]
    | InfoVideo
    | InfoPlaylist
    | undefined;
  try {
    console.log(colors.blue("@test:"), "Search");
    console.log(colors.blue("@screenshot:"), false);
    FnTube = await TypeTube({
      screenshot: false,
      query: "Emptiness",
      filter: "Search",
    });
    if (FnTube) console.log(colors.green("@pass"), FnTube);
    else console.error(colors.red("@fail"), FnTube);

    console.log(colors.blue("@test:"), "InfoSearch");
    console.log(colors.blue("@screenshot:"), false);
    FnTube = await TypeTube({
      screenshot: false,
      query: "Emptiness",
      filter: "InfoSearch",
    });
    if (FnTube) console.log(colors.green("@pass"), FnTube);
    else console.error(colors.red("@fail"), FnTube);

    console.log(colors.blue("@test:"), "InfoVideo");
    console.log(colors.blue("@screenshot:"), false);
    FnTube = await TypeTube({
      screenshot: false,
      filter: "InfoVideo",
      query: "https://www.youtube.com/watch?v=ZFWC4SiZBao",
    });
    if (FnTube) console.log(colors.green("@pass"), FnTube);
    else console.error(colors.red("@fail"), FnTube);

    console.log(colors.blue("@test:"), "Video");
    console.log(colors.blue("@screenshot:"), false);
    FnTube = await TypeTube({
      screenshot: false,
      query: "Emptiness",
      filter: "Video",
    });
    if (FnTube) console.log(colors.green("@pass"), FnTube);
    else console.error(colors.red("@fail"), FnTube);

    console.log(colors.blue("@test:"), "Playlist");
    console.log(colors.blue("@screenshot:"), false);
    FnTube = await TypeTube({
      screenshot: false,
      query: "Emptiness",
      filter: "Playlist",
    });
    if (FnTube) console.log(colors.green("@pass"), FnTube);
    else console.error(colors.red("@fail"), FnTube);

    console.log(colors.blue("@test:"), "error-check-query-empty");
    console.log(colors.blue("@screenshot:"), false);
    FnTube = await TypeTube({
      screenshot: false,
      filter: "Search",
      query: "",
    });
    if (FnTube) console.log(colors.green("@pass"), FnTube);
    else console.error(colors.red("@fail"), FnTube);
  } catch (error) {
    console.error(colors.red("@error:"), error);
  }
})();
