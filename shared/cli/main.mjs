#!/usr/bin/env node
import { fileURLToPath } from 'url';
import * as path22 from 'path';
import path22__default from 'path';
import * as z4 from 'zod';
import { z } from 'zod';
import colors28 from 'colors';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';
import spinClient from 'spinnies';
import { randomUUID } from 'crypto';
import { spawn, exec } from 'child_process';
import * as fs2 from 'fs';
import { promisify } from 'util';
import * as os from 'os';
import readline from 'readline';
import ffmpeg from 'fluent-ffmpeg';
import minimist from 'minimist';

var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path22__default.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();
async function closers(browser2) {
  const pages = await browser2.pages();
  await Promise.all(pages.map((page2) => page2.close()));
  await browser2.close();
}

// core/web/YouTubeId.ts
function YouTubeID(videoLink) {
  return new Promise((resolve, _) => {
    if (/youtu\.?be/.test(videoLink)) {
      var i;
      var patterns = [
        /youtu\.be\/([^#\&\?]{11})/,
        /\?v=([^#\&\?]{11})/,
        /\&v=([^#\&\?]{11})/,
        /embed\/([^#\&\?]{11})/,
        /\/v\/([^#\&\?]{11})/,
        /list=([^#\&\?]+)/,
        /playlist\?list=([^#\&\?]+)/
      ];
      for (i = 0; i < patterns.length; ++i) {
        if (patterns[i].test(videoLink)) {
          if (i === patterns.length - 1) {
            const match = patterns[i].exec(videoLink);
            const playlistParams = new URLSearchParams(match[0]);
            const videoId = playlistParams.get("v");
            return resolve(videoId);
          } else
            return resolve(patterns[i].exec(videoLink)[1]);
        }
      }
    }
    resolve(void 0);
  });
}
var browser;
var page;
async function crawler(verbose, autoSocks5) {
  if (autoSocks5) {
    browser = await puppeteer.launch({
      headless: verbose ? false : true,
      ignoreHTTPSErrors: true,
      args: [
        "--no-zygote",
        "--incognito",
        "--no-sandbox",
        "--lang=en-US",
        "--enable-automation",
        "--disable-dev-shm-usage",
        "--ignore-certificate-errors",
        "--allow-running-insecure-content",
        "--proxy-server=socks5://127.0.0.1:9050"
      ]
    });
  } else {
    browser = await puppeteer.launch({
      headless: verbose ? false : true,
      ignoreHTTPSErrors: true,
      args: [
        "--no-zygote",
        "--incognito",
        "--no-sandbox",
        "--lang=en-US",
        "--enable-automation",
        "--disable-dev-shm-usage",
        "--ignore-certificate-errors",
        "--allow-running-insecure-content"
      ]
    });
  }
  page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
  );
}

// core/web/api/SearchVideos.ts
async function SearchVideos(input) {
  const QuerySchema = z.object({
    query: z.string().min(1).refine(
      async (query2) => {
        const result = await YouTubeID(query2);
        return result === void 0;
      },
      {
        message: "Query must not be a YouTube video/Playlist link"
      }
    ),
    verbose: z.boolean().optional(),
    autoSocks5: z.boolean().optional(),
    screenshot: z.boolean().optional()
  });
  const { query, screenshot, verbose, autoSocks5 } = await QuerySchema.parseAsync(input);
  await crawler(verbose, autoSocks5);
  let url;
  let $;
  let spin = randomUUID();
  let content;
  let metaTube = [];
  let spinnies = new spinClient();
  let videoElements;
  let playlistMeta = [];
  let TubeResp;
  spinnies.add(spin, {
    text: colors28.green("@scrape: ") + "booting chromium..."
  });
  switch (input.type) {
    case "video":
      url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query) + "&sp=EgIQAQ%253D%253D";
      await page.goto(url);
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      spinnies.update(spin, {
        text: colors28.yellow("@scrape: ") + "waiting for hydration..."
      });
      if (screenshot) {
        await page.screenshot({
          path: "TypeVideo.png"
        });
        spinnies.update(spin, {
          text: colors28.yellow("@scrape: ") + "took snapshot..."
        });
      }
      content = await page.content();
      $ = load(content);
      videoElements = $(
        "ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])"
      );
      videoElements.each(async (_, vide) => {
        const videoId = await YouTubeID(
          "https://www.youtube.com" + $(vide).find("a").attr("href")
        );
        const authorContainer = $(vide).find(".ytd-channel-name a");
        const uploadedOnElement = $(vide).find(
          ".inline-metadata-item.style-scope.ytd-video-meta-block"
        );
        metaTube.push({
          title: $(vide).find("#video-title").text().trim() || void 0,
          views: $(vide).find(".inline-metadata-item.style-scope.ytd-video-meta-block").filter((_2, vide2) => $(vide2).text().includes("views")).text().trim().replace(/ views/g, "") || void 0,
          author: authorContainer.text().trim() || void 0,
          videoId,
          uploadOn: uploadedOnElement.length >= 2 ? $(uploadedOnElement[1]).text().trim() : void 0,
          authorUrl: "https://www.youtube.com" + authorContainer.attr("href") || void 0,
          videoLink: "https://www.youtube.com/watch?v=" + videoId,
          thumbnailUrls: [
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/default.jpg`
          ],
          description: $(vide).find(".metadata-snippet-text").text().trim() || void 0
        });
      });
      spinnies.succeed(spin, {
        text: colors28.green("@info: ") + colors28.white("scrapping done for ") + query
      });
      TubeResp = metaTube;
      break;
    case "playlist":
      url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query) + "&sp=EgIQAw%253D%253D";
      await page.goto(url);
      for (let i = 0; i < 80; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      spinnies.update(spin, {
        text: colors28.yellow("@scrape: ") + "waiting for hydration..."
      });
      if (screenshot) {
        await page.screenshot({
          path: "TypePlaylist.png"
        });
        spinnies.update(spin, {
          text: colors28.yellow("@scrape: ") + "took snapshot..."
        });
      }
      content = await page.content();
      $ = load(content);
      const playlistElements = $("ytd-playlist-renderer");
      playlistElements.each((_index, element) => {
        const playlistLink = $(element).find(".style-scope.ytd-playlist-renderer #view-more a").attr("href");
        const vCount = $(element).text().trim();
        playlistMeta.push({
          title: $(element).find(".style-scope.ytd-playlist-renderer #video-title").text().replace(/\s+/g, " ").trim() || void 0,
          author: $(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").text().replace(/\s+/g, " ").trim() || void 0,
          playlistId: playlistLink.split("list=")[1],
          playlistLink: "https://www.youtube.com" + playlistLink,
          authorUrl: $(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").attr("href") ? "https://www.youtube.com" + $(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").attr("href") : void 0,
          videoCount: parseInt(vCount.replace(/ videos\nNOW PLAYING/g, "")) || void 0
        });
      });
      spinnies.succeed(spin, {
        text: colors28.green("@info: ") + colors28.white("scrapping done for ") + query
      });
      TubeResp = playlistMeta;
      break;
    default:
      spinnies.fail(spin, {
        text: colors28.red("@error: ") + colors28.white("wrong filter type provided.")
      });
      TubeResp = void 0;
      break;
  }
  await closers(browser);
  return TubeResp;
}
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));
async function PlaylistInfo(input) {
  let query = "";
  const spinnies = new spinClient();
  const QuerySchema = z.object({
    query: z.string().min(1).refine(
      async (input2) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input2
          ):
            const resultLink = await YouTubeID(input2);
            if (resultLink !== void 0) {
              query = input2;
              return true;
            }
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input2}`
            );
            if (resultId !== void 0) {
              query = `https://www.youtube.com/playlist?list=${input2}`;
              return true;
            }
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    ),
    verbose: z.boolean().optional(),
    autoSocks5: z.boolean().optional(),
    screenshot: z.boolean().optional()
  });
  const { screenshot, verbose, autoSocks5 } = await QuerySchema.parseAsync(
    input
  );
  let metaTube = [];
  const spin = randomUUID();
  await crawler(verbose, autoSocks5);
  spinnies.add(spin, {
    text: colors28.green("@scrape: ") + "booting chromium..."
  });
  await page.goto(query);
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  }
  spinnies.update(spin, {
    text: colors28.yellow("@scrape: ") + "waiting for hydration..."
  });
  if (screenshot) {
    await page.screenshot({
      path: "FilterVideo.png"
    });
    spinnies.update(spin, {
      text: colors28.yellow("@scrape: ") + "took snapshot..."
    });
  }
  const content = await page.content();
  const $ = load(content);
  const playlistTitle = $(
    "yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string"
  ).text().trim();
  const viewsText = $("yt-formatted-string.byline-item").eq(1).text();
  const playlistViews = parseInt(viewsText.replace(/,/g, "").match(/\d+/)[0]);
  let playlistDescription = $("span#plain-snippet-text").text();
  $("ytd-playlist-video-renderer").each(async (_index, element) => {
    const title = $(element).find("h3").text().trim();
    const videoLink = "https://www.youtube.com" + $(element).find("a").attr("href");
    const videoId = await YouTubeID(videoLink);
    const newLink = "https://www.youtube.com/watch?v=" + videoId;
    const author = $(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").text();
    const authorUrl = "https://www.youtube.com" + $(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").attr("href");
    const views = $(element).find(".style-scope.ytd-video-meta-block span:first-child").text();
    const ago = $(element).find(".style-scope.ytd-video-meta-block span:last-child").text();
    const thumbnailUrls = [
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/default.jpg`
    ];
    metaTube.push({
      ago,
      author,
      videoId,
      authorUrl,
      thumbnailUrls,
      videoLink: newLink,
      title: title.trim(),
      views: views.replace(/ views/g, "")
    });
  });
  spinnies.succeed(spin, {
    text: colors28.green("@info: ") + colors28.white("scrapping done for ") + query
  });
  await closers(browser);
  return {
    playlistVideos: metaTube,
    playlistDescription: playlistDescription.trim(),
    playlistVideoCount: metaTube.length,
    playlistViews,
    playlistTitle
  };
}
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));
async function VideoInfo(input) {
  let query = "";
  const spinnies = new spinClient();
  const QuerySchema = z.object({
    query: z.string().min(1).refine(
      async (input2) => {
        query = input2;
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
            input2
          ):
            const resultLink = await YouTubeID(input2);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/watch?v=${input2}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube video Link or ID."
      }
    ),
    verbose: z.boolean().optional(),
    autoSocks5: z.boolean().optional(),
    screenshot: z.boolean().optional()
  });
  const { screenshot, verbose, autoSocks5 } = await QuerySchema.parseAsync(
    input
  );
  const spin = randomUUID();
  await crawler(verbose, autoSocks5);
  spinnies.add(spin, {
    text: colors28.green("@scrape: ") + "booting chromium..."
  });
  await page.goto(query);
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  }
  spinnies.update(spin, {
    text: colors28.yellow("@scrape: ") + "waiting for hydration..."
  });
  if (screenshot) {
    await page.screenshot({ path: "FilterVideo.png" });
    spinnies.update(spin, {
      text: colors28.yellow("@scrape: ") + "took snapshot..."
    });
  }
  const videoId = await YouTubeID(query);
  await page.waitForSelector(
    "yt-formatted-string.style-scope.ytd-watch-metadata",
    { timeout: 1e4 }
  );
  await page.waitForSelector(
    "a.yt-simple-endpoint.style-scope.yt-formatted-string",
    { timeout: 1e4 }
  );
  await page.waitForSelector(
    "yt-formatted-string.style-scope.ytd-watch-info-text",
    { timeout: 1e4 }
  );
  setTimeout(() => {
  }, 1e3);
  const htmlContent = await page.content();
  const $ = load(htmlContent);
  const title = $("yt-formatted-string.style-scope.ytd-watch-metadata").text().trim();
  const author = $("a.yt-simple-endpoint.style-scope.yt-formatted-string").text().trim();
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
    `https://img.youtube.com/vi/${videoId}/default.jpg`
  ];
  const TubeResp = {
    views,
    author,
    videoId,
    uploadOn,
    thumbnailUrls,
    title: title.trim(),
    videoLink: "https://www.youtube.com/watch?v=" + videoId
  };
  spinnies.succeed(spin, {
    text: colors28.green("@info: ") + colors28.white("scrapping done for ") + query
  });
  await closers(browser);
  return TubeResp;
}
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));

// core/web/index.ts
var web = {
  search: {
    SearchVideos,
    PlaylistInfo,
    VideoInfo
  }
};
var web_default = web;
function help() {
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
  return Promise.resolve(
    colors28.bold.white(`
\u2715\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2715
\u2503                                     YOUTUBE DOWNLOADER DLX <( YT-DLX /)>                                   \u2503
\u2503                                            (License: MIT)                                                    \u2503
\u2503                                         [Owner: ShovitDutta]                                                 \u2503
\u2503                                       { Web: rebrand.ly/mixly }                                              \u2503
\u2503                                                                                                              \u2503
\u2503                               Supports both async/await and promise.then()                                   \u2503
\u2503                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     \u2503
\u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503 INSTALLATION  \u2503 \u275D LOCALLY: \u275E                                                                                 \u2503
\u2503               \u2503   bun add yt-dlx                                                                             \u2503
\u2503               \u2503   yarn add yt-dlx                                                                            \u2503
\u2503               \u2503   npm install yt-dlx                                                                         \u2503
\u2503               \u2503   pnpm install yt-dlx                                                                        \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D GLOBALLY: \u275E                                                                                \u2503
\u2503               \u2503   yarn global add yt-dlx                                                   (use cli)         \u2503
\u2503               \u2503   npm install --global yt-dlx                                              (use cli)         \u2503
\u2503               \u2503   pnpm install --global yt-dlx                                             (use cli)         \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503    FILTERS    \u2503 \u275D AUDIO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   bassboost                  echo                                                            \u2503
\u2503               \u2503   flanger                    nightcore                                                       \u2503
\u2503               \u2503   panning                    phaser                                                          \u2503
\u2503               \u2503   reverse                    slow                                                            \u2503
\u2503               \u2503   speed                      subboost                                                        \u2503
\u2503               \u2503   superslow                  superspeed                                                      \u2503
\u2503               \u2503   surround                   vaporwave                                                       \u2503
\u2503               \u2503   vibrato                                                                                    \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   grayscale                                                                                  \u2503
\u2503               \u2503   invert                                                                                     \u2503
\u2503               \u2503   rotate90                                                                                   \u2503
\u2503               \u2503   rotate180                                                                                  \u2503
\u2503               \u2503   rotate270                                                                                  \u2503
\u2503               \u2503   flipHorizontal                                                                             \u2503
\u2503               \u2503   flipVertical                                                                               \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503   CLI USAGE   \u2503 \u275D INFO GRABBERS: \u275E                                                                           \u2503
\u2503               \u2503   yt-dlx version                                                             (alias: v)      \u2503
\u2503               \u2503   yt-dlx help                                                                (alias: h)      \u2503
\u2503               \u2503   yt-dlx extract --query="video/url"                                         (alias: e)      \u2503
\u2503               \u2503   yt-dlx search-yt --query="video/url"                                       (alias: s)      \u2503
\u2503               \u2503   yt-dlx list-formats --query="video/url"                                    (alias: f)      \u2503 
\u2503               \u2503   yt-dlx get-video-data --query="video/url"                                  (alias: gvd)    \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D AUDIO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   yt-dlx audio-lowest --query="video/url"                                    (alias: al)     \u2503
\u2503               \u2503   yt-dlx audio-highest --query="video/url"                                   (alias: ah)     \u2503
\u2503               \u2503   yt-dlx audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)    \u2503
\u2503               \u2503       \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500                         \u2503
\u2503               \u2503   yt-dlx audio-lowest --query="video/url" --filter="valid-filter"            (filter)        \u2503
\u2503               \u2503   yt-dlx audio-highest --query="video/url" --filter="valid-filter"           (filter)        \u2503
\u2503               \u2503   yt-dlx audio-quality-custom --query="video/url" --format="valid-format"    ........        \u2503
\u2503               \u2503                                                   --filter="valid-filter"    (filter)        \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   yt-dlx video-lowest --query="video/url"                                    (alias: vl)     \u2503
\u2503               \u2503   yt-dlx video-highest --query="video/url"                                   (alias: vh)     \u2503
\u2503               \u2503   yt-dlx video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)    \u2503
\u2503               \u2503       \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500                         \u2503
\u2503               \u2503   yt-dlx video-lowest --query="video/url" --filter="valid-filter"            (filter)        \u2503
\u2503               \u2503   yt-dlx video-highest --query="video/url" --filter="valid-filter"           (filter)        \u2503
\u2503               \u2503   yt-dlx video-quality-custom --query="video/url" --format="valid-format"    ........        \u2503
\u2503               \u2503                                                   --filter="valid-filter"    (filter)        \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D AUDIO + VIDEO MIX: \u275E                                                                       \u2503
\u2503               \u2503   yt-dlx audio-video-lowest --query="video/url"                              (alias: avl)    \u2503
\u2503               \u2503   yt-dlx audio-video-highest --query="video/url"                             (alias: avh)    \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503   IMPORTING   \u2503   import ytdlx from "yt-dlx";                                            TypeScript (ts)     \u2503
\u2503               \u2503   import ytdlx from "yt-dlx";                                            ECMAScript (esm)    \u2503
\u2503               \u2503   const ytdlx = require("yt-dlx");                                       CommonJS   (cjs)    \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503 INFO GRABBERS \u2503   ytdlx.info.help();                                                                         \u2503
\u2503               \u2503   ytdlx.info.search({ query: "" });                                                          \u2503
\u2503               \u2503   ytdlx.info.extract({ query: "" });                                                         \u2503
\u2503               \u2503   ytdlx.info.list_formats({ query: "" });                                                    \u2503
\u2503               \u2503   ytdlx.info.get_video_data({ query: "" });                                                  \u2503
\u2503               \u2503   ytdlx.extract_playlist_videos({ playlistUrls: ["", "", "", ""] });                         \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503  DOWNLOADERS  \u2503 \u275D AUDIO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   ytdlx.audio.download.lowest({ query: "", filter: "" });                                    \u2503
\u2503               \u2503   ytdlx.audio.download.highest({ query: "", filter: "" });                                   \u2503
\u2503               \u2503   ytdlx.audio.download.custom({ query: "", format: "", filter: "" });                        \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   ytdlx.video.download.lowest({ query: "", filter: "" });                                    \u2503
\u2503               \u2503   ytdlx.video.download.highest({ query: "", filter: "" });                                   \u2503
\u2503               \u2503   ytdlx.video.download.custom({ query: "", filter: "" });                                    \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D AUDIO + VIDEO MIX: \u275E                                                                       \u2503
\u2503               \u2503   ytdlx.audio_video.download.lowest({ query: "" });                                          \u2503
\u2503               \u2503   ytdlx.audio_video.download.highest({ query: "" });                                         \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503  MEDIA PIPE   \u2503 \u275D AUDIO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   ytdlx.audio.pipe.lowest({ query: "", filter: "" });                                        \u2503
\u2503               \u2503   ytdlx.audio.pipe.highest({ query: "", filter: "" });                                       \u2503
\u2503               \u2503   ytdlx.audio.pipe.custom({ query: "", format: "", filter: "" });                            \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                              \u2503
\u2503               \u2503   ytdlx.video.pipe.lowest({ query: "", filter: "" });                                        \u2503
\u2503               \u2503   ytdlx.video.pipe.highest({ query: "", filter: "" });                                       \u2503
\u2503               \u2503   ytdlx.video.pipe.custom({ query: "", filter: "" });                                        \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503                                                                                              \u2503
\u2503               \u2503 \u275D AUDIO + VIDEO MIX: \u275E                                                                       \u2503
\u2503               \u2503   ytdlx.audio_video.pipe.lowest({ query: "" });                                              \u2503
\u2503               \u2503   ytdlx.audio_video.pipe.highest({ query: "" });                                             \u2503
\u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503                                     YOUTUBE DOWNLOADER DLX <( YT-DLX /)>                                   \u2503
\u2503                                            (License: MIT)                                                    \u2503
\u2503                                         [Owner: ShovitDutta]                                                 \u2503
\u2503                                       { Web: rebrand.ly/mixly }                                              \u2503
\u2503                                                                                                              \u2503
\u2503                               Supports both async/await and promise.then()                                   \u2503
\u2503                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     \u2503
\u2715\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2715`)
  );
}
async function checkSudo() {
  return new Promise((resolve) => {
    const check = spawn("sudo", ["-n", "true"]);
    check.on("close", (code) => {
      resolve(code === 0);
    });
  });
}
async function niptor(args) {
  const sudoAvailable = await checkSudo();
  const command = sudoAvailable ? ["sudo", ...args] : args;
  const prox = spawn("sh", ["-c", command.join(" ")]);
  const [stdoutData, stderrData] = await Promise.all([
    new Promise((resolve, reject2) => {
      const stdoutData2 = [];
      prox.stdout.on("data", (data) => stdoutData2.push(data));
      prox.on("close", (code) => {
        if (code === 0)
          resolve(Buffer.concat(stdoutData2).toString());
        else
          reject2(new Error("Try running npx yt-dlx install:socks5"));
      });
    }),
    new Promise((resolve, reject2) => {
      const stderrData2 = [];
      prox.stderr.on("data", (data) => stderrData2.push(data));
      prox.on("close", (code) => {
        if (code === 0)
          resolve(Buffer.concat(stderrData2).toString());
        else
          reject2(new Error("Try running npx yt-dlx install:socks5"));
      });
    })
  ]);
  return { stdout: stdoutData, stderr: stderrData };
}
function sizeFormat(filesize) {
  if (isNaN(filesize) || filesize < 0)
    return filesize;
  const bytesPerMegabyte = 1024 * 1024;
  const bytesPerGigabyte = bytesPerMegabyte * 1024;
  const bytesPerTerabyte = bytesPerGigabyte * 1024;
  if (filesize < bytesPerMegabyte)
    return filesize + " B";
  else if (filesize < bytesPerGigabyte) {
    return (filesize / bytesPerMegabyte).toFixed(2) + " MB";
  } else if (filesize < bytesPerTerabyte) {
    return (filesize / bytesPerGigabyte).toFixed(2) + " GB";
  } else
    return (filesize / bytesPerTerabyte).toFixed(2) + " TB";
}
async function Engine({
  query,
  ipAddress,
  autoSocks5
}) {
  let pushTube = [];
  let proLoc = "";
  let maxTries2 = 6;
  let currentDir2 = __dirname;
  while (maxTries2 > 0) {
    const enginePath = path22.join(currentDir2, "util", "engine");
    if (fs2.existsSync(enginePath)) {
      proLoc = enginePath;
      break;
    } else {
      currentDir2 = path22.join(currentDir2, "..");
      maxTries2--;
    }
  }
  if (proLoc !== "") {
    if (autoSocks5)
      proLoc += " --proxy socks5://127.0.0.1:9050";
    proLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
    proLoc += ` --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'`;
    proLoc += ` --dump-single-json '${query}'`;
  } else {
    throw new Error(
      "Could not find dependencies. Try running npx yt-dlx install:deps"
    );
  }
  const result = await promisify(exec)(proLoc);
  const metaTube = await JSON.parse(result.stdout.toString());
  await metaTube.formats.forEach((io) => {
    const rmval = /* @__PURE__ */ new Set(["storyboard", "Default"]);
    if (rmval.has(io.format_note) && io.filesize === void 0)
      return;
    const reTube = {
      Audio: {
        bitrate: io.abr,
        codec: io.acodec,
        samplerate: io.asr,
        extension: io.audio_ext,
        channels: io.audio_channels
      },
      Video: {
        bitrate: io.vbr,
        width: io.width,
        codec: io.vcodec,
        height: io.height,
        extension: io.video_ext,
        resolution: io.resolution,
        aspectratio: io.aspect_ratio
      },
      AVDownload: {
        mediaurl: io.url,
        formatid: io.format_id,
        formatnote: io.format_note,
        originalformat: io.format.replace(/[-\s]+/g, "_").replace(/_/g, "_")
      },
      AVInfo: {
        totalbitrate: io.tbr,
        framespersecond: io.fps,
        qriginalextension: io.ext,
        filesizebytes: io.filesize,
        dynamicrange: io.dynamic_range,
        extensionconatainer: io.container,
        filesizeformatted: sizeFormat(io.filesize)
      }
    };
    pushTube.push({
      Tube: "metaTube",
      reTube: {
        id: metaTube.id,
        title: metaTube.title,
        channel: metaTube.channel,
        uploader: metaTube.uploader,
        duration: metaTube.duration,
        thumbnail: metaTube.thumbnail,
        age_limit: metaTube.age_limit,
        channel_id: metaTube.channel_id,
        categories: metaTube.categories,
        display_id: metaTube.display_id,
        description: metaTube.description,
        channel_url: metaTube.channel_url,
        webpage_url: metaTube.webpage_url,
        live_status: metaTube.live_status,
        upload_date: metaTube.upload_date,
        uploader_id: metaTube.uploader_id,
        original_url: metaTube.original_url,
        uploader_url: metaTube.uploader_url,
        duration_string: metaTube.duration_string
      }
    });
    if (reTube.AVDownload.formatnote) {
      switch (true) {
        case ((reTube.AVDownload.formatnote.includes("ultralow") || reTube.AVDownload.formatnote.includes("medium") || reTube.AVDownload.formatnote.includes("high") || reTube.AVDownload.formatnote.includes("low")) && reTube.Video.resolution && reTube.Video.resolution.includes("audio")):
          pushTube.push({ Tube: "AudioStore", reTube });
          break;
        case reTube.AVDownload.formatnote.includes("HDR"):
          pushTube.push({ Tube: "HDRVideoStore", reTube });
          break;
        default:
          pushTube.push({ Tube: "VideoStore", reTube });
          break;
      }
    }
  });
  return {
    AudioStore: pushTube.filter((item) => item.Tube === "AudioStore").map((item) => item.reTube) || void 0,
    VideoStore: pushTube.filter((item) => item.Tube === "VideoStore").map((item) => item.reTube) || void 0,
    HDRVideoStore: pushTube.filter((item) => item.Tube === "HDRVideoStore").map((item) => item.reTube) || void 0,
    metaTube: pushTube.filter((item) => item.Tube === "metaTube").map((item) => item.reTube)[0] || void 0,
    ipAddress
  };
}

// package.json
var version = "5.13.0";

// core/base/Agent.ts
async function Agent({
  query,
  verbose,
  autoSocks5
}) {
  console.log(
    colors28.green("@info:"),
    "using",
    colors28.green("yt-dlx"),
    "version",
    colors28.green(version)
  );
  let nipTor;
  let ipAddress = void 0;
  nipTor = await niptor(["curl https://checkip.amazonaws.com --insecure"]);
  console.log(
    colors28.green("@info:"),
    "system",
    colors28.green("ipAddress"),
    nipTor.stdout.trim()
  );
  ipAddress = nipTor.stdout.trim();
  if (autoSocks5) {
    nipTor = await niptor([
      "systemctl restart tor && sleep 2 && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure"
    ]);
    if (nipTor.stdout.trim().length > 0) {
      console.log(
        colors28.green("@info:"),
        "autoSocks5",
        colors28.green("ipAddress"),
        nipTor.stdout.trim()
      );
      ipAddress = nipTor.stdout.trim();
    } else
      throw new Error("Unable to connect to Tor.");
  }
  let respEngine = void 0;
  let videoId = await YouTubeID(query);
  let TubeBody;
  if (!videoId) {
    TubeBody = await web_default.search.SearchVideos({
      type: "video",
      autoSocks5,
      verbose,
      query
    });
    if (!TubeBody[0]) {
      throw new Error("Unable to get response from YouTube.");
    } else {
      console.log(
        colors28.green("@info:"),
        `preparing payload for`,
        colors28.green(TubeBody[0].title)
      );
      respEngine = await Engine({
        query: TubeBody[0].videoLink,
        autoSocks5,
        ipAddress
      });
      return respEngine;
    }
  } else {
    TubeBody = await web_default.search.VideoInfo({
      autoSocks5,
      verbose,
      query
    });
    if (!TubeBody) {
      throw new Error("Unable to get response from YouTube.");
    } else {
      console.log(
        colors28.green("@info:"),
        `preparing payload for`,
        colors28.green(TubeBody.title)
      );
      respEngine = await Engine({
        query: TubeBody.videoLink,
        autoSocks5,
        ipAddress
      });
      return respEngine;
    }
  }
}

// core/pipes/command/extract.ts
async function extract({
  query,
  verbose
}) {
  const metaBody = await Agent({ query, verbose });
  if (!metaBody) {
    return {
      message: "Unable to get response from YouTube...",
      status: 500
    };
  }
  const uploadDate = new Date(
    metaBody.metaTube.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
  );
  const currentDate = /* @__PURE__ */ new Date();
  const daysAgo = Math.floor(
    (currentDate.getTime() - uploadDate.getTime()) / (1e3 * 60 * 60 * 24)
  );
  const prettyDate = uploadDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const uploadAgoObject = calculateUploadAgo(daysAgo);
  const videoTimeInSeconds = metaBody.metaTube.duration;
  const videoDuration = calculateVideoDuration(videoTimeInSeconds);
  const viewCountFormatted = formatCount(metaBody.metaTube.view_count);
  const likeCountFormatted = formatCount(metaBody.metaTube.like_count);
  function calculateUploadAgo(days) {
    const years = Math.floor(days / 365);
    const months = Math.floor(days % 365 / 30);
    const remainingDays = days % 30;
    const formattedString = `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${remainingDays} days`;
    return { years, months, days: remainingDays, formatted: formattedString };
  }
  function calculateVideoDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const remainingSeconds = seconds % 60;
    const formattedString = `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${remainingSeconds} seconds`;
    return {
      hours,
      minutes,
      seconds: remainingSeconds,
      formatted: formattedString
    };
  }
  function formatCount(count) {
    const abbreviations = ["K", "M", "B", "T"];
    for (let i = abbreviations.length - 1; i >= 0; i--) {
      const size = Math.pow(10, (i + 1) * 3);
      if (size <= count) {
        const formattedCount = Math.round(count / size * 10) / 10;
        return `${formattedCount}${abbreviations[i]}`;
      }
    }
    return `${count}`;
  }
  const payload = {
    audio_data: metaBody.AudioStore,
    video_data: metaBody.VideoStore,
    hdrvideo_data: metaBody.HDRVideoStore,
    meta_data: {
      id: metaBody.metaTube.id,
      original_url: metaBody.metaTube.original_url,
      webpage_url: metaBody.metaTube.webpage_url,
      title: metaBody.metaTube.title,
      view_count: metaBody.metaTube.view_count,
      like_count: metaBody.metaTube.like_count,
      view_count_formatted: viewCountFormatted,
      like_count_formatted: likeCountFormatted,
      uploader: metaBody.metaTube.uploader,
      uploader_id: metaBody.metaTube.uploader_id,
      uploader_url: metaBody.metaTube.uploader_url,
      thumbnail: metaBody.metaTube.thumbnail,
      categories: metaBody.metaTube.categories,
      time: videoTimeInSeconds,
      duration: videoDuration,
      age_limit: metaBody.metaTube.age_limit,
      live_status: metaBody.metaTube.live_status,
      description: metaBody.metaTube.description,
      full_description: metaBody.metaTube.description,
      upload_date: prettyDate,
      upload_ago: daysAgo,
      upload_ago_formatted: uploadAgoObject,
      comment_count: metaBody.metaTube.comment_count,
      comment_count_formatted: formatCount(metaBody.metaTube.comment_count),
      channel_id: metaBody.metaTube.channel_id,
      channel_name: metaBody.metaTube.channel,
      channel_url: metaBody.metaTube.channel_url,
      channel_follower_count: metaBody.metaTube.channel_follower_count,
      channel_follower_count_formatted: formatCount(
        metaBody.metaTube.channel_follower_count
      )
    }
  };
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
  return payload;
}
function list_formats({
  query,
  verbose
}) {
  return new Promise(async (resolve, reject2) => {
    const zval = z4.object({
      query: z4.string().min(1)
    }).parse({ query, verbose });
    const EnResp = await Agent(zval);
    if (!EnResp)
      return reject2("Unable to get response from YouTube...");
    const metaTube = (data) => data.filter((out) => !out.AVDownload.originalformat.includes("Premium"));
    const EnBody = {
      AudioFormatsData: metaTube(EnResp.AudioStore).map((out) => [
        out.AVDownload.originalformat,
        out.AVInfo.filesizebytes,
        out.AVInfo.filesizeformatted
      ]),
      VideoFormatsData: metaTube(EnResp.VideoStore).map((out) => [
        out.AVDownload.originalformat,
        out.AVInfo.filesizebytes,
        out.AVInfo.filesizeformatted
      ]),
      HdrVideoFormatsData: metaTube(EnResp.HDRVideoStore).map((out) => [
        out.AVDownload.originalformat,
        out.AVInfo.filesizebytes,
        out.AVInfo.filesizeformatted
      ])
    };
    resolve(EnBody);
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  });
}

// node_modules/async/dist/async.mjs
function initialParams(fn) {
  return function(...args) {
    var callback = args.pop();
    return fn.call(this, args, callback);
  };
}
var hasQueueMicrotask = typeof queueMicrotask === "function" && queueMicrotask;
var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
function fallback(fn) {
  setTimeout(fn, 0);
}
function wrap(defer) {
  return (fn, ...args) => defer(() => fn(...args));
}
var _defer$1;
if (hasQueueMicrotask) {
  _defer$1 = queueMicrotask;
} else if (hasSetImmediate) {
  _defer$1 = setImmediate;
} else if (hasNextTick) {
  _defer$1 = process.nextTick;
} else {
  _defer$1 = fallback;
}
var setImmediate$1 = wrap(_defer$1);
function asyncify(func) {
  if (isAsync(func)) {
    return function(...args) {
      const callback = args.pop();
      const promise = func.apply(this, args);
      return handlePromise(promise, callback);
    };
  }
  return initialParams(function(args, callback) {
    var result;
    try {
      result = func.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    if (result && typeof result.then === "function") {
      return handlePromise(result, callback);
    } else {
      callback(null, result);
    }
  });
}
function handlePromise(promise, callback) {
  return promise.then((value) => {
    invokeCallback(callback, null, value);
  }, (err) => {
    invokeCallback(callback, err && (err instanceof Error || err.message) ? err : new Error(err));
  });
}
function invokeCallback(callback, error, value) {
  try {
    callback(error, value);
  } catch (err) {
    setImmediate$1((e) => {
      throw e;
    }, err);
  }
}
function isAsync(fn) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
}
function isAsyncGenerator(fn) {
  return fn[Symbol.toStringTag] === "AsyncGenerator";
}
function isAsyncIterable(obj) {
  return typeof obj[Symbol.asyncIterator] === "function";
}
function wrapAsync(asyncFn) {
  if (typeof asyncFn !== "function")
    throw new Error("expected a function");
  return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}
function awaitify(asyncFn, arity) {
  if (!arity)
    arity = asyncFn.length;
  if (!arity)
    throw new Error("arity is undefined");
  function awaitable(...args) {
    if (typeof args[arity - 1] === "function") {
      return asyncFn.apply(this, args);
    }
    return new Promise((resolve, reject2) => {
      args[arity - 1] = (err, ...cbArgs) => {
        if (err)
          return reject2(err);
        resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
      };
      asyncFn.apply(this, args);
    });
  }
  return awaitable;
}
function _asyncMap(eachfn, arr, iteratee, callback) {
  arr = arr || [];
  var results = [];
  var counter = 0;
  var _iteratee = wrapAsync(iteratee);
  return eachfn(arr, (value, _, iterCb) => {
    var index = counter++;
    _iteratee(value, (err, v) => {
      results[index] = v;
      iterCb(err);
    });
  }, (err) => {
    callback(err, results);
  });
}
function isArrayLike(value) {
  return value && typeof value.length === "number" && value.length >= 0 && value.length % 1 === 0;
}
var breakLoop = {};
var breakLoop$1 = breakLoop;
function once(fn) {
  function wrapper(...args) {
    if (fn === null)
      return;
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  }
  Object.assign(wrapper, fn);
  return wrapper;
}
function getIterator(coll) {
  return coll[Symbol.iterator] && coll[Symbol.iterator]();
}
function createArrayIterator(coll) {
  var i = -1;
  var len = coll.length;
  return function next() {
    return ++i < len ? { value: coll[i], key: i } : null;
  };
}
function createES2015Iterator(iterator) {
  var i = -1;
  return function next() {
    var item = iterator.next();
    if (item.done)
      return null;
    i++;
    return { value: item.value, key: i };
  };
}
function createObjectIterator(obj) {
  var okeys = obj ? Object.keys(obj) : [];
  var i = -1;
  var len = okeys.length;
  return function next() {
    var key = okeys[++i];
    if (key === "__proto__") {
      return next();
    }
    return i < len ? { value: obj[key], key } : null;
  };
}
function createIterator(coll) {
  if (isArrayLike(coll)) {
    return createArrayIterator(coll);
  }
  var iterator = getIterator(coll);
  return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
function onlyOnce(fn) {
  return function(...args) {
    if (fn === null)
      throw new Error("Callback was already called.");
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  };
}
function asyncEachOfLimit(generator, limit, iteratee, callback) {
  let done = false;
  let canceled = false;
  let awaiting = false;
  let running = 0;
  let idx = 0;
  function replenish() {
    if (running >= limit || awaiting || done)
      return;
    awaiting = true;
    generator.next().then(({ value, done: iterDone }) => {
      if (canceled || done)
        return;
      awaiting = false;
      if (iterDone) {
        done = true;
        if (running <= 0) {
          callback(null);
        }
        return;
      }
      running++;
      iteratee(value, idx, iterateeCallback);
      idx++;
      replenish();
    }).catch(handleError);
  }
  function iterateeCallback(err, result) {
    running -= 1;
    if (canceled)
      return;
    if (err)
      return handleError(err);
    if (err === false) {
      done = true;
      canceled = true;
      return;
    }
    if (result === breakLoop$1 || done && running <= 0) {
      done = true;
      return callback(null);
    }
    replenish();
  }
  function handleError(err) {
    if (canceled)
      return;
    awaiting = false;
    done = true;
    callback(err);
  }
  replenish();
}
var eachOfLimit$2 = (limit) => {
  return (obj, iteratee, callback) => {
    callback = once(callback);
    if (limit <= 0) {
      throw new RangeError("concurrency limit cannot be less than 1");
    }
    if (!obj) {
      return callback(null);
    }
    if (isAsyncGenerator(obj)) {
      return asyncEachOfLimit(obj, limit, iteratee, callback);
    }
    if (isAsyncIterable(obj)) {
      return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback);
    }
    var nextElem = createIterator(obj);
    var done = false;
    var canceled = false;
    var running = 0;
    var looping = false;
    function iterateeCallback(err, value) {
      if (canceled)
        return;
      running -= 1;
      if (err) {
        done = true;
        callback(err);
      } else if (err === false) {
        done = true;
        canceled = true;
      } else if (value === breakLoop$1 || done && running <= 0) {
        done = true;
        return callback(null);
      } else if (!looping) {
        replenish();
      }
    }
    function replenish() {
      looping = true;
      while (running < limit && !done) {
        var elem = nextElem();
        if (elem === null) {
          done = true;
          if (running <= 0) {
            callback(null);
          }
          return;
        }
        running += 1;
        iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
      }
      looping = false;
    }
    replenish();
  };
};
function eachOfLimit(coll, limit, iteratee, callback) {
  return eachOfLimit$2(limit)(coll, wrapAsync(iteratee), callback);
}
var eachOfLimit$1 = awaitify(eachOfLimit, 4);
function eachOfArrayLike(coll, iteratee, callback) {
  callback = once(callback);
  var index = 0, completed = 0, { length } = coll, canceled = false;
  if (length === 0) {
    callback(null);
  }
  function iteratorCallback(err, value) {
    if (err === false) {
      canceled = true;
    }
    if (canceled === true)
      return;
    if (err) {
      callback(err);
    } else if (++completed === length || value === breakLoop$1) {
      callback(null);
    }
  }
  for (; index < length; index++) {
    iteratee(coll[index], index, onlyOnce(iteratorCallback));
  }
}
function eachOfGeneric(coll, iteratee, callback) {
  return eachOfLimit$1(coll, Infinity, iteratee, callback);
}
function eachOf(coll, iteratee, callback) {
  var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
  return eachOfImplementation(coll, wrapAsync(iteratee), callback);
}
var eachOf$1 = awaitify(eachOf, 3);
function map(coll, iteratee, callback) {
  return _asyncMap(eachOf$1, coll, iteratee, callback);
}
var map$1 = awaitify(map, 3);
function eachOfSeries(coll, iteratee, callback) {
  return eachOfLimit$1(coll, 1, iteratee, callback);
}
var eachOfSeries$1 = awaitify(eachOfSeries, 3);
function mapSeries(coll, iteratee, callback) {
  return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(mapSeries, 3);
function reduce(coll, memo, iteratee, callback) {
  callback = once(callback);
  var _iteratee = wrapAsync(iteratee);
  return eachOfSeries$1(coll, (x, i, iterCb) => {
    _iteratee(memo, x, (err, v) => {
      memo = v;
      iterCb(err);
    });
  }, (err) => callback(err, memo));
}
awaitify(reduce, 4);
function mapLimit(coll, limit, iteratee, callback) {
  return _asyncMap(eachOfLimit$2(limit), coll, iteratee, callback);
}
var mapLimit$1 = awaitify(mapLimit, 4);
function concatLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, ...args) => {
      if (err)
        return iterCb(err);
      return iterCb(err, args);
    });
  }, (err, mapResults) => {
    var result = [];
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        result = result.concat(...mapResults[i]);
      }
    }
    return callback(err, result);
  });
}
var concatLimit$1 = awaitify(concatLimit, 4);
function concat(coll, iteratee, callback) {
  return concatLimit$1(coll, Infinity, iteratee, callback);
}
awaitify(concat, 3);
function concatSeries(coll, iteratee, callback) {
  return concatLimit$1(coll, 1, iteratee, callback);
}
awaitify(concatSeries, 3);
function _createTester(check, getResult) {
  return (eachfn, arr, _iteratee, cb) => {
    var testPassed = false;
    var testResult;
    const iteratee = wrapAsync(_iteratee);
    eachfn(arr, (value, _, callback) => {
      iteratee(value, (err, result) => {
        if (err || err === false)
          return callback(err);
        if (check(result) && !testResult) {
          testPassed = true;
          testResult = getResult(true, value);
          return callback(null, breakLoop$1);
        }
        callback();
      });
    }, (err) => {
      if (err)
        return cb(err);
      cb(null, testPassed ? testResult : getResult(false));
    });
  };
}
function detect(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback);
}
awaitify(detect, 3);
function detectLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(detectLimit, 4);
function detectSeries(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(1), coll, iteratee, callback);
}
awaitify(detectSeries, 3);
function doWhilst(iteratee, test, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results;
  function next(err, ...args) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    results = args;
    _test(...args, check);
  }
  function check(err, truth) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    if (!truth)
      return callback(null, ...results);
    _fn(next);
  }
  return check(null, true);
}
awaitify(doWhilst, 3);
function _withoutIndex(iteratee) {
  return (value, index, callback) => iteratee(value, callback);
}
function eachLimit$2(coll, iteratee, callback) {
  return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
awaitify(eachLimit$2, 3);
function eachLimit(coll, limit, iteratee, callback) {
  return eachOfLimit$2(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
var eachLimit$1 = awaitify(eachLimit, 4);
function eachSeries(coll, iteratee, callback) {
  return eachLimit$1(coll, 1, iteratee, callback);
}
var eachSeries$1 = awaitify(eachSeries, 3);
function ensureAsync(fn) {
  if (isAsync(fn))
    return fn;
  return function(...args) {
    var callback = args.pop();
    var sync = true;
    args.push((...innerArgs) => {
      if (sync) {
        setImmediate$1(() => callback(...innerArgs));
      } else {
        callback(...innerArgs);
      }
    });
    fn.apply(this, args);
    sync = false;
  };
}
function every(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOf$1, coll, iteratee, callback);
}
awaitify(every, 3);
function everyLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(everyLimit, 4);
function everySeries(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(everySeries, 3);
function filterArray(eachfn, arr, iteratee, callback) {
  var truthValues = new Array(arr.length);
  eachfn(arr, (x, index, iterCb) => {
    iteratee(x, (err, v) => {
      truthValues[index] = !!v;
      iterCb(err);
    });
  }, (err) => {
    if (err)
      return callback(err);
    var results = [];
    for (var i = 0; i < arr.length; i++) {
      if (truthValues[i])
        results.push(arr[i]);
    }
    callback(null, results);
  });
}
function filterGeneric(eachfn, coll, iteratee, callback) {
  var results = [];
  eachfn(coll, (x, index, iterCb) => {
    iteratee(x, (err, v) => {
      if (err)
        return iterCb(err);
      if (v) {
        results.push({ index, value: x });
      }
      iterCb(err);
    });
  }, (err) => {
    if (err)
      return callback(err);
    callback(null, results.sort((a, b) => a.index - b.index).map((v) => v.value));
  });
}
function _filter(eachfn, coll, iteratee, callback) {
  var filter2 = isArrayLike(coll) ? filterArray : filterGeneric;
  return filter2(eachfn, coll, wrapAsync(iteratee), callback);
}
function filter(coll, iteratee, callback) {
  return _filter(eachOf$1, coll, iteratee, callback);
}
awaitify(filter, 3);
function filterLimit(coll, limit, iteratee, callback) {
  return _filter(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(filterLimit, 4);
function filterSeries(coll, iteratee, callback) {
  return _filter(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(filterSeries, 3);
function forever(fn, errback) {
  var done = onlyOnce(errback);
  var task = wrapAsync(ensureAsync(fn));
  function next(err) {
    if (err)
      return done(err);
    if (err === false)
      return;
    task(next);
  }
  return next();
}
awaitify(forever, 2);
function groupByLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, key) => {
      if (err)
        return iterCb(err);
      return iterCb(err, { key, val });
    });
  }, (err, mapResults) => {
    var result = {};
    var { hasOwnProperty } = Object.prototype;
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        var { key } = mapResults[i];
        var { val } = mapResults[i];
        if (hasOwnProperty.call(result, key)) {
          result[key].push(val);
        } else {
          result[key] = [val];
        }
      }
    }
    return callback(err, result);
  });
}
awaitify(groupByLimit, 4);
function mapValuesLimit(obj, limit, iteratee, callback) {
  callback = once(callback);
  var newObj = {};
  var _iteratee = wrapAsync(iteratee);
  return eachOfLimit$2(limit)(obj, (val, key, next) => {
    _iteratee(val, key, (err, result) => {
      if (err)
        return next(err);
      newObj[key] = result;
      next(err);
    });
  }, (err) => callback(err, newObj));
}
awaitify(mapValuesLimit, 4);
if (hasNextTick) {
  process.nextTick;
} else if (hasSetImmediate) {
  setImmediate;
} else ;
awaitify((eachfn, tasks, callback) => {
  var results = isArrayLike(tasks) ? [] : {};
  eachfn(tasks, (task, key, taskCb) => {
    wrapAsync(task)((err, ...result) => {
      if (result.length < 2) {
        [result] = result;
      }
      results[key] = result;
      taskCb(err);
    });
  }, (err) => callback(err, results));
}, 3);
function race(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks))
    return callback(new TypeError("First argument to race must be an array of functions"));
  if (!tasks.length)
    return callback();
  for (var i = 0, l = tasks.length; i < l; i++) {
    wrapAsync(tasks[i])(callback);
  }
}
awaitify(race, 2);
function reject$2(eachfn, arr, _iteratee, callback) {
  const iteratee = wrapAsync(_iteratee);
  return _filter(eachfn, arr, (value, cb) => {
    iteratee(value, (err, v) => {
      cb(err, !v);
    });
  }, callback);
}
function reject(coll, iteratee, callback) {
  return reject$2(eachOf$1, coll, iteratee, callback);
}
awaitify(reject, 3);
function rejectLimit(coll, limit, iteratee, callback) {
  return reject$2(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(rejectLimit, 4);
function rejectSeries(coll, iteratee, callback) {
  return reject$2(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(rejectSeries, 3);
function some(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOf$1, coll, iteratee, callback);
}
awaitify(some, 3);
function someLimit(coll, limit, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfLimit$2(limit), coll, iteratee, callback);
}
awaitify(someLimit, 4);
function someSeries(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfSeries$1, coll, iteratee, callback);
}
awaitify(someSeries, 3);
function sortBy(coll, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return map$1(coll, (x, iterCb) => {
    _iteratee(x, (err, criteria) => {
      if (err)
        return iterCb(err);
      iterCb(err, { value: x, criteria });
    });
  }, (err, results) => {
    if (err)
      return callback(err);
    callback(null, results.sort(comparator).map((v) => v.value));
  });
  function comparator(left, right) {
    var a = left.criteria, b = right.criteria;
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
awaitify(sortBy, 3);
function tryEach(tasks, callback) {
  var error = null;
  var result;
  return eachSeries$1(tasks, (task, taskCb) => {
    wrapAsync(task)((err, ...args) => {
      if (err === false)
        return taskCb(err);
      if (args.length < 2) {
        [result] = args;
      } else {
        result = args;
      }
      error = err;
      taskCb(err ? null : {});
    });
  }, () => callback(error, result));
}
awaitify(tryEach);
function whilst(test, iteratee, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results = [];
  function next(err, ...rest) {
    if (err)
      return callback(err);
    results = rest;
    if (err === false)
      return;
    _test(check);
  }
  function check(err, truth) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    if (!truth)
      return callback(null, ...results);
    _fn(next);
  }
  return _test(check);
}
awaitify(whilst, 3);
function waterfall(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks))
    return callback(new Error("First argument to waterfall must be an array of functions"));
  if (!tasks.length)
    return callback();
  var taskIndex = 0;
  function nextTask(args) {
    var task = wrapAsync(tasks[taskIndex++]);
    task(...args, onlyOnce(next));
  }
  function next(err, ...args) {
    if (err === false)
      return;
    if (err || taskIndex === tasks.length) {
      return callback(err, ...args);
    }
    nextTask(args);
  }
  nextTask([]);
}
awaitify(waterfall);

// core/pipes/command/extract_playlist_videos.ts
async function extract_playlist_videos({
  autoSocks5,
  playlistUrls
}) {
  let counter = 0;
  const metaTubeArr = [];
  await eachSeries$1(playlistUrls, async (listLink) => {
    const query = await YouTubeID(listLink);
    if (query === void 0) {
      console.error(
        colors28.bold.red("@error: "),
        "invalid youtube playlist url:",
        listLink
      );
      return;
    } else {
      const resp = await web_default.search.PlaylistInfo({
        query,
        autoSocks5
      });
      if (resp === void 0) {
        console.error(
          colors28.bold.red("@error: "),
          "unable to get response from youtube for",
          query
        );
        return;
      } else {
        console.log(
          colors28.green("@info:"),
          "total videos in playlist",
          colors28.green(resp.playlistTitle),
          resp.playlistVideoCount
        );
        await eachSeries$1(resp.playlistVideos, async (vid) => {
          const metaTube = await Agent({
            query: vid.videoLink
          });
          counter++;
          console.log(
            colors28.green("@info:"),
            "added",
            counter + "/" + resp.playlistVideoCount
          );
          metaTubeArr.push(metaTube);
        });
      }
    }
  });
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
  return metaTubeArr;
}
function progressBar(prog) {
  if (prog.timemark === void 0 || prog.percent === void 0)
    return;
  if (prog.percent < 1 && prog.timemark.includes("-"))
    return;
  readline.cursorTo(process.stdout, 0);
  let color = colors28.green;
  if (prog.percent > 98)
    prog.percent = 100;
  if (prog.percent < 25)
    color = colors28.red;
  else if (prog.percent < 50)
    color = colors28.yellow;
  const width = Math.floor(process.stdout.columns / 4);
  const scomp = Math.round(width * prog.percent / 100);
  const sprog = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
  let output = color("@prog: ") + sprog + " " + prog.percent.toFixed(2) + "% | " + color("@timemark: ") + prog.timemark;
  if (prog.frames !== 0 && !isNaN(prog.frames)) {
    output += " | " + color("@frames: ") + prog.frames;
  }
  if (prog.currentFps !== 0 && !isNaN(prog.currentFps)) {
    output += " | " + color("@fps: ") + prog.currentFps;
  }
  process.stdout.write(output);
  if (prog.timemark.includes("-"))
    process.stdout.write("\n\n");
}
async function proTube({
  adata,
  vdata,
  ipAddress
}) {
  let max = 6;
  let dirC = __dirname;
  const ff = ffmpeg();
  let ffprobepath, ffmpegpath;
  while (max > 0) {
    ffprobepath = path22.join(dirC, "util", "ffmpeg", "bin", "ffprobe");
    ffmpegpath = path22.join(dirC, "util", "ffmpeg", "bin", "ffmpeg");
    switch (true) {
      case (fs2.existsSync(ffprobepath) && fs2.existsSync(ffmpegpath)):
        ff.setFfprobePath(ffprobepath);
        ff.setFfmpegPath(ffmpegpath);
        max = 0;
        break;
      default:
        dirC = path22.join(dirC, "..");
        max--;
    }
  }
  if (vdata && !adata) {
    ff.addInput(vdata.AVDownload.mediaurl);
    if (vdata.AVInfo.framespersecond)
      ff.withFPS(vdata.AVInfo.framespersecond);
    if (vdata.Video.aspectratio)
      ff.withAspectRatio(vdata.Video.aspectratio);
    if (vdata.Video.bitrate)
      ff.withVideoBitrate(vdata.Video.bitrate);
  } else if (adata && !vdata) {
    ff.addInput(adata.AVDownload.mediaurl);
    if (adata.Audio.channels)
      ff.withAudioChannels(adata.Audio.channels);
    if (adata.Audio.bitrate)
      ff.withAudioBitrate(adata.Audio.bitrate);
  } else if (adata && vdata) {
    ff.addInput(vdata.AVDownload.mediaurl);
    ff.addInput(adata.AVDownload.mediaurl);
    ff.withOutputOptions(["-map 0:v:0", "-map 1:a:0"]);
    ff.withVideoCodec("copy");
    ff.withAudioCodec("copy");
    if (vdata.AVInfo.framespersecond)
      ff.withFPS(vdata.AVInfo.framespersecond);
    if (vdata.Video.aspectratio)
      ff.withAspectRatio(vdata.Video.aspectratio);
    if (adata.Audio.channels)
      ff.withAudioChannels(adata.Audio.channels);
    if (vdata.Video.bitrate)
      ff.withVideoBitrate(vdata.Video.bitrate);
    if (adata.Audio.bitrate)
      ff.withAudioBitrate(adata.Audio.bitrate);
  }
  console.log(
    colors28.green("@ffmpeg:"),
    "using",
    colors28.green("ipAddress"),
    ipAddress
  );
  const numCores = os.cpus().length;
  const numThreads = numCores * 2;
  ff.addOption("-preset", "ultrafast");
  ff.addOption("-threads", numThreads.toString());
  ff.addOption("-headers", `X-Forwarded-For: ${ipAddress}`);
  ff.on("progress", (progress) => progressBar(progress));
  ff.on("end", () => process.stdout.write("\n"));
  ff.on("error", (error) => {
    throw new Error(error.message);
  });
  return ff;
}

// core/base/lowEntry.ts
async function lowEntry(metaBody) {
  const validEntries = metaBody.filter(
    (entry) => entry.AVInfo.filesizebytes !== null && entry.AVInfo.filesizebytes !== void 0 && !isNaN(entry.AVInfo.filesizebytes)
  );
  const sortedByFileSize = [...validEntries].sort(
    (a, b) => a.AVInfo.filesizebytes - b.AVInfo.filesizebytes
  );
  if (!sortedByFileSize[0])
    throw new Error("sorry no downloadable data found");
  else
    return sortedByFileSize[0];
}

// core/pipes/audio/single/AudioLowest.ts
var qconf = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  filter: z.enum([
    "echo",
    "slow",
    "speed",
    "phaser",
    "flanger",
    "panning",
    "reverse",
    "vibrato",
    "subboost",
    "surround",
    "bassboost",
    "nightcore",
    "superslow",
    "vaporwave",
    "superspeed"
  ]).optional()
});
async function AudioLowest(input) {
  const { query, output, stream, verbose, filter: filter2, autoSocks5 } = await qconf.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    let filename = "yt-dlx_(AudioLowest_";
    const ffmpeg2 = await proTube({
      adata: await lowEntry(engineData.AudioStore),
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.withOutputFormat("avi");
    switch (filter2) {
      case "bassboost":
        ffmpeg2.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
        break;
      case "echo":
        ffmpeg2.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
        break;
      case "flanger":
        ffmpeg2.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
        break;
      case "nightcore":
        ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
        break;
      case "panning":
        ffmpeg2.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
        break;
      case "phaser":
        ffmpeg2.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
        break;
      case "reverse":
        ffmpeg2.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
        break;
      case "slow":
        ffmpeg2.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
        break;
      case "speed":
        ffmpeg2.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
        break;
      case "subboost":
        ffmpeg2.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
        break;
      case "superslow":
        ffmpeg2.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
        break;
      case "superspeed":
        ffmpeg2.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
        break;
      case "surround":
        ffmpeg2.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
        break;
      case "vaporwave":
        ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
        break;
      case "vibrato":
        ffmpeg2.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
        break;
      default:
        filename += `)_${title}.avi`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}

// core/base/bigEntry.ts
async function bigEntry(metaBody) {
  const validEntries = metaBody.filter(
    (entry) => entry.AVInfo.filesizebytes !== null && entry.AVInfo.filesizebytes !== void 0 && !isNaN(entry.AVInfo.filesizebytes)
  );
  const sortedByFileSize = [...validEntries].sort(
    (a, b) => b.AVInfo.filesizebytes - a.AVInfo.filesizebytes
  );
  if (!sortedByFileSize[0])
    throw new Error("sorry no downloadable data found");
  else
    return sortedByFileSize[0];
}

// core/pipes/audio/single/AudioHighest.ts
var qconf2 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  filter: z.enum([
    "echo",
    "slow",
    "speed",
    "phaser",
    "flanger",
    "panning",
    "reverse",
    "vibrato",
    "subboost",
    "surround",
    "bassboost",
    "nightcore",
    "superslow",
    "vaporwave",
    "superspeed"
  ]).optional()
});
async function AudioHighest(input) {
  const { query, output, stream, verbose, filter: filter2, autoSocks5 } = await qconf2.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    let filename = "yt-dlx_(AudioHighest_";
    const ffmpeg2 = await proTube({
      adata: await bigEntry(engineData.AudioStore),
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.withOutputFormat("avi");
    switch (filter2) {
      case "bassboost":
        ffmpeg2.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
        break;
      case "echo":
        ffmpeg2.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
        break;
      case "flanger":
        ffmpeg2.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
        break;
      case "nightcore":
        ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
        break;
      case "panning":
        ffmpeg2.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
        break;
      case "phaser":
        ffmpeg2.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
        break;
      case "reverse":
        ffmpeg2.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
        break;
      case "slow":
        ffmpeg2.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
        break;
      case "speed":
        ffmpeg2.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
        break;
      case "subboost":
        ffmpeg2.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
        break;
      case "superslow":
        ffmpeg2.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
        break;
      case "superspeed":
        ffmpeg2.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
        break;
      case "surround":
        ffmpeg2.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
        break;
      case "vaporwave":
        ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
        break;
      case "vibrato":
        ffmpeg2.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
        break;
      default:
        filename += `)_${title}.avi`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf3 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  quality: z.enum(["high", "medium", "low", "ultralow"]),
  filter: z.enum([
    "echo",
    "slow",
    "speed",
    "phaser",
    "flanger",
    "panning",
    "reverse",
    "vibrato",
    "subboost",
    "surround",
    "bassboost",
    "nightcore",
    "superslow",
    "vaporwave",
    "superspeed"
  ]).optional()
});
async function AudioQualityCustom(input) {
  const { query, stream, verbose, output, quality, filter: filter2, autoSocks5 } = await qconf3.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const customData = engineData.AudioStore.filter(
      (op) => op.AVDownload.formatnote === quality
    );
    if (!customData) {
      throw new Error(
        colors28.red("@error: ") + quality + " not found in the video."
      );
    }
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    const ffmpeg2 = await proTube({
      adata: await bigEntry(customData),
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.withOutputFormat("avi");
    let filename = `yt-dlx_(AudioQualityCustom_${quality}`;
    switch (filter2) {
      case "bassboost":
        ffmpeg2.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
        break;
      case "echo":
        ffmpeg2.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
        break;
      case "flanger":
        ffmpeg2.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
        break;
      case "nightcore":
        ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
        break;
      case "panning":
        ffmpeg2.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
        break;
      case "phaser":
        ffmpeg2.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
        break;
      case "reverse":
        ffmpeg2.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
        break;
      case "slow":
        ffmpeg2.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
        break;
      case "speed":
        ffmpeg2.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
        break;
      case "subboost":
        ffmpeg2.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
        break;
      case "superslow":
        ffmpeg2.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
        break;
      case "superspeed":
        ffmpeg2.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
        break;
      case "surround":
        ffmpeg2.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
        break;
      case "vaporwave":
        ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
        break;
      case "vibrato":
        ffmpeg2.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
        break;
      default:
        filename += `)_${title}.avi`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf4 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  filter: z.enum([
    "echo",
    "slow",
    "speed",
    "phaser",
    "flanger",
    "panning",
    "reverse",
    "vibrato",
    "subboost",
    "surround",
    "bassboost",
    "nightcore",
    "superslow",
    "vaporwave",
    "superspeed"
  ]).optional()
});
async function ListAudioLowest(input) {
  const { query, output, verbose, filter: filter2, autoSocks5 } = await qconf4.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          video.videoLink
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(AudioLowest_";
      const ffmpeg2 = await proTube({
        adata: await lowEntry(engineData.AudioStore),
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.withOutputFormat("avi");
      switch (filter2) {
        case "bassboost":
          ffmpeg2.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          filename += `bassboost)_${title}.avi`;
          break;
        case "echo":
          ffmpeg2.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          filename += `echo)_${title}.avi`;
          break;
        case "flanger":
          ffmpeg2.withAudioFilter(["flanger"]);
          filename += `flanger)_${title}.avi`;
          break;
        case "nightcore":
          ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          filename += `nightcore)_${title}.avi`;
          break;
        case "panning":
          ffmpeg2.withAudioFilter(["apulsator=hz=0.08"]);
          filename += `panning)_${title}.avi`;
          break;
        case "phaser":
          ffmpeg2.withAudioFilter(["aphaser=in_gain=0.4"]);
          filename += `phaser)_${title}.avi`;
          break;
        case "reverse":
          ffmpeg2.withAudioFilter(["areverse"]);
          filename += `reverse)_${title}.avi`;
          break;
        case "slow":
          ffmpeg2.withAudioFilter(["atempo=0.8"]);
          filename += `slow)_${title}.avi`;
          break;
        case "speed":
          ffmpeg2.withAudioFilter(["atempo=2"]);
          filename += `speed)_${title}.avi`;
          break;
        case "subboost":
          ffmpeg2.withAudioFilter(["asubboost"]);
          filename += `subboost)_${title}.avi`;
          break;
        case "superslow":
          ffmpeg2.withAudioFilter(["atempo=0.5"]);
          filename += `superslow)_${title}.avi`;
          break;
        case "superspeed":
          ffmpeg2.withAudioFilter(["atempo=3"]);
          filename += `superspeed)_${title}.avi`;
          break;
        case "surround":
          ffmpeg2.withAudioFilter(["surround"]);
          filename += `surround)_${title}.avi`;
          break;
        case "vaporwave":
          ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          filename += `vaporwave)_${title}.avi`;
          break;
        case "vibrato":
          ffmpeg2.withAudioFilter(["vibrato=f=6.5"]);
          filename += `vibrato)_${title}.avi`;
          break;
        default:
          filename += `)_${title}.avi`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf5 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  filter: z.enum([
    "echo",
    "slow",
    "speed",
    "phaser",
    "flanger",
    "panning",
    "reverse",
    "vibrato",
    "subboost",
    "surround",
    "bassboost",
    "nightcore",
    "superslow",
    "vaporwave",
    "superspeed"
  ]).optional()
});
async function ListAudioHighest(input) {
  const { query, output, verbose, filter: filter2, autoSocks5 } = await qconf5.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          video.videoLink
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(AudioHighest_";
      const ffmpeg2 = await proTube({
        adata: await bigEntry(engineData.AudioStore),
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.withOutputFormat("avi");
      switch (filter2) {
        case "bassboost":
          ffmpeg2.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          filename += `bassboost)_${title}.avi`;
          break;
        case "echo":
          ffmpeg2.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          filename += `echo)_${title}.avi`;
          break;
        case "flanger":
          ffmpeg2.withAudioFilter(["flanger"]);
          filename += `flanger)_${title}.avi`;
          break;
        case "nightcore":
          ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          filename += `nightcore)_${title}.avi`;
          break;
        case "panning":
          ffmpeg2.withAudioFilter(["apulsator=hz=0.08"]);
          filename += `panning)_${title}.avi`;
          break;
        case "phaser":
          ffmpeg2.withAudioFilter(["aphaser=in_gain=0.4"]);
          filename += `phaser)_${title}.avi`;
          break;
        case "reverse":
          ffmpeg2.withAudioFilter(["areverse"]);
          filename += `reverse)_${title}.avi`;
          break;
        case "slow":
          ffmpeg2.withAudioFilter(["atempo=0.8"]);
          filename += `slow)_${title}.avi`;
          break;
        case "speed":
          ffmpeg2.withAudioFilter(["atempo=2"]);
          filename += `speed)_${title}.avi`;
          break;
        case "subboost":
          ffmpeg2.withAudioFilter(["asubboost"]);
          filename += `subboost)_${title}.avi`;
          break;
        case "superslow":
          ffmpeg2.withAudioFilter(["atempo=0.5"]);
          filename += `superslow)_${title}.avi`;
          break;
        case "superspeed":
          ffmpeg2.withAudioFilter(["atempo=3"]);
          filename += `superspeed)_${title}.avi`;
          break;
        case "surround":
          ffmpeg2.withAudioFilter(["surround"]);
          filename += `surround)_${title}.avi`;
          break;
        case "vaporwave":
          ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          filename += `vaporwave)_${title}.avi`;
          break;
        case "vibrato":
          ffmpeg2.withAudioFilter(["vibrato=f=6.5"]);
          filename += `vibrato)_${title}.avi`;
          break;
        default:
          filename += `)_${title}.avi`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf6 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  quality: z.enum(["high", "medium", "low", "ultralow"]),
  filter: z.enum([
    "echo",
    "slow",
    "speed",
    "phaser",
    "flanger",
    "panning",
    "reverse",
    "vibrato",
    "subboost",
    "surround",
    "bassboost",
    "nightcore",
    "superslow",
    "vaporwave",
    "superspeed"
  ]).optional()
});
async function ListAudioQualityCustom(input) {
  const { query, output, verbose, quality, filter: filter2, autoSocks5 } = await qconf6.parseAsync(input);
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const customData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      if (!customData) {
        console.log(
          colors28.red("@error: ") + quality + " not found in the video."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      let filename = `yt-dlx_(AudioQualityCustom_${quality}`;
      const ffmpeg2 = await proTube({
        adata: await bigEntry(customData),
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.withOutputFormat("avi");
      switch (filter2) {
        case "bassboost":
          ffmpeg2.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          filename += `bassboost)_${title}.avi`;
          break;
        case "echo":
          ffmpeg2.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          filename += `echo)_${title}.avi`;
          break;
        case "flanger":
          ffmpeg2.withAudioFilter(["flanger"]);
          filename += `flanger)_${title}.avi`;
          break;
        case "nightcore":
          ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          filename += `nightcore)_${title}.avi`;
          break;
        case "panning":
          ffmpeg2.withAudioFilter(["apulsator=hz=0.08"]);
          filename += `panning)_${title}.avi`;
          break;
        case "phaser":
          ffmpeg2.withAudioFilter(["aphaser=in_gain=0.4"]);
          filename += `phaser)_${title}.avi`;
          break;
        case "reverse":
          ffmpeg2.withAudioFilter(["areverse"]);
          filename += `reverse)_${title}.avi`;
          break;
        case "slow":
          ffmpeg2.withAudioFilter(["atempo=0.8"]);
          filename += `slow)_${title}.avi`;
          break;
        case "speed":
          ffmpeg2.withAudioFilter(["atempo=2"]);
          filename += `speed)_${title}.avi`;
          break;
        case "subboost":
          ffmpeg2.withAudioFilter(["asubboost"]);
          filename += `subboost)_${title}.avi`;
          break;
        case "superslow":
          ffmpeg2.withAudioFilter(["atempo=0.5"]);
          filename += `superslow)_${title}.avi`;
          break;
        case "superspeed":
          ffmpeg2.withAudioFilter(["atempo=3"]);
          filename += `superspeed)_${title}.avi`;
          break;
        case "surround":
          ffmpeg2.withAudioFilter(["surround"]);
          filename += `surround)_${title}.avi`;
          break;
        case "vaporwave":
          ffmpeg2.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          filename += `vaporwave)_${title}.avi`;
          break;
        case "vibrato":
          ffmpeg2.withAudioFilter(["vibrato=f=6.5"]);
          filename += `vibrato)_${title}.avi`;
          break;
        default:
          filename += `)_${title}.avi`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf7 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function VideoLowest(input) {
  const { query, stream, verbose, output, filter: filter2, autoSocks5 } = await qconf7.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    const ffmpeg2 = await proTube({
      vdata: await lowEntry(engineData.VideoStore),
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.addInput(engineData.metaTube.thumbnail);
    ffmpeg2.withOutputFormat("matroska");
    let filename = "yt-dlx_(VideoLowest_";
    switch (filter2) {
      case "grayscale":
        ffmpeg2.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ffmpeg2.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ffmpeg2.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ffmpeg2.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ffmpeg2.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ffmpeg2.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ffmpeg2.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf8 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function VideoHighest(input) {
  const { query, stream, verbose, output, filter: filter2, autoSocks5 } = await qconf8.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    const ffmpeg2 = await proTube({
      vdata: await bigEntry(engineData.VideoStore),
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.addInput(engineData.metaTube.thumbnail);
    ffmpeg2.withOutputFormat("matroska");
    let filename = "yt-dlx_(VideoHighest_";
    switch (filter2) {
      case "grayscale":
        ffmpeg2.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ffmpeg2.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ffmpeg2.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ffmpeg2.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ffmpeg2.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ffmpeg2.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ffmpeg2.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf9 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  quality: z.enum([
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "1440p",
    "2160p",
    "2880p",
    "4320p",
    "5760p",
    "8640p",
    "12000p"
  ]),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function VideoQualityCustom(input) {
  const { query, stream, verbose, output, quality, filter: filter2, autoSocks5 } = await qconf9.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const customData = engineData.VideoStore.filter(
      (op) => op.AVDownload.formatnote === quality
    );
    if (!customData) {
      throw new Error(
        colors28.red("@error: ") + quality + " not found in the video."
      );
    }
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    const ffmpeg2 = await proTube({
      vdata: await lowEntry(customData),
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.addInput(engineData.metaTube.thumbnail);
    ffmpeg2.withOutputFormat("matroska");
    let filename = `yt-dlx_(VideoQualityCustom_${quality}`;
    switch (filter2) {
      case "grayscale":
        ffmpeg2.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ffmpeg2.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ffmpeg2.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ffmpeg2.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ffmpeg2.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ffmpeg2.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ffmpeg2.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf10 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function ListVideoLowest(input) {
  const { query, output, verbose, filter: filter2, autoSocks5 } = await qconf10.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(VideoLowest_";
      const ffmpeg2 = await proTube({
        vdata: await lowEntry(engineData.VideoStore),
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ffmpeg2.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ffmpeg2.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ffmpeg2.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ffmpeg2.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ffmpeg2.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ffmpeg2.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ffmpeg2.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf11 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function ListVideoHighest(input) {
  const { query, verbose, output, filter: filter2, autoSocks5 } = await qconf11.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(VideoHighest_";
      const ffmpeg2 = await proTube({
        vdata: await bigEntry(engineData.VideoStore),
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ffmpeg2.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ffmpeg2.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ffmpeg2.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ffmpeg2.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ffmpeg2.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ffmpeg2.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ffmpeg2.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf12 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  quality: z.enum([
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "1440p",
    "2160p",
    "2880p",
    "4320p",
    "5760p",
    "8640p",
    "12000p"
  ]),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function ListVideoQualityCustom(input) {
  const { query, verbose, output, quality, filter: filter2, autoSocks5 } = await qconf12.parseAsync(input);
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const customData = engineData.VideoStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      if (!customData) {
        console.log(
          colors28.red("@error: ") + quality + " not found in the video."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      let filename = `yt-dlx_(VideoQualityCustom_${quality}`;
      const ffmpeg2 = await proTube({
        vdata: await bigEntry(customData),
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ffmpeg2.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ffmpeg2.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ffmpeg2.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ffmpeg2.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ffmpeg2.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ffmpeg2.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ffmpeg2.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf13 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function AudioVideoLowest(input) {
  const { query, stream, verbose, output, filter: filter2, autoSocks5 } = await qconf13.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    const [AudioData, VideoData] = await Promise.all([
      lowEntry(engineData.AudioStore),
      lowEntry(engineData.VideoStore)
    ]);
    const ffmpeg2 = await proTube({
      adata: AudioData,
      vdata: VideoData,
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.addInput(AudioData.AVDownload.mediaurl);
    ffmpeg2.withOutputFormat("matroska");
    let filename = "yt-dlx_(AudioVideoLowest_";
    switch (filter2) {
      case "grayscale":
        ffmpeg2.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ffmpeg2.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ffmpeg2.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ffmpeg2.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ffmpeg2.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ffmpeg2.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ffmpeg2.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf14 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function AudioVideoHighest(input) {
  const { query, stream, verbose, output, filter: filter2, autoSocks5 } = await qconf14.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    const [AudioData, VideoData] = await Promise.all([
      bigEntry(engineData.AudioStore),
      bigEntry(engineData.VideoStore)
    ]);
    const ffmpeg2 = await proTube({
      adata: AudioData,
      vdata: VideoData,
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.addInput(AudioData.AVDownload.mediaurl);
    ffmpeg2.withOutputFormat("matroska");
    let filename = "yt-dlx_(AudioVideoHighest_";
    switch (filter2) {
      case "grayscale":
        ffmpeg2.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ffmpeg2.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ffmpeg2.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ffmpeg2.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ffmpeg2.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ffmpeg2.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ffmpeg2.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf15 = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  AQuality: z.enum(["high", "medium", "low", "ultralow"]),
  VQuality: z.enum([
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "1440p",
    "2160p",
    "2880p",
    "4320p",
    "5760p",
    "8640p",
    "12000p"
  ]),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function AudioVideoQualityCustom(input) {
  const {
    query,
    stream,
    verbose,
    output,
    VQuality,
    AQuality,
    filter: filter2,
    autoSocks5
  } = await qconf15.parseAsync(input);
  const engineData = await Agent({ query, verbose, autoSocks5 });
  if (engineData === void 0) {
    throw new Error(
      colors28.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path22.join(process.cwd(), output) : process.cwd();
    if (!fs2.existsSync(folder))
      fs2.mkdirSync(folder, { recursive: true });
    const ACustomData = engineData.AudioStore.filter(
      (op) => op.AVDownload.formatnote === AQuality
    );
    const VCustomData = engineData.VideoStore.filter(
      (op) => op.AVDownload.formatnote === VQuality
    );
    const [AudioData, VideoData] = await Promise.all([
      bigEntry(ACustomData),
      bigEntry(VCustomData)
    ]);
    const ffmpeg2 = await proTube({
      adata: AudioData,
      vdata: VideoData,
      ipAddress: engineData.ipAddress
    });
    ffmpeg2.addInput(AudioData.AVDownload.mediaurl);
    ffmpeg2.withOutputFormat("matroska");
    let filename = `yt-dlx_(AudioVideoQualityCustom_${VQuality}_${AQuality}`;
    switch (filter2) {
      case "grayscale":
        ffmpeg2.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ffmpeg2.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ffmpeg2.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ffmpeg2.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ffmpeg2.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ffmpeg2.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ffmpeg2.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    if (stream) {
      return {
        ffmpeg: ffmpeg2,
        filename: output ? path22.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    }
    console.log(
      colors28.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28.green("yt-dlx."),
      "Consider",
      colors28.green("\u{1F31F}starring"),
      "the github repo",
      colors28.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf16 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function ListAudioVideoHighest(input) {
  const { query, verbose, output, filter: filter2, autoSocks5 } = await qconf16.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      const [AudioData, VideoData] = await Promise.all([
        bigEntry(engineData.AudioStore),
        bigEntry(engineData.VideoStore)
      ]);
      let filename = "yt-dlx_(AudioVideoHighest_";
      const ffmpeg2 = await proTube({
        adata: AudioData,
        vdata: VideoData,
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ffmpeg2.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ffmpeg2.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ffmpeg2.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ffmpeg2.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ffmpeg2.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ffmpeg2.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ffmpeg2.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf17 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function ListAudioVideoLowest(input) {
  const { query, verbose, output, filter: filter2, autoSocks5 } = await qconf17.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      const [AudioData, VideoData] = await Promise.all([
        lowEntry(engineData.AudioStore),
        lowEntry(engineData.VideoStore)
      ]);
      let filename = "yt-dlx_(AudioVideoLowest_";
      const ffmpeg2 = await proTube({
        adata: AudioData,
        vdata: VideoData,
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg2.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ffmpeg2.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ffmpeg2.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ffmpeg2.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ffmpeg2.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ffmpeg2.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ffmpeg2.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ffmpeg2.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}
var qconf18 = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
  query: z.array(
    z.string().min(1).refine(
      async (input) => {
        switch (true) {
          case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
            input
          ):
            const resultLink = await YouTubeID(input);
            if (resultLink !== void 0)
              return true;
            break;
          default:
            const resultId = await YouTubeID(
              `https://www.youtube.com/playlist?list=${input}`
            );
            if (resultId !== void 0)
              return true;
            break;
        }
        return false;
      },
      {
        message: "Query must be a valid YouTube Playlist Link or ID."
      }
    )
  ).min(1),
  AQuality: z.enum(["high", "medium", "low", "ultralow"]),
  VQuality: z.enum([
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "1440p",
    "2160p",
    "2880p",
    "4320p",
    "5760p",
    "8640p",
    "12000p"
  ]),
  filter: z.enum([
    "invert",
    "rotate90",
    "rotate270",
    "grayscale",
    "rotate180",
    "flipVertical",
    "flipHorizontal"
  ]).optional()
});
async function ListAudioVideoQualityCustom(input) {
  const { query, verbose, output, VQuality, AQuality, filter: filter2, autoSocks5 } = await qconf18.parseAsync(input);
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.search.PlaylistInfo({
        query: pURL,
        autoSocks5
      });
      if (pDATA === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "total number of uncommon videos:",
    colors28.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        autoSocks5,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path22.join(process.cwd(), output) : process.cwd();
      if (!fs2.existsSync(folder))
        fs2.mkdirSync(folder, { recursive: true });
      const ACustomData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === AQuality
      );
      const VCustomData = engineData.VideoStore.filter(
        (op) => op.AVDownload.formatnote === VQuality
      );
      const [AudioData, VideoData] = await Promise.all([
        bigEntry(ACustomData),
        bigEntry(VCustomData)
      ]);
      let filename = "yt-dlx_(AudioVideoQualityCustom_";
      const ffmpeg2 = await proTube({
        adata: AudioData,
        vdata: VideoData,
        ipAddress: engineData.ipAddress
      });
      ffmpeg2.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg2.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ffmpeg2.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ffmpeg2.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ffmpeg2.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ffmpeg2.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ffmpeg2.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ffmpeg2.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ffmpeg2.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      await new Promise((resolve, _reject) => {
        ffmpeg2.output(path22.join(folder, filename.replace("_)_", ")_")));
        ffmpeg2.on("end", () => resolve());
        ffmpeg2.on("error", (error) => {
          throw new Error(colors28.red("@error: ") + error.message);
        });
        ffmpeg2.run();
      });
    } catch (error) {
      console.log(colors28.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors28.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors28.green("yt-dlx."),
    "Consider",
    colors28.green("\u{1F31F}starring"),
    "the github repo",
    colors28.green("https://github.com/yt-dlx\n")
  );
}

// core/index.ts
var ytdlx = () => ({
  search: () => ({
    VideoInfo: web_default.search.VideoInfo,
    PlaylistInfo: web_default.search.PlaylistInfo,
    SearchVideos: web_default.search.SearchVideos
  }),
  info: () => ({
    help,
    extract,
    list_formats,
    extract_playlist_videos
  }),
  AudioOnly: () => ({
    Single: () => ({
      Lowest: AudioLowest,
      Highest: AudioHighest,
      Custom: AudioQualityCustom
    }),
    List: () => ({
      Lowest: ListAudioLowest,
      Highest: ListAudioHighest,
      Custom: ListAudioQualityCustom
    })
  }),
  VideoOnly: () => ({
    Single: () => ({
      Lowest: VideoLowest,
      Highest: VideoHighest,
      Custom: VideoQualityCustom
    }),
    List: () => ({
      Lowest: ListVideoLowest,
      Highest: ListVideoHighest,
      Custom: ListVideoQualityCustom
    })
  }),
  AudioVideo: () => ({
    Single: () => ({
      Lowest: AudioVideoLowest,
      Highest: AudioVideoHighest,
      Custom: AudioVideoQualityCustom
    }),
    List: () => ({
      Lowest: ListAudioVideoHighest,
      Highest: ListAudioVideoLowest,
      Custom: ListAudioVideoQualityCustom
    })
  })
});
var core_default = ytdlx;
var proTube2 = minimist(process.argv.slice(2), {
  string: ["query", "format"],
  alias: {
    h: "help",
    e: "extract",
    v: "version",
    f: "list-formats",
    vl: "video-lowest",
    al: "audio-lowest",
    vh: "video_highest",
    ah: "audio-highest",
    avl: "audio-video-lowest",
    avh: "audio-video-highest",
    aqc: "audio-quality-custom",
    vqc: "video-quality-custom"
  }
});
var uLoc = "";
var maxTries = 6;
var currentDir = __dirname;
var program = async () => {
  const command = proTube2._[0];
  switch (command) {
    case "install:deps":
      while (maxTries > 0) {
        const enginePath = path22.join(currentDir, "util");
        if (fs2.existsSync(enginePath)) {
          uLoc = enginePath;
          break;
        } else {
          currentDir = path22.join(currentDir, "..");
          maxTries--;
        }
      }
      const rox = spawn("sh", [
        "-c",
        `chmod +x ${uLoc}/deps.sh && ${uLoc}/deps.sh && npx puppeteer browsers install chrome && node ${uLoc}/ffmpeg.mjs && node ${uLoc}/engine.mjs && chmod -R +x ${uLoc}/*`
      ]);
      await Promise.all([
        new Promise((resolve, reject2) => {
          rox.stdout.on("data", (stdout) => {
            console.log(colors28.green("@stdout:"), stdout.toString().trim());
          });
          rox.on("close", (code) => {
            if (code === 0)
              resolve();
            else
              reject2(new Error(`@closed with code ${code}`));
          });
        }),
        new Promise((resolve, reject2) => {
          rox.stderr.on("data", (stderr) => {
            console.log(colors28.yellow("@stderr:"), stderr.toString().trim());
          });
          rox.on("close", (code) => {
            if (code === 0)
              resolve();
            else
              reject2(new Error(`@closed with code ${code}`));
          });
        })
      ]);
      break;
    case "install:socks5":
      while (maxTries > 0) {
        const enginePath = path22.join(currentDir, "util");
        if (fs2.existsSync(enginePath)) {
          uLoc = enginePath;
          break;
        } else {
          currentDir = path22.join(currentDir, "..");
          maxTries--;
        }
      }
      const xrox = spawn("sh", [
        "-c",
        `chmod +x ${uLoc}/socks5.sh && ${uLoc}/socks5.sh`
      ]);
      await Promise.all([
        new Promise((resolve, reject2) => {
          xrox.stdout.on("data", (stdout) => {
            console.log(colors28.green("@stdout:"), stdout.toString().trim());
          });
          xrox.on("close", (code) => {
            if (code === 0)
              resolve();
            else
              reject2(new Error(`@closed with code ${code}`));
          });
        }),
        new Promise((resolve, reject2) => {
          xrox.stderr.on("data", (stderr) => {
            console.log(colors28.yellow("@stderr:"), stderr.toString().trim());
          });
          xrox.on("close", (code) => {
            if (code === 0)
              resolve();
            else
              reject2(new Error(`@closed with code ${code}`));
          });
        })
      ]);
      break;
    case "version":
    case "v":
      console.error(colors28.green("Installed Version: yt-dlx@" + version));
      break;
    case "help":
    case "h":
      core_default().info().help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28.red(error));
        process.exit();
      });
      break;
    case "extract":
    case "e":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().info().extract({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "list-formats":
    case "f":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().info().list_formats({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "audio-highest":
    case "ah":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().AudioOnly().Single().Highest({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "audio-lowest":
    case "al":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().AudioOnly().Single().Lowest({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "video_highest":
    case "vh":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().VideoOnly().Single().Highest({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "video-lowest":
    case "vl":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().VideoOnly().Single().Lowest({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "audio-video-highest":
    case "avh":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().AudioVideo().Single().Highest({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "audio-video-lowest":
    case "avl":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      } else
        core_default().AudioVideo().Single().Lowest({
          query: proTube2.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28.red(error));
          process.exit();
        });
      break;
    case "audio-quality-custom":
    case "aqc":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      }
      if (!proTube2 || !proTube2.format || proTube2.format.length === 0) {
        console.error(colors28.red("error: no format"));
      }
      core_default().AudioOnly().Single().Custom({
        query: proTube2.query,
        quality: proTube2.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28.red(error));
        process.exit();
      });
      break;
    case "video-quality-custom":
    case "vqc":
      if (!proTube2 || !proTube2.query || proTube2.query.length === 0) {
        console.error(colors28.red("error: no query"));
      }
      if (!proTube2 || !proTube2.format || proTube2.format.length === 0) {
        console.error(colors28.red("error: no format"));
      }
      core_default().VideoOnly().Single().Custom({
        query: proTube2.query,
        quality: proTube2.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28.red(error));
        process.exit();
      });
      break;
    default:
      core_default().info().help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28.red(error));
        process.exit();
      });
      break;
  }
};
if (!proTube2._[0]) {
  core_default().info().help().then((data) => {
    console.log(data);
    process.exit();
  }).catch((error) => {
    console.error(colors28.red(error));
    process.exit();
  });
} else
  program();
