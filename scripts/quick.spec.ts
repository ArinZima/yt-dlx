import fs from "fs";
import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import getId from "get-video-id";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
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
  screenshot: boolean;
  filter: "Search" | "Video" | "Playlist";
}
const spinnies = new spinClient();
async function TypeTube({ query, screenshot, filter }: InputTypeTube) {
  const retryOptions = {
    maxTimeout: 6000,
    minTimeout: 1000,
    retries: 4,
  };
  const browser = await puppeteer.launch({
    headless: true,
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
  let metaTube: any[] | PromiseLike<any[]> = [];
  let url, snapshot, content, $: any, videoElements;
  let TubeResp: TypeVideo[] | TypeSearch[] | TypePlaylist[];
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
        for (let i = 0; i < 40; i++) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
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
                .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
                .filter((_: any, vide: any) => $(vide).text().includes("views"))
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
        spinnies.succeed(spin, {
          text: colors.green("@info: ") + colors.white("scrapping done"),
        });
        await page.close();
        await browser.close();
        return metaTube;
      }, retryOptions);
      return TubeResp;
    case "Search":
      TubeResp = await retry(async () => {
        spinnies.add(spin, {
          text: colors.green("@scrape: ") + "booting chromium...",
        });
        url =
          "https://www.youtube.com/results?search_query=" +
          decodeURIComponent(query);
        await page.goto(url);
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
        for (let i = 0; i < 40; i++) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
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
                .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
                .filter((_: any, vide: any) => $(vide).text().includes("views"))
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
}

(async () => {
  let FnTube: TypeVideo[] | TypeSearch[] | TypePlaylist[] | undefined;
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
  } catch (error) {
    console.error(colors.red("\n@error:"), error);
  }
})();
