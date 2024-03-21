#!/usr/bin/env node
'use strict';

var zod = require('zod');
var colors15 = require('colors');
var cheerio = require('cheerio');
var puppeteer = require('puppeteer');
var child_process = require('child_process');
var fs2 = require('fs');
var path12 = require('path');
var retry = require('async-retry');
var util = require('util');
var ffmpeg = require('fluent-ffmpeg');
var minimist = require('minimist');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var colors15__default = /*#__PURE__*/_interopDefault(colors15);
var puppeteer__default = /*#__PURE__*/_interopDefault(puppeteer);
var fs2__namespace = /*#__PURE__*/_interopNamespace(fs2);
var path12__namespace = /*#__PURE__*/_interopNamespace(path12);
var retry__default = /*#__PURE__*/_interopDefault(retry);
var ffmpeg__default = /*#__PURE__*/_interopDefault(ffmpeg);
var minimist__default = /*#__PURE__*/_interopDefault(minimist);

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
async function crawler(verbose, onionTor) {
  if (onionTor) {
    browser = await puppeteer__default.default.launch({
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
    browser = await puppeteer__default.default.launch({
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

// core/web/browser/VideoInfo.ts
async function VideoInfo(input) {
  let query = "";
  const QuerySchema = zod.z.object({
    query: zod.z.string().min(1).refine(
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
    verbose: zod.z.boolean().optional(),
    onionTor: zod.z.boolean().optional(),
    screenshot: zod.z.boolean().optional()
  });
  const { screenshot, verbose, onionTor } = await QuerySchema.parseAsync(input);
  await crawler(verbose, onionTor);
  await page.goto(query);
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  }
  if (screenshot) {
    await page.screenshot({ path: "FilterVideo.png" });
    console.log(colors15__default.default.yellow("@scrape:"), "took snapshot...");
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
  const $ = cheerio.load(htmlContent);
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
  console.log(
    colors15__default.default.green("@info:"),
    colors15__default.default.white("scrapping done for"),
    colors15__default.default.green(query)
  );
  await closers(browser);
  return TubeResp;
}
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));
async function SearchVideos(input) {
  const QuerySchema = zod.z.object({
    query: zod.z.string().min(1).refine(
      async (query2) => {
        const result = await YouTubeID(query2);
        return result === void 0;
      },
      {
        message: "Query must not be a YouTube video/Playlist link"
      }
    ),
    verbose: zod.z.boolean().optional(),
    onionTor: zod.z.boolean().optional(),
    screenshot: zod.z.boolean().optional()
  });
  const { query, screenshot, verbose, onionTor } = await QuerySchema.parseAsync(
    input
  );
  await crawler(verbose, onionTor);
  let url;
  let $;
  let content;
  let metaTube = [];
  let videoElements;
  let playlistMeta = [];
  let TubeResp;
  switch (input.type) {
    case "video":
      url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query) + "&sp=EgIQAQ%253D%253D";
      await page.goto(url);
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      if (screenshot) {
        await page.screenshot({
          path: "TypeVideo.png"
        });
        console.log(colors15__default.default.yellow("@scrape:"), "took snapshot...");
      }
      content = await page.content();
      $ = cheerio.load(content);
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
      console.log(
        colors15__default.default.green("@info:"),
        colors15__default.default.white("scrapping done for"),
        colors15__default.default.green(query)
      );
      TubeResp = metaTube;
      break;
    case "playlist":
      url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query) + "&sp=EgIQAw%253D%253D";
      await page.goto(url);
      for (let i = 0; i < 80; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      if (screenshot) {
        await page.screenshot({
          path: "TypePlaylist.png"
        });
        console.log(colors15__default.default.yellow("@scrape:"), "took snapshot...");
      }
      content = await page.content();
      $ = cheerio.load(content);
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
      console.log(
        colors15__default.default.green("@info:"),
        colors15__default.default.white("scrapping done for"),
        colors15__default.default.green(query)
      );
      TubeResp = playlistMeta;
      break;
    default:
      console.log(
        colors15__default.default.red("@error:"),
        colors15__default.default.white("wrong filter type provided.")
      );
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
  const QuerySchema = zod.z.object({
    query: zod.z.string().min(1).refine(
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
    verbose: zod.z.boolean().optional(),
    onionTor: zod.z.boolean().optional(),
    screenshot: zod.z.boolean().optional()
  });
  const { screenshot, verbose, onionTor } = await QuerySchema.parseAsync(input);
  let metaTube = [];
  await crawler(verbose, onionTor);
  await page.goto(query);
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  }
  if (screenshot) {
    await page.screenshot({
      path: "FilterVideo.png"
    });
    console.log(colors15__default.default.yellow("@scrape:"), "took snapshot...");
  }
  const content = await page.content();
  const $ = cheerio.load(content);
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
  console.log(
    colors15__default.default.green("@info:"),
    colors15__default.default.white("scrapping done for"),
    colors15__default.default.green(query)
  );
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

// core/web/vercel/playlistVideos.ts
async function playlistVideos({
  playlistId
}) {
  const response = await fetch(
    `https://yt-dlx-scrape.vercel.app/api/playlistVideos?playlistId=${playlistId}`,
    {
      method: "POST"
    }
  );
  const { result } = await response.json();
  return result;
}

// core/web/vercel/relatedVideos.ts
async function relatedVideos({ videoId }) {
  const response = await fetch(
    `https://yt-dlx-scrape.vercel.app/api/relatedVideos?videoId=${videoId}`,
    {
      method: "POST"
    }
  );
  const { result } = await response.json();
  return result;
}

// core/web/vercel/searchPlaylists.ts
async function searchPlaylists({ query }) {
  const response = await fetch(
    `https://yt-dlx-scrape.vercel.app/api/searchPlaylists?query=${query}`,
    {
      method: "POST"
    }
  );
  const { result } = await response.json();
  return result;
}

// core/web/vercel/searchVideos.ts
async function searchVideos({ query }) {
  const response = await fetch(
    `https://yt-dlx-scrape.vercel.app/api/searchVideos?query=${query}`,
    {
      method: "POST"
    }
  );
  const { result } = await response.json();
  return result;
}

// core/web/vercel/singleVideo.ts
async function singleVideo({ videoId }) {
  const response = await fetch(
    `https://yt-dlx-scrape.vercel.app/api/singleVideo?videoId=${videoId}`,
    {
      method: "POST"
    }
  );
  const result = await response.json();
  return result;
}

// core/web/index.ts
var web = {
  browser: {
    VideoInfo,
    SearchVideos,
    PlaylistInfo
  },
  browserLess: {
    singleVideo,
    searchVideos,
    relatedVideos,
    playlistVideos,
    searchPlaylists
  }
};
var web_default = web;
function help() {
  console.log(
    colors15__default.default.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors15__default.default.green("yt-dlx."),
    "Consider",
    colors15__default.default.green("\u{1F31F}starring"),
    "the github repo",
    colors15__default.default.green("https://github.com/yt-dlx\n")
  );
  return Promise.resolve(
    colors15__default.default.bold.white(`
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
    const check = child_process.spawn("sudo", ["-n", "true"]);
    check.on("close", (code) => {
      resolve(code === 0);
    });
  });
}
async function niptor(args) {
  const sudoAvailable = await checkSudo();
  const command = sudoAvailable ? ["sudo", ...args] : args;
  const prox = child_process.spawn("sh", ["-c", command.join(" ")]);
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
var sizeFormat = (filesize) => {
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
};
async function Engine({
  query,
  ipAddress,
  onionTor
}) {
  let AudioLow = {};
  let AudioHigh = {};
  let VideoLow = {};
  let VideoHigh = {};
  let ManifestLow = {};
  let ManifestHigh = {};
  let AudioLowDRC = {};
  let AudioHighDRC = {};
  let VideoLowHDR = {};
  let VideoHighHDR = {};
  let AudioLowF = null;
  let AudioHighF = null;
  let VideoLowF = null;
  let VideoHighF = null;
  let dirC = __dirname || process.cwd();
  let pLoc = "";
  let maxT = 8;
  while (maxT > 0) {
    const enginePath = path12__namespace.join(dirC, "util", "engine");
    if (fs2__namespace.existsSync(enginePath)) {
      pLoc = enginePath;
      break;
    } else {
      dirC = path12__namespace.join(dirC, "..");
      maxT--;
    }
  }
  const metaCore = await retry__default.default(
    async () => {
      if (onionTor)
        pLoc += ` --proxy "socks5://127.0.0.1:9050"`;
      pLoc += ` --dump-single-json "${query}"`;
      pLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
      pLoc += ` --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"`;
      return await util.promisify(child_process.exec)(pLoc);
    },
    {
      factor: 2,
      retries: 3,
      minTimeout: 1e3,
      maxTimeout: 3e3
    }
  );
  const i = JSON.parse(metaCore.stdout.toString());
  i.formats.forEach((tube) => {
    const rm = /* @__PURE__ */ new Set(["storyboard", "Default"]);
    if (!rm.has(tube.format_note) && tube.protocol === "m3u8_native" && tube.vbr) {
      if (!ManifestLow[tube.resolution] || tube.vbr < ManifestLow[tube.resolution].vbr)
        ManifestLow[tube.resolution] = tube;
      if (!ManifestHigh[tube.resolution] || tube.vbr > ManifestHigh[tube.resolution].vbr)
        ManifestHigh[tube.resolution] = tube;
    }
    if (rm.has(tube.format_note) || tube.filesize === void 0 || null)
      return;
    if (tube.format_note.includes("DRC")) {
      if (AudioLow[tube.resolution] && !AudioLowDRC[tube.resolution]) {
        AudioLowDRC[tube.resolution] = AudioLow[tube.resolution];
      }
      if (AudioHigh[tube.resolution] && !AudioHighDRC[tube.resolution]) {
        AudioHighDRC[tube.resolution] = AudioHigh[tube.resolution];
      }
      AudioLowDRC[tube.format_note] = tube;
      AudioHighDRC[tube.format_note] = tube;
    } else if (tube.format_note.includes("HDR")) {
      if (!VideoLowHDR[tube.format_note] || tube.filesize < VideoLowHDR[tube.format_note].filesize)
        VideoLowHDR[tube.format_note] = tube;
      if (!VideoHighHDR[tube.format_note] || tube.filesize > VideoHighHDR[tube.format_note].filesize)
        VideoHighHDR[tube.format_note] = tube;
    }
    const prevLowVideo = VideoLow[tube.format_note];
    const prevHighVideo = VideoHigh[tube.format_note];
    const prevLowAudio = AudioLow[tube.format_note];
    const prevHighAudio = AudioHigh[tube.format_note];
    switch (true) {
      case tube.format_note.includes("p"):
        if (!prevLowVideo || tube.filesize < prevLowVideo.filesize)
          VideoLow[tube.format_note] = tube;
        if (!prevHighVideo || tube.filesize > prevHighVideo.filesize)
          VideoHigh[tube.format_note] = tube;
        break;
      default:
        if (!prevLowAudio || tube.filesize < prevLowAudio.filesize)
          AudioLow[tube.format_note] = tube;
        if (!prevHighAudio || tube.filesize > prevHighAudio.filesize)
          AudioHigh[tube.format_note] = tube;
        break;
    }
  });
  Object.values(AudioLow).forEach((audio) => {
    if (audio.filesize !== null) {
      switch (true) {
        case (!AudioLowF || audio.filesize < AudioLowF.filesize):
          AudioLowF = audio;
          break;
        case (!AudioHighF || audio.filesize > AudioHighF.filesize):
          AudioHighF = audio;
          break;
      }
    }
  });
  Object.values(VideoLow).forEach((video) => {
    if (video.filesize !== null) {
      switch (true) {
        case (!VideoLowF || video.filesize < VideoLowF.filesize):
          VideoLowF = video;
          break;
        case (!VideoHighF || video.filesize > VideoHighF.filesize):
          VideoHighF = video;
          break;
      }
    }
  });
  function propfilter(formats) {
    return formats.filter((i2) => {
      return !i2.format_note.includes("DRC") && !i2.format_note.includes("HDR");
    });
  }
  const payLoad = {
    ipAddress,
    AudioLowF: (() => {
      const i2 = AudioLowF || {};
      return nAudio(i2);
    })(),
    AudioHighF: (() => {
      const i2 = AudioHighF || {};
      return nAudio(i2);
    })(),
    VideoLowF: (() => {
      const i2 = VideoLowF || {};
      return nVideo(i2);
    })(),
    VideoHighF: (() => {
      const i2 = VideoHighF || {};
      return nVideo(i2);
    })(),
    AudioLowDRC: Object.values(AudioLowDRC).map((i2) => pAudio(i2)),
    AudioHighDRC: Object.values(AudioHighDRC).map((i2) => pAudio(i2)),
    AudioLow: propfilter(Object.values(AudioLow)).map((i2) => pAudio(i2)),
    AudioHigh: propfilter(Object.values(AudioHigh)).map((i2) => pAudio(i2)),
    VideoLowHDR: Object.values(VideoLowHDR).map((i2) => pVideo(i2)),
    VideoHighHDR: Object.values(VideoHighHDR).map((i2) => pVideo(i2)),
    VideoLow: propfilter(Object.values(VideoLow)).map((i2) => pVideo(i2)),
    VideoHigh: propfilter(Object.values(VideoHigh)).map((i2) => pVideo(i2)),
    ManifestLow: Object.values(ManifestLow).map((i2) => pManifest(i2)),
    ManifestHigh: Object.values(ManifestHigh).map((i2) => pManifest(i2)),
    metaData: {
      id: i.id,
      title: i.title,
      channel: i.channel,
      uploader: i.uploader,
      duration: i.duration,
      thumbnail: i.thumbnail,
      age_limit: i.age_limit,
      channel_id: i.channel_id,
      categories: i.categories,
      display_id: i.display_id,
      view_count: i.view_count,
      like_count: i.like_count,
      comment_count: i.comment_count,
      channel_follower_count: i.channel_follower_count,
      description: i.description,
      channel_url: i.channel_url,
      webpage_url: i.webpage_url,
      live_status: i.live_status,
      upload_date: i.upload_date,
      uploader_id: i.uploader_id,
      original_url: i.original_url,
      uploader_url: i.uploader_url,
      duration_string: i.duration_string
    }
  };
  return payLoad;
}
function nAudio(i) {
  i.filesizeP = sizeFormat(i.filesize);
  delete i.format_id;
  delete i.source_preference;
  delete i.has_drm;
  delete i.quality;
  delete i.fps;
  delete i.height;
  delete i.width;
  delete i.language;
  delete i.language_preference;
  delete i.preference;
  delete i.dynamic_range;
  delete i.downloader_options;
  delete i.protocol;
  delete i.aspect_ratio;
  delete i.vbr;
  delete i.vcodec;
  delete i.http_headers;
  delete i.video_ext;
  return i;
}
function nVideo(i) {
  i.filesizeP = sizeFormat(i.filesize);
  delete i.asr;
  delete i.format_id;
  delete i.has_drm;
  delete i.quality;
  delete i.source_preference;
  delete i.audio_channels;
  delete i.protocol;
  delete i.language;
  delete i.language_preference;
  delete i.preference;
  delete i.acodec;
  delete i.downloader_options;
  delete i.http_headers;
  delete i.audio_ext;
  delete i.abr;
  return i;
}
function pAudio(i) {
  return {
    filesize: i.filesize,
    filesizeP: sizeFormat(i.filesize),
    asr: parseFloat(i.asr),
    format_note: i.format_note,
    tbr: parseFloat(i.tbr),
    url: i.url,
    ext: i.ext,
    acodec: i.acodec,
    container: i.container,
    resolution: i.resolution,
    audio_ext: i.audio_ext,
    abr: parseFloat(i.abr),
    format: i.format
  };
}
function pVideo(i) {
  return {
    filesize: i.filesize,
    filesizeP: sizeFormat(i.filesize),
    format_note: i.format_note,
    fps: parseFloat(i.fps),
    height: parseFloat(i.height),
    width: parseFloat(i.width),
    tbr: parseFloat(i.tbr),
    url: i.url,
    ext: i.ext,
    vcodec: i.vcodec,
    dynamic_range: i.dynamic_range,
    container: i.container,
    resolution: i.resolution,
    aspect_ratio: parseFloat(i.aspect_ratio),
    video_ext: i.video_ext,
    vbr: parseFloat(i.vbr),
    format: i.format
  };
}
function pManifest(i) {
  return {
    url: i.url,
    manifest_url: i.manifest_url,
    tbr: parseFloat(i.tbr),
    ext: i.ext,
    fps: parseFloat(i.fps),
    width: parseFloat(i.width),
    height: parseFloat(i.height),
    vcodec: i.vcodec,
    dynamic_range: i.dynamic_range,
    aspect_ratio: parseFloat(i.aspect_ratio),
    video_ext: i.video_ext,
    vbr: parseFloat(i.vbr),
    format: i.format
  };
}

// package.json
var version = "5.21.0";

// core/base/Agent.ts
async function Agent({
  query,
  verbose,
  onionTor
}) {
  console.log(
    colors15__default.default.green("@info:"),
    "using",
    colors15__default.default.green("yt-dlx"),
    "version",
    colors15__default.default.green(version)
  );
  let nipTor;
  let ipAddress = void 0;
  nipTor = await niptor(["curl https://checkip.amazonaws.com --insecure"]);
  console.log(
    colors15__default.default.green("@info:"),
    "system",
    colors15__default.default.green("ipAddress"),
    nipTor.stdout.trim()
  );
  ipAddress = nipTor.stdout.trim();
  if (onionTor) {
    nipTor = await niptor([
      "systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure"
    ]);
    if (nipTor.stdout.trim().length > 0) {
      console.log(
        colors15__default.default.green("@info:"),
        "socks5",
        colors15__default.default.green("ipAddress"),
        nipTor.stdout.trim()
      );
      ipAddress = nipTor.stdout.trim();
    } else
      throw new Error("Unable to connect to Tor.");
  }
  let TubeBody;
  let respEngine = void 0;
  let videoId = await YouTubeID(query);
  if (!videoId) {
    TubeBody = await web_default.browserLess.searchVideos({ query });
    if (!TubeBody[0])
      throw new Error("Unable to get response!");
    else {
      console.log(
        colors15__default.default.green("@info:"),
        `preparing payload for`,
        colors15__default.default.green(TubeBody[0].title)
      );
      respEngine = await Engine({
        query: `https://www.youtube.com/watch?v=${TubeBody[0].id}`,
        onionTor,
        ipAddress
      });
      return respEngine;
    }
  } else {
    TubeBody = await web_default.browserLess.singleVideo({ videoId });
    if (!TubeBody)
      throw new Error("Unable to get response!");
    else {
      console.log(
        colors15__default.default.green("@info:"),
        `preparing payload for`,
        colors15__default.default.green(TubeBody.title)
      );
      respEngine = await Engine({
        query: `https://www.youtube.com/watch?v=${TubeBody.id}`,
        onionTor,
        ipAddress
      });
      return respEngine;
    }
  }
}

// core/pipes/command/extract.ts
async function extract({
  query,
  verbose,
  onionTor
}) {
  const metaBody = await Agent({ query, verbose, onionTor });
  if (!metaBody) {
    return {
      message: "Unable to get response from YouTube...",
      status: 500
    };
  }
  const uploadDate = new Date(
    metaBody.metaData.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
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
  const videoTimeInSeconds = metaBody.metaData.duration;
  const videoDuration = calculateVideoDuration(videoTimeInSeconds);
  const viewCountFormatted = formatCount(metaBody.metaData.view_count);
  const likeCountFormatted = formatCount(metaBody.metaData.like_count);
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
    ipAddress: metaBody.ipAddress,
    AudioLowF: metaBody.AudioLowF,
    AudioHighF: metaBody.AudioHighF,
    VideoLowF: metaBody.VideoLowF,
    VideoHighF: metaBody.VideoHighF,
    AudioLowDRC: metaBody.AudioLowDRC,
    AudioHighDRC: metaBody.AudioHighDRC,
    AudioLow: metaBody.AudioLow,
    AudioHigh: metaBody.AudioHigh,
    VideoLowHDR: metaBody.VideoLowHDR,
    VideoHighHDR: metaBody.VideoHighHDR,
    VideoLow: metaBody.VideoLow,
    VideoHigh: metaBody.VideoHigh,
    ManifestLow: metaBody.ManifestLow,
    ManifestHigh: metaBody.ManifestHigh,
    meta_data: {
      id: metaBody.metaData.id,
      original_url: metaBody.metaData.original_url,
      webpage_url: metaBody.metaData.webpage_url,
      title: metaBody.metaData.title,
      view_count: metaBody.metaData.view_count,
      like_count: metaBody.metaData.like_count,
      view_count_formatted: viewCountFormatted,
      like_count_formatted: likeCountFormatted,
      uploader: metaBody.metaData.uploader,
      uploader_id: metaBody.metaData.uploader_id,
      uploader_url: metaBody.metaData.uploader_url,
      thumbnail: metaBody.metaData.thumbnail,
      categories: metaBody.metaData.categories,
      time: videoTimeInSeconds,
      duration: videoDuration,
      age_limit: metaBody.metaData.age_limit,
      live_status: metaBody.metaData.live_status,
      description: metaBody.metaData.description,
      full_description: metaBody.metaData.description,
      upload_date: prettyDate,
      upload_ago: daysAgo,
      upload_ago_formatted: uploadAgoObject,
      comment_count: metaBody.metaData.comment_count,
      comment_count_formatted: formatCount(metaBody.metaData.comment_count),
      channel_id: metaBody.metaData.channel_id,
      channel_name: metaBody.metaData.channel,
      channel_url: metaBody.metaData.channel_url,
      channel_follower_count: metaBody.metaData.channel_follower_count,
      channel_follower_count_formatted: formatCount(
        metaBody.metaData.channel_follower_count
      )
    }
  };
  console.log(
    colors15__default.default.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors15__default.default.green("yt-dlx."),
    "Consider",
    colors15__default.default.green("\u{1F31F}starring"),
    "the github repo",
    colors15__default.default.green("https://github.com/yt-dlx\n")
  );
  return payload;
}
async function list_formats({
  query,
  verbose,
  onionTor
}) {
  const metaBody = await Agent({ query, verbose, onionTor });
  if (!metaBody) {
    throw new Error("@error: Unable to get response from YouTube.");
  } else {
    console.log("");
    printTable("AudioLow", metaBody.AudioLow);
    printTable("AudioLowDRC", metaBody.AudioLowDRC);
    printTable("AudioHigh", metaBody.AudioHigh);
    printTable("AudioHighDRC", metaBody.AudioHighDRC);
    printTable("VideoLow", metaBody.VideoLow);
    printTable("VideoLowHDR", metaBody.VideoLowHDR);
    printTable("VideoHigh", metaBody.VideoHigh);
    printTable("VideoHighHDR", metaBody.VideoHighHDR);
    printManifestTable("ManifestLow", metaBody.ManifestLow);
    printManifestTable("ManifestHigh", metaBody.ManifestHigh);
  }
}
function printTable(title, data) {
  console.log(colors15__default.default.green(title) + ":");
  data.forEach((item) => {
    console.log(
      " ".repeat(4),
      item.filesizeP.padEnd(10),
      "|",
      item.format_note
    );
  });
  console.log("");
}
function printManifestTable(title, data) {
  console.log(colors15__default.default.green(title) + ":");
  data.forEach((item) => {
    console.log(" ".repeat(4), item.format.padEnd(10), "|", item.tbr);
  });
  console.log("");
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
  playlistUrls
}) {
  let counter = 0;
  const metaTubeArr = [];
  await eachSeries$1(playlistUrls, async (listLink) => {
    const query = await YouTubeID(listLink);
    if (query === void 0) {
      console.error(
        colors15__default.default.bold.red("@error: "),
        "invalid youtube playlist url:",
        listLink
      );
      return;
    } else {
      const playlistId = await YouTubeID(query);
      if (!playlistId) {
        console.error(
          colors15__default.default.bold.red("@error: "),
          "incorrect playlist link.",
          query
        );
        return;
      }
      const resp = await web_default.browserLess.playlistVideos({
        playlistId
      });
      if (!resp) {
        console.error(
          colors15__default.default.bold.red("@error: "),
          "unable to get response from youtube for",
          query
        );
        return;
      } else {
        console.log(
          colors15__default.default.green("@info:"),
          "total videos in playlist",
          colors15__default.default.green(resp.playlistTitle),
          resp.playlistVideoCount
        );
        await eachSeries$1(resp.playlistVideos, async (vid) => {
          const metaTube = await Agent({
            query: vid.videoLink
          });
          counter++;
          console.log(
            colors15__default.default.green("@info:"),
            "added",
            counter + "/" + resp.playlistVideoCount
          );
          metaTubeArr.push(metaTube);
        });
      }
    }
  });
  console.log(
    colors15__default.default.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors15__default.default.green("yt-dlx."),
    "Consider",
    colors15__default.default.green("\u{1F31F}starring"),
    "the github repo",
    colors15__default.default.green("https://github.com/yt-dlx\n")
  );
  return metaTubeArr;
}

// core/base/formatTime.ts
function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds))
    return "00h 00m 00s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
}

// core/base/calculateETA.ts
function calculateETA(startTime, percent) {
  const currentTime = /* @__PURE__ */ new Date();
  const elapsedTime = (currentTime - startTime) / 1e3;
  const remainingTime = elapsedTime / percent * (100 - percent);
  return remainingTime.toFixed(2);
}

// core/pipes/Audio/single/AudioLowest.ts
var qconf = zod.z.object({
  query: zod.z.string().min(1),
  output: zod.z.string().optional(),
  stream: zod.z.boolean().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  filter: zod.z.enum([
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
  let startTime;
  const { query, output, stream, verbose, filter: filter2, onionTor } = await qconf.parseAsync(input);
  const engineData = await Agent({ query, verbose, onionTor });
  if (engineData === void 0) {
    throw new Error(
      colors15__default.default.red("@error: ") + "unable to get response from YouTube."
    );
  } else {
    const title = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
    if (!fs2__namespace.existsSync(folder))
      fs2__namespace.mkdirSync(folder, { recursive: true });
    let filename = "yt-dlx_(AudioLowest_";
    const ff = ffmpeg__default.default();
    ff.addInput(engineData.AudioLowF.url);
    ff.addInput(engineData.metaData.thumbnail);
    ff.outputOptions(["-c", "copy"]);
    ff.withOutputFormat("avi");
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    switch (filter2) {
      case "bassboost":
        ff.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
        break;
      case "echo":
        ff.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
        break;
      case "flanger":
        ff.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
        break;
      case "nightcore":
        ff.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
        break;
      case "panning":
        ff.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
        break;
      case "phaser":
        ff.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
        break;
      case "reverse":
        ff.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
        break;
      case "slow":
        ff.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
        break;
      case "speed":
        ff.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
        break;
      case "subboost":
        ff.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
        break;
      case "superslow":
        ff.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
        break;
      case "superspeed":
        ff.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
        break;
      case "surround":
        ff.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
        break;
      case "vaporwave":
        ff.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
        break;
      case "vibrato":
        ff.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
        break;
      default:
        filename += `)_${title}.avi`;
        break;
    }
    ff.on("error", (error) => {
      throw new Error(error.message);
    });
    ff.on("start", (comd) => {
      startTime = /* @__PURE__ */ new Date();
      if (verbose)
        console.info(colors15__default.default.green("@comd:"), comd);
    });
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("progress", ({ percent, timemark }) => {
      let color = colors15__default.default.green;
      if (isNaN(percent))
        percent = 0;
      if (percent > 98)
        percent = 100;
      if (percent < 25)
        color = colors15__default.default.red;
      else if (percent < 50)
        color = colors15__default.default.yellow;
      const width = Math.floor(process.stdout.columns / 4);
      const scomp = Math.round(width * percent / 100);
      const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output ? path12__namespace.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, reject2) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject2(new Error(colors15__default.default.red("@error: ") + error.message));
        });
        ff.run();
      });
    }
    console.log(
      colors15__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors15__default.default.green("yt-dlx."),
      "Consider",
      colors15__default.default.green("\u{1F31F}starring"),
      "the GitHub repo",
      colors15__default.default.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf2 = zod.z.object({
  query: zod.z.string().min(1),
  output: zod.z.string().optional(),
  stream: zod.z.boolean().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  filter: zod.z.enum([
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
  let startTime;
  const { query, output, stream, verbose, filter: filter2, onionTor } = await qconf2.parseAsync(input);
  const engineData = await Agent({ query, verbose, onionTor });
  if (engineData === void 0) {
    throw new Error(
      colors15__default.default.red("@error: ") + "unable to get response from YouTube."
    );
  } else {
    const title = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
    if (!fs2__namespace.existsSync(folder))
      fs2__namespace.mkdirSync(folder, { recursive: true });
    let filename = "yt-dlx_(AudioHighest_";
    const ff = ffmpeg__default.default();
    ff.addInput(engineData.AudioHighF.url);
    ff.addInput(engineData.metaData.thumbnail);
    ff.outputOptions(["-c", "copy"]);
    ff.withOutputFormat("avi");
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    switch (filter2) {
      case "bassboost":
        ff.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
        break;
      case "echo":
        ff.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
        break;
      case "flanger":
        ff.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
        break;
      case "nightcore":
        ff.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
        break;
      case "panning":
        ff.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
        break;
      case "phaser":
        ff.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
        break;
      case "reverse":
        ff.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
        break;
      case "slow":
        ff.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
        break;
      case "speed":
        ff.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
        break;
      case "subboost":
        ff.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
        break;
      case "superslow":
        ff.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
        break;
      case "superspeed":
        ff.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
        break;
      case "surround":
        ff.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
        break;
      case "vaporwave":
        ff.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
        break;
      case "vibrato":
        ff.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
        break;
      default:
        filename += `)_${title}.avi`;
        break;
    }
    ff.on("error", (error) => {
      throw new Error(error.message);
    });
    ff.on("start", (comd) => {
      startTime = /* @__PURE__ */ new Date();
      if (verbose)
        console.info(colors15__default.default.green("@comd:"), comd);
    });
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("progress", ({ percent, timemark }) => {
      let color = colors15__default.default.green;
      if (isNaN(percent))
        percent = 0;
      if (percent > 98)
        percent = 100;
      if (percent < 25)
        color = colors15__default.default.red;
      else if (percent < 50)
        color = colors15__default.default.yellow;
      const width = Math.floor(process.stdout.columns / 4);
      const scomp = Math.round(width * percent / 100);
      const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output ? path12__namespace.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, reject2) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject2(new Error(colors15__default.default.red("@error: ") + error.message));
        });
        ff.run();
      });
    }
    console.log(
      colors15__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors15__default.default.green("yt-dlx."),
      "Consider",
      colors15__default.default.green("\u{1F31F}starring"),
      "the GitHub repo",
      colors15__default.default.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf3 = zod.z.object({
  output: zod.z.string().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  query: zod.z.array(
    zod.z.string().min(1).refine(
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
  filter: zod.z.enum([
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
  let startTime;
  const { query, output, verbose, filter: filter2, onionTor } = await qconf3.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.browserLess.playlistVideos({
        playlistId: await YouTubeID(pURL)
      });
      if (pDATA === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "total number of uncommon videos:",
    colors15__default.default.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        onionTor,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube for",
          video.videoLink
        );
        continue;
      }
      const title = engineData.metaData.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs2__namespace.existsSync(folder))
        fs2__namespace.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(AudioLowest_";
      const ff = ffmpeg__default.default();
      ff.addInput(engineData.AudioLowF.url);
      ff.addInput(engineData.metaData.thumbnail);
      ff.outputOptions(["-c", "copy"]);
      ff.withOutputFormat("avi");
      ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
      switch (filter2) {
        case "bassboost":
          ff.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          filename += `bassboost)_${title}.avi`;
          break;
        case "echo":
          ff.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          filename += `echo)_${title}.avi`;
          break;
        case "flanger":
          ff.withAudioFilter(["flanger"]);
          filename += `flanger)_${title}.avi`;
          break;
        case "nightcore":
          ff.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          filename += `nightcore)_${title}.avi`;
          break;
        case "panning":
          ff.withAudioFilter(["apulsator=hz=0.08"]);
          filename += `panning)_${title}.avi`;
          break;
        case "phaser":
          ff.withAudioFilter(["aphaser=in_gain=0.4"]);
          filename += `phaser)_${title}.avi`;
          break;
        case "reverse":
          ff.withAudioFilter(["areverse"]);
          filename += `reverse)_${title}.avi`;
          break;
        case "slow":
          ff.withAudioFilter(["atempo=0.8"]);
          filename += `slow)_${title}.avi`;
          break;
        case "speed":
          ff.withAudioFilter(["atempo=2"]);
          filename += `speed)_${title}.avi`;
          break;
        case "subboost":
          ff.withAudioFilter(["asubboost"]);
          filename += `subboost)_${title}.avi`;
          break;
        case "superslow":
          ff.withAudioFilter(["atempo=0.5"]);
          filename += `superslow)_${title}.avi`;
          break;
        case "superspeed":
          ff.withAudioFilter(["atempo=3"]);
          filename += `superspeed)_${title}.avi`;
          break;
        case "surround":
          ff.withAudioFilter(["surround"]);
          filename += `surround)_${title}.avi`;
          break;
        case "vaporwave":
          ff.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          filename += `vaporwave)_${title}.avi`;
          break;
        case "vibrato":
          ff.withAudioFilter(["vibrato=f=6.5"]);
          filename += `vibrato)_${title}.avi`;
          break;
        default:
          filename += `)_${title}.avi`;
          break;
      }
      ff.on("error", (error) => {
        throw new Error(error.message);
      });
      ff.on("start", (comd) => {
        startTime = /* @__PURE__ */ new Date();
        if (verbose)
          console.info(colors15__default.default.green("@comd:"), comd);
      });
      ff.on("end", () => process.stdout.write("\n"));
      ff.on("progress", ({ percent, timemark }) => {
        let color = colors15__default.default.green;
        if (isNaN(percent))
          percent = 0;
        if (percent > 98)
          percent = 100;
        if (percent < 25)
          color = colors15__default.default.red;
        else if (percent < 50)
          color = colors15__default.default.yellow;
        const width = Math.floor(process.stdout.columns / 4);
        const scomp = Math.round(width * percent / 100);
        const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
        process.stdout.write(
          `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(
            calculateETA(startTime, percent)
          )}`
        );
      });
      await new Promise((resolve, _reject) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          throw new Error(colors15__default.default.red("@error: ") + error.message);
        });
        ff.run();
      });
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors15__default.default.green("yt-dlx."),
    "Consider",
    colors15__default.default.green("\u{1F31F}starring"),
    "the github repo",
    colors15__default.default.green("https://github.com/yt-dlx\n")
  );
}
var qconf4 = zod.z.object({
  output: zod.z.string().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  query: zod.z.array(
    zod.z.string().min(1).refine(
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
  filter: zod.z.enum([
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
  let startTime;
  const { query, output, verbose, filter: filter2, onionTor } = await qconf4.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.browserLess.playlistVideos({
        playlistId: await YouTubeID(pURL)
      });
      if (pDATA === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "total number of uncommon videos:",
    colors15__default.default.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        onionTor,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube for",
          video.videoLink
        );
        continue;
      }
      const title = engineData.metaData.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs2__namespace.existsSync(folder))
        fs2__namespace.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(AudioHighest_";
      const ff = ffmpeg__default.default();
      ff.addInput(engineData.AudioHighF.url);
      ff.addInput(engineData.metaData.thumbnail);
      ff.outputOptions(["-c", "copy"]);
      ff.withOutputFormat("avi");
      ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
      switch (filter2) {
        case "bassboost":
          ff.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          filename += `bassboost)_${title}.avi`;
          break;
        case "echo":
          ff.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          filename += `echo)_${title}.avi`;
          break;
        case "flanger":
          ff.withAudioFilter(["flanger"]);
          filename += `flanger)_${title}.avi`;
          break;
        case "nightcore":
          ff.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          filename += `nightcore)_${title}.avi`;
          break;
        case "panning":
          ff.withAudioFilter(["apulsator=hz=0.08"]);
          filename += `panning)_${title}.avi`;
          break;
        case "phaser":
          ff.withAudioFilter(["aphaser=in_gain=0.4"]);
          filename += `phaser)_${title}.avi`;
          break;
        case "reverse":
          ff.withAudioFilter(["areverse"]);
          filename += `reverse)_${title}.avi`;
          break;
        case "slow":
          ff.withAudioFilter(["atempo=0.8"]);
          filename += `slow)_${title}.avi`;
          break;
        case "speed":
          ff.withAudioFilter(["atempo=2"]);
          filename += `speed)_${title}.avi`;
          break;
        case "subboost":
          ff.withAudioFilter(["asubboost"]);
          filename += `subboost)_${title}.avi`;
          break;
        case "superslow":
          ff.withAudioFilter(["atempo=0.5"]);
          filename += `superslow)_${title}.avi`;
          break;
        case "superspeed":
          ff.withAudioFilter(["atempo=3"]);
          filename += `superspeed)_${title}.avi`;
          break;
        case "surround":
          ff.withAudioFilter(["surround"]);
          filename += `surround)_${title}.avi`;
          break;
        case "vaporwave":
          ff.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          filename += `vaporwave)_${title}.avi`;
          break;
        case "vibrato":
          ff.withAudioFilter(["vibrato=f=6.5"]);
          filename += `vibrato)_${title}.avi`;
          break;
        default:
          filename += `)_${title}.avi`;
          break;
      }
      ff.on("error", (error) => {
        throw new Error(error.message);
      });
      ff.on("start", (comd) => {
        startTime = /* @__PURE__ */ new Date();
        if (verbose)
          console.info(colors15__default.default.green("@comd:"), comd);
      });
      ff.on("end", () => process.stdout.write("\n"));
      ff.on("progress", ({ percent, timemark }) => {
        let color = colors15__default.default.green;
        if (isNaN(percent))
          percent = 0;
        if (percent > 98)
          percent = 100;
        if (percent < 25)
          color = colors15__default.default.red;
        else if (percent < 50)
          color = colors15__default.default.yellow;
        const width = Math.floor(process.stdout.columns / 4);
        const scomp = Math.round(width * percent / 100);
        const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
        process.stdout.write(
          `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(
            calculateETA(startTime, percent)
          )}`
        );
      });
      await new Promise((resolve, _reject) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          throw new Error(colors15__default.default.red("@error: ") + error.message);
        });
        ff.run();
      });
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors15__default.default.green("yt-dlx."),
    "Consider",
    colors15__default.default.green("\u{1F31F}starring"),
    "the github repo",
    colors15__default.default.green("https://github.com/yt-dlx\n")
  );
}
var qconf5 = zod.z.object({
  query: zod.z.string().min(1),
  output: zod.z.string().optional(),
  stream: zod.z.boolean().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  filter: zod.z.enum([
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
  let startTime;
  const { query, stream, verbose, output, filter: filter2, onionTor } = await qconf5.parseAsync(input);
  const engineData = await Agent({ query, verbose, onionTor });
  if (engineData === void 0) {
    throw new Error(
      colors15__default.default.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
    if (!fs2__namespace.existsSync(folder))
      fs2__namespace.mkdirSync(folder, { recursive: true });
    const ff = ffmpeg__default.default();
    const vdata = Array.isArray(engineData.ManifestLow) && engineData.ManifestLow.length > 0 ? engineData.ManifestLow[0]?.url : void 0;
    if (vdata)
      ff.addInput(vdata.toString());
    else
      throw new Error(colors15__default.default.red("@error: ") + "no video data found.");
    ff.outputOptions(["-c", "copy"]);
    ff.withOutputFormat("matroska");
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    let filename = "yt-dlx_(VideoLowest_";
    switch (filter2) {
      case "grayscale":
        ff.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ff.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ff.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ff.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ff.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ff.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ff.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    ff.on("error", (error) => {
      throw new Error(error.message);
    });
    ff.on("start", (comd) => {
      startTime = /* @__PURE__ */ new Date();
      if (verbose)
        console.info(colors15__default.default.green("@comd:"), comd);
    });
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("progress", ({ percent, timemark }) => {
      let color = colors15__default.default.green;
      if (isNaN(percent))
        percent = 0;
      if (percent > 98)
        percent = 100;
      if (percent < 25)
        color = colors15__default.default.red;
      else if (percent < 50)
        color = colors15__default.default.yellow;
      const width = Math.floor(process.stdout.columns / 4);
      const scomp = Math.round(width * percent / 100);
      const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output ? path12__namespace.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, reject2) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject2(new Error(colors15__default.default.red("@error: ") + error.message));
        });
        ff.run();
      });
    }
    console.log(
      colors15__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors15__default.default.green("yt-dlx."),
      "Consider",
      colors15__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors15__default.default.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf6 = zod.z.object({
  query: zod.z.string().min(1),
  output: zod.z.string().optional(),
  stream: zod.z.boolean().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  filter: zod.z.enum([
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
  let startTime;
  const { query, stream, verbose, output, filter: filter2, onionTor } = await qconf6.parseAsync(input);
  const engineData = await Agent({ query, verbose, onionTor });
  if (engineData === void 0) {
    throw new Error(
      colors15__default.default.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
    if (!fs2__namespace.existsSync(folder))
      fs2__namespace.mkdirSync(folder, { recursive: true });
    const ff = ffmpeg__default.default();
    const vdata = Array.isArray(engineData.ManifestHigh) && engineData.ManifestHigh.length > 0 ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url : void 0;
    if (vdata)
      ff.addInput(vdata.toString());
    else
      throw new Error(colors15__default.default.red("@error: ") + "no video data found.");
    ff.outputOptions(["-c", "copy"]);
    ff.withOutputFormat("matroska");
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    let filename = "yt-dlx_(VideoHighest_";
    switch (filter2) {
      case "grayscale":
        ff.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ff.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ff.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ff.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ff.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ff.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ff.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    ff.on("error", (error) => {
      throw new Error(error.message);
    });
    ff.on("start", (comd) => {
      startTime = /* @__PURE__ */ new Date();
      if (verbose)
        console.info(colors15__default.default.green("@comd:"), comd);
    });
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("progress", ({ percent, timemark }) => {
      let color = colors15__default.default.green;
      if (isNaN(percent))
        percent = 0;
      if (percent > 98)
        percent = 100;
      if (percent < 25)
        color = colors15__default.default.red;
      else if (percent < 50)
        color = colors15__default.default.yellow;
      const width = Math.floor(process.stdout.columns / 4);
      const scomp = Math.round(width * percent / 100);
      const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output ? path12__namespace.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, reject2) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject2(new Error(colors15__default.default.red("@error: ") + error.message));
        });
        ff.run();
      });
    }
    console.log(
      colors15__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors15__default.default.green("yt-dlx."),
      "Consider",
      colors15__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors15__default.default.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf7 = zod.z.object({
  output: zod.z.string().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  query: zod.z.array(
    zod.z.string().min(1).refine(
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
  filter: zod.z.enum([
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
  let startTime;
  const { query, verbose, output, filter: filter2, onionTor } = await qconf7.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.browserLess.playlistVideos({
        playlistId: await YouTubeID(pURL)
      });
      if (pDATA === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "total number of uncommon videos:",
    colors15__default.default.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        onionTor,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaData.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs2__namespace.existsSync(folder))
        fs2__namespace.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(VideoLowest_";
      const ff = ffmpeg__default.default();
      const vdata = Array.isArray(engineData.ManifestLow) && engineData.ManifestLow.length > 0 ? engineData.ManifestLow[0]?.url : void 0;
      if (vdata)
        ff.addInput(vdata.toString());
      else
        throw new Error(colors15__default.default.red("@error: ") + "no video data found.");
      ff.outputOptions(["-c", "copy"]);
      ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
      ff.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ff.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ff.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ff.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ff.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ff.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ff.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ff.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      ff.on("error", (error) => {
        throw new Error(error.message);
      });
      ff.on("start", (comd) => {
        startTime = /* @__PURE__ */ new Date();
        if (verbose)
          console.info(colors15__default.default.green("@comd:"), comd);
      });
      ff.on("end", () => process.stdout.write("\n"));
      ff.on("progress", ({ percent, timemark }) => {
        let color = colors15__default.default.green;
        if (isNaN(percent))
          percent = 0;
        if (percent > 98)
          percent = 100;
        if (percent < 25)
          color = colors15__default.default.red;
        else if (percent < 50)
          color = colors15__default.default.yellow;
        const width = Math.floor(process.stdout.columns / 4);
        const scomp = Math.round(width * percent / 100);
        const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
        process.stdout.write(
          `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(
            calculateETA(startTime, percent)
          )}`
        );
      });
      await new Promise((resolve, _reject) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          throw new Error(colors15__default.default.red("@error: ") + error.message);
        });
        ff.run();
      });
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors15__default.default.green("yt-dlx."),
    "Consider",
    colors15__default.default.green("\u{1F31F}starring"),
    "the github repo",
    colors15__default.default.green("https://github.com/yt-dlx\n")
  );
}
var qconf8 = zod.z.object({
  output: zod.z.string().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  query: zod.z.array(
    zod.z.string().min(1).refine(
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
  filter: zod.z.enum([
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
  let startTime;
  const { query, verbose, output, filter: filter2, onionTor } = await qconf8.parseAsync(
    input
  );
  const vDATA = /* @__PURE__ */ new Set();
  for (const pURL of query) {
    try {
      const pDATA = await web_default.browserLess.playlistVideos({
        playlistId: await YouTubeID(pURL)
      });
      if (pDATA === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube for",
          pURL
        );
        continue;
      }
      for (const video of pDATA.playlistVideos)
        vDATA.add(video);
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "total number of uncommon videos:",
    colors15__default.default.yellow(vDATA.size.toString())
  );
  for (const video of vDATA) {
    try {
      const engineData = await Agent({
        query: video.videoLink,
        onionTor,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors15__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaData.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs2__namespace.existsSync(folder))
        fs2__namespace.mkdirSync(folder, { recursive: true });
      let filename = "yt-dlx_(VideoHighest_";
      const ff = ffmpeg__default.default();
      const vdata = Array.isArray(engineData.ManifestHigh) && engineData.ManifestHigh.length > 0 ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url : void 0;
      if (vdata)
        ff.addInput(vdata.toString());
      else
        throw new Error(colors15__default.default.red("@error: ") + "no video data found.");
      ff.outputOptions(["-c", "copy"]);
      ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
      ff.withOutputFormat("matroska");
      switch (filter2) {
        case "grayscale":
          ff.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ff.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ff.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ff.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ff.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ff.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ff.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      ff.on("error", (error) => {
        throw new Error(error.message);
      });
      ff.on("start", (comd) => {
        startTime = /* @__PURE__ */ new Date();
        if (verbose)
          console.info(colors15__default.default.green("@comd:"), comd);
      });
      ff.on("end", () => process.stdout.write("\n"));
      ff.on("progress", ({ percent, timemark }) => {
        let color = colors15__default.default.green;
        if (isNaN(percent))
          percent = 0;
        if (percent > 98)
          percent = 100;
        if (percent < 25)
          color = colors15__default.default.red;
        else if (percent < 50)
          color = colors15__default.default.yellow;
        const width = Math.floor(process.stdout.columns / 4);
        const scomp = Math.round(width * percent / 100);
        const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
        process.stdout.write(
          `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(
            calculateETA(startTime, percent)
          )}`
        );
      });
      await new Promise((resolve, _reject) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          throw new Error(colors15__default.default.red("@error: ") + error.message);
        });
        ff.run();
      });
    } catch (error) {
      console.log(colors15__default.default.red("@error:"), error);
      continue;
    }
  }
  console.log(
    colors15__default.default.green("@info:"),
    "\u2763\uFE0F Thank you for using",
    colors15__default.default.green("yt-dlx."),
    "Consider",
    colors15__default.default.green("\u{1F31F}starring"),
    "the github repo",
    colors15__default.default.green("https://github.com/yt-dlx\n")
  );
}
var qconf9 = zod.z.object({
  query: zod.z.string().min(1),
  output: zod.z.string().optional(),
  stream: zod.z.boolean().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  filter: zod.z.enum([
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
  let startTime;
  const { query, stream, verbose, output, filter: filter2, onionTor } = await qconf9.parseAsync(input);
  const engineData = await Agent({ query, verbose, onionTor });
  if (engineData === void 0) {
    throw new Error(
      colors15__default.default.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
    if (!fs2__namespace.existsSync(folder))
      fs2__namespace.mkdirSync(folder, { recursive: true });
    const ff = ffmpeg__default.default();
    const vdata = Array.isArray(engineData.ManifestHigh) && engineData.ManifestHigh.length > 0 ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url : void 0;
    ff.addInput(engineData.AudioHighF.url);
    if (vdata)
      ff.addInput(vdata.toString());
    else
      throw new Error(colors15__default.default.red("@error: ") + "no video data found.");
    ff.outputOptions(["-c", "copy"]);
    ff.withOutputFormat("matroska");
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    let filename = "yt-dlx_(AudioVideoHighest_";
    switch (filter2) {
      case "grayscale":
        ff.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ff.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ff.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ff.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ff.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ff.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ff.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    ff.on("error", (error) => {
      throw new Error(error.message);
    });
    ff.on("start", (comd) => {
      startTime = /* @__PURE__ */ new Date();
      if (verbose)
        console.info(colors15__default.default.green("@comd:"), comd);
    });
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("progress", ({ percent, timemark }) => {
      let color = colors15__default.default.green;
      if (isNaN(percent))
        percent = 0;
      if (percent > 98)
        percent = 100;
      if (percent < 25)
        color = colors15__default.default.red;
      else if (percent < 50)
        color = colors15__default.default.yellow;
      const width = Math.floor(process.stdout.columns / 4);
      const scomp = Math.round(width * percent / 100);
      const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output ? path12__namespace.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, reject2) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject2(new Error(colors15__default.default.red("@error: ") + error.message));
        });
        ff.run();
      });
    }
    console.log(
      colors15__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors15__default.default.green("yt-dlx."),
      "Consider",
      colors15__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors15__default.default.green("https://github.com/yt-dlx\n")
    );
  }
}
var qconf10 = zod.z.object({
  query: zod.z.string().min(1),
  output: zod.z.string().optional(),
  stream: zod.z.boolean().optional(),
  verbose: zod.z.boolean().optional(),
  onionTor: zod.z.boolean().optional(),
  filter: zod.z.enum([
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
  let startTime;
  const { query, stream, verbose, output, filter: filter2, onionTor } = await qconf10.parseAsync(input);
  const engineData = await Agent({ query, verbose, onionTor });
  if (engineData === void 0) {
    throw new Error(
      colors15__default.default.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path12__namespace.join(process.cwd(), output) : process.cwd();
    if (!fs2__namespace.existsSync(folder))
      fs2__namespace.mkdirSync(folder, { recursive: true });
    const ff = ffmpeg__default.default();
    const vdata = Array.isArray(engineData.ManifestLow) && engineData.ManifestLow.length > 0 ? engineData.ManifestLow[0]?.url : void 0;
    ff.addInput(engineData.AudioLowF.url);
    if (vdata)
      ff.addInput(vdata.toString());
    else
      throw new Error(colors15__default.default.red("@error: ") + "no video data found.");
    ff.outputOptions(["-c", "copy"]);
    ff.withOutputFormat("matroska");
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    let filename = "yt-dlx_(AudioVideoLowest_";
    switch (filter2) {
      case "grayscale":
        ff.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        filename += `grayscale)_${title}.mkv`;
        break;
      case "invert":
        ff.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
        break;
      case "rotate90":
        ff.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
        break;
      case "rotate180":
        ff.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
        break;
      case "rotate270":
        ff.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
        break;
      case "flipHorizontal":
        ff.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
        break;
      case "flipVertical":
        ff.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
        break;
      default:
        filename += `)_${title}.mkv`;
        break;
    }
    ff.on("error", (error) => {
      throw new Error(error.message);
    });
    ff.on("start", (comd) => {
      startTime = /* @__PURE__ */ new Date();
      if (verbose)
        console.info(colors15__default.default.green("@comd:"), comd);
    });
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("progress", ({ percent, timemark }) => {
      let color = colors15__default.default.green;
      if (isNaN(percent))
        percent = 0;
      if (percent > 98)
        percent = 100;
      if (percent < 25)
        color = colors15__default.default.red;
      else if (percent < 50)
        color = colors15__default.default.yellow;
      const width = Math.floor(process.stdout.columns / 4);
      const scomp = Math.round(width * percent / 100);
      const progb = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb} ${color("| @percent:")} ${percent.toFixed(2)}% ${color("| @timemark:")} ${timemark} ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output ? path12__namespace.join(folder, filename) : filename.replace("_)_", ")_")
      };
    } else {
      await new Promise((resolve, reject2) => {
        ff.output(path12__namespace.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject2(new Error(colors15__default.default.red("@error: ") + error.message));
        });
        ff.run();
      });
    }
    console.log(
      colors15__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors15__default.default.green("yt-dlx."),
      "Consider",
      colors15__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors15__default.default.green("https://github.com/yt-dlx\n")
    );
  }
}

// core/index.ts
var ytdlx = {
  search: {
    browser: {
      SearchVideos: web_default.browser.SearchVideos,
      PlaylistInfo: web_default.browser.PlaylistInfo,
      VideoInfo: web_default.browser.VideoInfo
    },
    browserLess: {
      playlistVideos: web_default.browserLess.playlistVideos,
      relatedVideos: web_default.browserLess.relatedVideos,
      searchPlaylists: web_default.browserLess.searchPlaylists,
      searchVideos: web_default.browserLess.searchVideos,
      singleVideo: web_default.browserLess.singleVideo
    }
  },
  info: {
    help,
    extract,
    list_formats,
    extract_playlist_videos
  },
  AudioOnly: {
    Single: {
      Lowest: AudioLowest,
      Highest: AudioHighest
    },
    List: {
      Lowest: ListAudioLowest,
      Highest: ListAudioHighest
    }
  },
  VideoOnly: {
    Single: {
      Lowest: VideoLowest,
      Highest: VideoHighest
    },
    List: {
      Lowest: ListVideoLowest,
      Highest: ListVideoHighest
    }
  },
  AudioVideo: {
    Single: {
      Lowest: AudioVideoLowest,
      Highest: AudioVideoHighest
    },
    List: {}
  }
};
var core_default = ytdlx;
var proTube = minimist__default.default(process.argv.slice(2), {
  string: ["query", "format"],
  alias: {
    h: "help",
    e: "extract",
    v: "version",
    vl: "video-lowest",
    al: "audio-lowest",
    vh: "video_highest",
    ah: "audio-highest"
  }
});
var uLoc = "";
var maxTries = 6;
var currentDir = __dirname;
var program = async () => {
  const command = proTube._[0];
  switch (command) {
    case "install:deps":
      while (maxTries > 0) {
        const enginePath = path12__namespace.join(currentDir, "util");
        if (fs2__namespace.existsSync(enginePath)) {
          uLoc = enginePath;
          break;
        } else {
          currentDir = path12__namespace.join(currentDir, "..");
          maxTries--;
        }
      }
      const rox = child_process.spawn("sh", [
        "-c",
        `chmod +x ${uLoc}/deps.sh && ${uLoc}/deps.sh`
      ]);
      await Promise.all([
        new Promise((resolve, reject2) => {
          rox.stdout.on("data", (stdout) => {
            console.log(colors15__default.default.green("@stdout:"), stdout.toString().trim());
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
            console.log(colors15__default.default.yellow("@stderr:"), stderr.toString().trim());
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
        const enginePath = path12__namespace.join(currentDir, "util");
        if (fs2__namespace.existsSync(enginePath)) {
          uLoc = enginePath;
          break;
        } else {
          currentDir = path12__namespace.join(currentDir, "..");
          maxTries--;
        }
      }
      const xrox = child_process.spawn("sh", [
        "-c",
        `chmod +x ${uLoc}/socks5.sh && ${uLoc}/socks5.sh`
      ]);
      await Promise.all([
        new Promise((resolve, reject2) => {
          xrox.stdout.on("data", (stdout) => {
            console.log(colors15__default.default.green("@stdout:"), stdout.toString().trim());
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
            console.log(colors15__default.default.yellow("@stderr:"), stderr.toString().trim());
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
      console.error(colors15__default.default.green("Installed Version: yt-dlx@" + version));
      break;
    case "help":
    case "h":
      const hdata = await core_default.info.help;
      console.log(hdata);
      process.exit();
      break;
    case "extract":
    case "e":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors15__default.default.red("error: no query"));
      } else
        await core_default.info.extract({
          query: proTube.query
        }).then((data2) => {
          console.log(data2);
          process.exit();
        }).catch((error) => {
          console.error(colors15__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-highest":
    case "ah":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors15__default.default.red("error: no query"));
      } else
        await core_default.AudioOnly.Single.Highest({
          query: proTube.query
        }).then((data2) => {
          console.log(data2);
          process.exit();
        }).catch((error) => {
          console.error(colors15__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-lowest":
    case "al":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors15__default.default.red("error: no query"));
      } else
        await core_default.AudioOnly.Single.Lowest({
          query: proTube.query
        }).then((data2) => {
          console.log(data2);
          process.exit();
        }).catch((error) => {
          console.error(colors15__default.default.red(error));
          process.exit();
        });
      break;
    case "video_highest":
    case "vh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors15__default.default.red("error: no query"));
      } else
        await core_default.VideoOnly.Single.Highest({
          query: proTube.query
        }).then((data2) => {
          console.log(data2);
          process.exit();
        }).catch((error) => {
          console.error(colors15__default.default.red(error));
          process.exit();
        });
      break;
    case "video-lowest":
    case "vl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors15__default.default.red("error: no query"));
      } else
        await core_default.VideoOnly.Single.Lowest({
          query: proTube.query
        }).then((data2) => {
          console.log(data2);
          process.exit();
        }).catch((error) => {
          console.error(colors15__default.default.red(error));
          process.exit();
        });
      break;
    default:
      const data = core_default.info.help;
      console.log(data);
      process.exit();
      break;
  }
};
if (!proTube._[0]) {
  const data = core_default.info.help;
  console.log(data);
  process.exit();
} else
  program();
