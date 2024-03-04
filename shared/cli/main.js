#!/usr/bin/env node
'use strict';

var fs = require('fs');
var colors28 = require('colors');
var cheerio = require('cheerio');
var retry = require('async-retry');
var puppeteer = require('puppeteer');
var spinClient = require('spinnies');
var z4 = require('zod');
var crypto = require('crypto');
var path2 = require('path');
var util = require('util');
var child_process = require('child_process');
var readline = require('readline');
var fluent = require('fluent-ffmpeg');
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

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var colors28__default = /*#__PURE__*/_interopDefault(colors28);
var retry__default = /*#__PURE__*/_interopDefault(retry);
var puppeteer__default = /*#__PURE__*/_interopDefault(puppeteer);
var spinClient__default = /*#__PURE__*/_interopDefault(spinClient);
var z4__namespace = /*#__PURE__*/_interopNamespace(z4);
var path2__namespace = /*#__PURE__*/_interopNamespace(path2);
var readline__default = /*#__PURE__*/_interopDefault(readline);
var fluent__default = /*#__PURE__*/_interopDefault(fluent);
var minimist__default = /*#__PURE__*/_interopDefault(minimist);

async function closers(browser2) {
  try {
    const pages = await browser2.pages();
    await Promise.all(pages.map((page2) => page2.close()));
    await browser2.close();
  } catch (error) {
    console.error(error);
  }
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
async function crawler(verbose) {
  try {
    browser = await puppeteer__default.default.launch({
      headless: verbose ? false : true,
      // userDataDir: "others",
      args: [
        "--no-zygote",
        "--incognito",
        "--no-sandbox",
        "--enable-automation",
        "--disable-dev-shm-usage"
      ]
    });
    page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
    );
  } catch (error) {
    if (page)
      await page.close();
    if (browser)
      await browser.close();
    switch (true) {
      case error instanceof Error:
        throw new Error(error.message);
      default:
        throw new Error("internal server error");
    }
  }
}

// core/web/api/SearchVideos.ts
async function SearchVideos(input) {
  try {
    const QuerySchema = z4.z.object({
      query: z4.z.string().min(1).refine(
        async (query2) => {
          const result = await YouTubeID(query2);
          return result === void 0;
        },
        {
          message: "Query must not be a YouTube video/Playlist link"
        }
      ),
      verbose: z4.z.boolean().optional(),
      screenshot: z4.z.boolean().optional()
    });
    const { query, screenshot, verbose } = await QuerySchema.parseAsync(input);
    await crawler(verbose);
    const retryOptions = {
      maxTimeout: 6e3,
      minTimeout: 1e3,
      retries: 4
    };
    let url;
    let $;
    const spin = crypto.randomUUID();
    let content;
    let metaTube = [];
    const spinnies = new spinClient__default.default();
    let videoElements;
    let playlistMeta = [];
    let TubeResp;
    let snapshot;
    spinnies.add(spin, {
      text: colors28__default.default.green("@scrape: ") + "booting chromium..."
    });
    switch (input.type) {
      case "video":
        TubeResp = await retry__default.default(async () => {
          url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query) + "&sp=EgIQAQ%253D%253D";
          await page.goto(url);
          for (let i = 0; i < 40; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          }
          spinnies.update(spin, {
            text: colors28__default.default.yellow("@scrape: ") + "waiting for hydration..."
          });
          if (screenshot) {
            snapshot = await page.screenshot({
              path: "TypeVideo.png"
            });
            fs__namespace.default.writeFileSync("TypeVideo.png", snapshot);
            spinnies.update(spin, {
              text: colors28__default.default.yellow("@scrape: ") + "took snapshot..."
            });
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
              views: $(vide).find(
                ".inline-metadata-item.style-scope.ytd-video-meta-block"
              ).filter(
                (_2, vide2) => $(vide2).text().includes("views")
              ).text().trim().replace(/ views/g, "") || void 0,
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
            text: colors28__default.default.green("@info: ") + colors28__default.default.white("scrapping done for ") + query
          });
          return metaTube;
        }, retryOptions);
        await closers(browser);
        return TubeResp;
      case "playlist":
        TubeResp = await retry__default.default(async () => {
          url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query) + "&sp=EgIQAw%253D%253D";
          await page.goto(url);
          for (let i = 0; i < 80; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          }
          spinnies.update(spin, {
            text: colors28__default.default.yellow("@scrape: ") + "waiting for hydration..."
          });
          if (screenshot) {
            snapshot = await page.screenshot({
              path: "TypePlaylist.png"
            });
            fs__namespace.default.writeFileSync("TypePlaylist.png", snapshot);
            spinnies.update(spin, {
              text: colors28__default.default.yellow("@scrape: ") + "took snapshot..."
            });
          }
          const content2 = await page.content();
          const $2 = cheerio.load(content2);
          const playlistElements = $2("ytd-playlist-renderer");
          playlistElements.each((_index, element) => {
            const playlistLink = $2(element).find(".style-scope.ytd-playlist-renderer #view-more a").attr("href");
            const vCount = $2(element).text().trim();
            playlistMeta.push({
              title: $2(element).find(".style-scope.ytd-playlist-renderer #video-title").text().replace(/\s+/g, " ").trim() || void 0,
              author: $2(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").text().replace(/\s+/g, " ").trim() || void 0,
              playlistId: playlistLink.split("list=")[1],
              playlistLink: "https://www.youtube.com" + playlistLink,
              authorUrl: $2(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").attr("href") ? "https://www.youtube.com" + $2(element).find(".yt-simple-endpoint.style-scope.yt-formatted-string").attr("href") : void 0,
              videoCount: parseInt(vCount.replace(/ videos\nNOW PLAYING/g, "")) || void 0
            });
          });
          spinnies.succeed(spin, {
            text: colors28__default.default.green("@info: ") + colors28__default.default.white("scrapping done for ") + query
          });
          return playlistMeta;
        }, retryOptions);
        await closers(browser);
        return TubeResp;
      default:
        spinnies.fail(spin, {
          text: colors28__default.default.red("@error: ") + colors28__default.default.white("wrong filter type provided.")
        });
        await closers(browser);
        return void 0;
    }
  } catch (error) {
    await closers(browser);
    switch (true) {
      case error instanceof z4.ZodError:
        throw new Error(
          colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
        );
      case error instanceof Error:
        throw new Error(colors28__default.default.red("@error: ") + error.message);
      default:
        throw new Error(colors28__default.default.red("@error: ") + "internal server error");
    }
  }
}
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));
async function PlaylistInfo(input) {
  try {
    let query;
    const spinnies = new spinClient__default.default();
    const QuerySchema = z4.z.object({
      query: z4.z.string().min(1).refine(
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
      verbose: z4.z.boolean().optional(),
      screenshot: z4.z.boolean().optional()
    });
    const { screenshot, verbose } = await QuerySchema.parseAsync(input);
    await crawler(verbose);
    const retryOptions = {
      maxTimeout: 6e3,
      minTimeout: 1e3,
      retries: 4
    };
    let metaTube = [];
    const spin = crypto.randomUUID();
    let TubeResp;
    let snapshot;
    TubeResp = await retry__default.default(async () => {
      spinnies.add(spin, {
        text: colors28__default.default.green("@scrape: ") + "booting chromium..."
      });
      await page.goto(query);
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      spinnies.update(spin, {
        text: colors28__default.default.yellow("@scrape: ") + "waiting for hydration..."
      });
      if (screenshot) {
        snapshot = await page.screenshot({
          path: "FilterVideo.png"
        });
        fs__namespace.default.writeFileSync("FilterVideo.png", snapshot);
        spinnies.update(spin, {
          text: colors28__default.default.yellow("@scrape: ") + "took snapshot..."
        });
      }
      const content = await page.content();
      const $ = cheerio.load(content);
      const playlistTitle = $(
        "yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string"
      ).text().trim();
      const viewsText = $("yt-formatted-string.byline-item").eq(1).text();
      const playlistViews = parseInt(
        viewsText.replace(/,/g, "").match(/\d+/)[0]
      );
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
        text: colors28__default.default.green("@info: ") + colors28__default.default.white("scrapping done for ") + query
      });
      return {
        playlistVideos: metaTube,
        playlistDescription: playlistDescription.trim(),
        playlistVideoCount: metaTube.length,
        playlistViews,
        playlistTitle
      };
    }, retryOptions);
    await closers(browser);
    return TubeResp;
  } catch (error) {
    await closers(browser);
    switch (true) {
      case error instanceof z4.ZodError:
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
async function VideoInfo(input) {
  try {
    let query;
    const spinnies = new spinClient__default.default();
    const QuerySchema = z4.z.object({
      query: z4.z.string().min(1).refine(
        async (input2) => {
          switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
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
                `https://www.youtube.com/watch?v=${input2}`
              );
              if (resultId !== void 0) {
                query = `https://www.youtube.com/watch?v=${input2}`;
                return true;
              }
              break;
          }
          return false;
        },
        {
          message: "Query must be a valid YouTube video Link or ID."
        }
      ),
      verbose: z4.z.boolean().optional(),
      screenshot: z4.z.boolean().optional()
    });
    const { screenshot, verbose } = await QuerySchema.parseAsync(input);
    await crawler(verbose);
    const retryOptions = {
      maxTimeout: 6e3,
      minTimeout: 1e3,
      retries: 4
    };
    let TubeResp;
    const spin = crypto.randomUUID();
    let snapshot;
    TubeResp = await retry__default.default(async () => {
      spinnies.add(spin, {
        text: colors28__default.default.green("@scrape: ") + "booting chromium..."
      });
      await page.goto(query);
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      spinnies.update(spin, {
        text: colors28__default.default.yellow("@scrape: ") + "waiting for hydration..."
      });
      if (screenshot) {
        snapshot = await page.screenshot({
          path: "FilterVideo.png"
        });
        fs__namespace.default.writeFileSync("FilterVideo.png", snapshot);
        spinnies.update(spin, {
          text: colors28__default.default.yellow("@scrape: ") + "took snapshot..."
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
      const metaTube = {
        views,
        author,
        videoId,
        uploadOn,
        thumbnailUrls,
        title: title.trim(),
        videoLink: "https://www.youtube.com/watch?v=" + videoId
      };
      spinnies.succeed(spin, {
        text: colors28__default.default.green("@info: ") + colors28__default.default.white("scrapping done for ") + query
      });
      return metaTube;
    }, retryOptions);
    await closers(browser);
    return TubeResp;
  } catch (error) {
    await closers(browser);
    switch (true) {
      case error instanceof z4.ZodError:
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
  return Promise.resolve(
    colors28__default.default.bold.white(`
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
  torproxy
}) {
  try {
    let pushTube = [];
    let proLoc = "";
    let maxTries = 6;
    let currentDir = __dirname;
    while (maxTries > 0) {
      const enginePath = path2__namespace.join(currentDir, "util", "engine");
      if (fs__namespace.existsSync(enginePath)) {
        proLoc = enginePath;
        break;
      } else {
        currentDir = path2__namespace.join(currentDir, "..");
        maxTries--;
      }
    }
    if (proLoc !== "") {
      if (torproxy)
        proLoc += ` --proxy ${torproxy}`;
      proLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
      proLoc += ` --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'`;
      proLoc += ` --dump-single-json '${query}'`;
    } else
      throw new Error("could not find the engine file.");
    const result = await util.promisify(child_process.exec)(proLoc);
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
      metaTube: pushTube.filter((item) => item.Tube === "metaTube").map((item) => item.reTube)[0] || void 0
    };
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error.message);
    else
      throw new Error("internal server error");
  }
}

// package.json
var version = "5.1.0";

// core/base/Agent.ts
async function Agent({
  query,
  verbose,
  torproxy
}) {
  try {
    let respEngine = void 0;
    let videoId = await YouTubeID(query);
    let TubeBody;
    console.log(
      colors28__default.default.green("@info:"),
      "using",
      colors28__default.default.green("yt-dlx"),
      "version",
      colors28__default.default.green(version)
    );
    if (!videoId) {
      TubeBody = await web_default.search.SearchVideos({
        type: "video",
        verbose,
        query
      });
      if (!TubeBody[0]) {
        throw new Error("Unable to get response from YouTube...");
      } else {
        console.log(
          colors28__default.default.green("@info:"),
          `preparing payload for`,
          colors28__default.default.green(TubeBody[0].title)
        );
        respEngine = await Engine({ query: TubeBody[0].videoLink, torproxy });
      }
    } else {
      TubeBody = await web_default.search.VideoInfo({
        verbose,
        query
      });
      if (!TubeBody) {
        throw new Error("Unable to get response from YouTube...");
      } else {
        console.log(
          colors28__default.default.green("@info:"),
          `preparing payload for`,
          colors28__default.default.green(TubeBody.title)
        );
        respEngine = await Engine({ query: TubeBody.videoLink, torproxy });
      }
    }
    if (respEngine === void 0) {
      throw new Error("Unable to get response from YouTube...");
    } else
      return respEngine;
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error.message);
    else
      throw new Error("internal server error");
  }
}

// core/pipes/command/extract.ts
async function extract({
  query,
  verbose
}) {
  try {
    let calculateUploadAgo2 = function(days) {
      const years = Math.floor(days / 365);
      const months = Math.floor(days % 365 / 30);
      const remainingDays = days % 30;
      const formattedString = `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${remainingDays} days`;
      return { years, months, days: remainingDays, formatted: formattedString };
    }, calculateVideoDuration2 = function(seconds) {
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
    }, formatCount2 = function(count) {
      const abbreviations = ["K", "M", "B", "T"];
      for (let i = abbreviations.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3);
        if (size <= count) {
          const formattedCount = Math.round(count / size * 10) / 10;
          return `${formattedCount}${abbreviations[i]}`;
        }
      }
      return `${count}`;
    };
    var calculateUploadAgo = calculateUploadAgo2, calculateVideoDuration = calculateVideoDuration2, formatCount = formatCount2;
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
    const uploadAgoObject = calculateUploadAgo2(daysAgo);
    const videoTimeInSeconds = metaBody.metaTube.duration;
    const videoDuration = calculateVideoDuration2(videoTimeInSeconds);
    const viewCountFormatted = formatCount2(metaBody.metaTube.view_count);
    const likeCountFormatted = formatCount2(metaBody.metaTube.like_count);
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
        comment_count_formatted: formatCount2(metaBody.metaTube.comment_count),
        channel_id: metaBody.metaTube.channel_id,
        channel_name: metaBody.metaTube.channel,
        channel_url: metaBody.metaTube.channel_url,
        channel_follower_count: metaBody.metaTube.channel_follower_count,
        channel_follower_count_formatted: formatCount2(
          metaBody.metaTube.channel_follower_count
        )
      }
    };
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
    );
    return payload;
  } catch (error) {
    return {
      message: error.message || "An unexpected error occurred",
      status: 500
    };
  }
}
function list_formats({
  query,
  verbose
}) {
  return new Promise(async (resolve, reject2) => {
    try {
      const zval = z4__namespace.object({
        query: z4__namespace.string().min(1)
      }).parse({ query, verbose });
      const EnResp = await Agent(zval);
      if (!EnResp)
        return reject2("Unable to get response from YouTube...");
      const metaTube = (data) => data.filter(
        (out) => !out.AVDownload.originalformat.includes("Premium")
      );
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
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
      );
    } catch (error) {
      reject2(error instanceof z4__namespace.ZodError ? error.errors : error);
    }
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
async function extract_playlist_videos({
  playlistUrls
}) {
  try {
    let counter = 0;
    const metaTubeArr = [];
    await eachSeries$1(playlistUrls, async (listLink) => {
      const query = await YouTubeID(listLink);
      if (query === void 0) {
        console.error(
          colors28__default.default.bold.red("@error: "),
          "invalid youtube playlist url:",
          listLink
        );
        return;
      } else {
        const resp = await web_default.search.PlaylistInfo({
          query
        });
        if (resp === void 0) {
          console.error(
            colors28__default.default.bold.red("@error: "),
            "unable to get response from youtube for",
            query
          );
          return;
        } else {
          console.log(
            colors28__default.default.green("@info:"),
            "total videos in playlist",
            colors28__default.default.green(resp.playlistTitle),
            resp.playlistVideoCount
          );
          await eachSeries$1(resp.playlistVideos, async (vid) => {
            const metaTube = await Agent({
              query: vid.videoLink
            });
            counter++;
            console.log(
              colors28__default.default.green("@info:"),
              "added",
              counter + "/" + resp.playlistVideoCount
            );
            metaTubeArr.push(metaTube);
          });
        }
      }
    });
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
    );
    return metaTubeArr;
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var progressBar = (prog, size) => {
  if (prog.timemark === void 0 || prog.percent === void 0)
    return;
  if (prog.percent < 1 && prog.timemark.includes("-"))
    return;
  readline__default.default.cursorTo(process.stdout, 0);
  let color = colors28__default.default.green;
  if (prog.percent > 98)
    prog.percent = 100;
  if (prog.percent < 25)
    color = colors28__default.default.red;
  else if (prog.percent < 50)
    color = colors28__default.default.yellow;
  const width = Math.floor(process.stdout.columns / 4);
  const scomp = Math.round(width * prog.percent / 100);
  const sprog = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
  let output = color("@prog: ") + sprog + prog.percent.toFixed(2) + "% | " + color("@timemark: ") + prog.timemark;
  if (prog.frames !== 0 && !isNaN(prog.frames)) {
    output += " | " + color("@frames: ") + prog.frames;
  }
  if (prog.currentFps !== 0 && !isNaN(prog.currentFps)) {
    output += " | " + color("@fps: ") + prog.currentFps;
  }
  output += " | " + color("@size: ") + size;
  process.stdout.write(output);
  if (prog.timemark.includes("-"))
    process.stdout.write("\n\n");
};
function gpuffmpeg({
  size,
  input,
  verbose
}) {
  let maxTries = 6;
  let currentDir = __dirname;
  let FfprobePath, FfmpegPath;
  const getTerm = (command) => {
    try {
      return child_process.execSync(command).toString().trim();
    } catch {
      return void 0;
    }
  };
  const ffmpeg = fluent__default.default(input).on("start", (command) => {
    if (verbose)
      console.log(colors28__default.default.green("@ffmpeg:"), command);
  }).on("progress", (prog) => progressBar(prog, size)).on("end", () => console.log("\n")).on("error", (e) => console.error(colors28__default.default.red("\n@ffmpeg:"), e.message));
  while (maxTries > 0) {
    FfprobePath = path2__namespace.join(currentDir, "util", "ffmpeg", "bin", "ffprobe");
    FfmpegPath = path2__namespace.join(currentDir, "util", "ffmpeg", "bin", "ffmpeg");
    if (fs__namespace.existsSync(FfprobePath) && fs__namespace.existsSync(FfmpegPath)) {
      ffmpeg.setFfprobePath(FfprobePath);
      ffmpeg.setFfmpegPath(FfmpegPath);
      break;
    } else {
      currentDir = path2__namespace.join(currentDir, "..");
      maxTries--;
    }
  }
  const vendor = getTerm("nvidia-smi --query-gpu=name --format=csv,noheader");
  switch (true) {
    case (vendor && vendor.includes("NVIDIA")):
      console.log(colors28__default.default.green("@ffmpeg:"), "using GPU", colors28__default.default.green(vendor));
      ffmpeg.withInputOption("-hwaccel cuda");
      ffmpeg.withVideoCodec("h264_nvenc");
      break;
    default:
      console.log(
        colors28__default.default.yellow("@ffmpeg:"),
        "GPU vendor not recognized.",
        "defaulting to software processing."
      );
  }
  return ffmpeg;
}
var ffmpeg_default = gpuffmpeg;

// core/base/lowEntry.ts
async function lowEntry(metaBody) {
  const validEntries = metaBody.filter(
    (entry) => entry.AVInfo.filesizebytes !== null && entry.AVInfo.filesizebytes !== void 0 && !isNaN(entry.AVInfo.filesizebytes)
  );
  const sortedByFileSize = [...validEntries].sort(
    (a, b) => a.AVInfo.filesizebytes - b.AVInfo.filesizebytes
  );
  if (!sortedByFileSize[0]) {
    throw new Error("sorry no downloadable data found");
  } else
    return sortedByFileSize[0];
}

// core/pipes/audio/AudioLowest.ts
var qconf = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, output, stream, verbose, filter: filter2, torproxy } = await qconf.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(engineData.AudioStore);
      let filename = "yt-dlx_(AudioLowest_";
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("avi");
      if (filter2 === "bassboost") {
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
      } else if (filter2 === "echo") {
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
      } else if (filter2 === "flanger") {
        ffmpeg.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
      } else if (filter2 === "nightcore") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
      } else if (filter2 === "panning") {
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
      } else if (filter2 === "phaser") {
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
      } else if (filter2 === "reverse") {
        ffmpeg.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
      } else if (filter2 === "slow") {
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
      } else if (filter2 === "speed") {
        ffmpeg.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
      } else if (filter2 === "subboost") {
        ffmpeg.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
      } else if (filter2 === "superslow") {
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
      } else if (filter2 === "superspeed") {
        ffmpeg.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
      } else if (filter2 === "surround") {
        ffmpeg.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
      } else if (filter2 === "vaporwave") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
      } else if (filter2 === "vibrato") {
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
      } else
        filename += `)_${title}.avi`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
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
  if (!sortedByFileSize[0]) {
    throw new Error("sorry no downloadable data found");
  } else
    return sortedByFileSize[0];
}

// core/pipes/audio/AudioHighest.ts
var qconf2 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, output, stream, verbose, filter: filter2, torproxy } = await qconf2.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(engineData.AudioStore);
      let filename = "yt-dlx_(AudioHighest_";
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("avi");
      if (filter2 === "bassboost") {
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
      } else if (filter2 === "echo") {
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
      } else if (filter2 === "flanger") {
        ffmpeg.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
      } else if (filter2 === "nightcore") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
      } else if (filter2 === "panning") {
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
      } else if (filter2 === "phaser") {
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
      } else if (filter2 === "reverse") {
        ffmpeg.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
      } else if (filter2 === "slow") {
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
      } else if (filter2 === "speed") {
        ffmpeg.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
      } else if (filter2 === "subboost") {
        ffmpeg.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
      } else if (filter2 === "superslow") {
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
      } else if (filter2 === "superspeed") {
        ffmpeg.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
      } else if (filter2 === "surround") {
        ffmpeg.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
      } else if (filter2 === "vaporwave") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
      } else if (filter2 === "vibrato") {
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
      } else
        filename += `)_${title}.avi`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf3 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  quality: z4.z.enum(["high", "medium", "low", "ultralow"]),
  filter: z4.z.enum([
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
  try {
    const { query, stream, verbose, output, quality, filter: filter2, torproxy } = await qconf3.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const customData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      if (!customData) {
        throw new Error(
          colors28__default.default.red("@error: ") + quality + " not found in the video."
        );
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(customData);
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("avi");
      let filename = `yt-dlx_(AudioQualityCustom_${quality}`;
      if (filter2 === "bassboost") {
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
      } else if (filter2 === "echo") {
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
      } else if (filter2 === "flanger") {
        ffmpeg.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
      } else if (filter2 === "nightcore") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
      } else if (filter2 === "panning") {
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
      } else if (filter2 === "phaser") {
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
      } else if (filter2 === "reverse") {
        ffmpeg.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
      } else if (filter2 === "slow") {
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
      } else if (filter2 === "speed") {
        ffmpeg.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
      } else if (filter2 === "subboost") {
        ffmpeg.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
      } else if (filter2 === "superslow") {
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
      } else if (filter2 === "superspeed") {
        ffmpeg.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
      } else if (filter2 === "surround") {
        ffmpeg.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
      } else if (filter2 === "vaporwave") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
      } else if (filter2 === "vibrato") {
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
      } else
        filename += `)_${title}.avi`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf4 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, output, verbose, filter: filter2, torproxy } = await qconf4.parseAsync(
      input
    );
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(engineData.AudioStore);
      let filename = "yt-dlx_(AudioLowest_";
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("avi");
      if (filter2 === "bassboost") {
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
      } else if (filter2 === "echo") {
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
      } else if (filter2 === "flanger") {
        ffmpeg.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
      } else if (filter2 === "nightcore") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
      } else if (filter2 === "panning") {
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
      } else if (filter2 === "phaser") {
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
      } else if (filter2 === "reverse") {
        ffmpeg.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
      } else if (filter2 === "slow") {
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
      } else if (filter2 === "speed") {
        ffmpeg.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
      } else if (filter2 === "subboost") {
        ffmpeg.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
      } else if (filter2 === "superslow") {
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
      } else if (filter2 === "superspeed") {
        ffmpeg.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
      } else if (filter2 === "surround") {
        ffmpeg.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
      } else if (filter2 === "vaporwave") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
      } else if (filter2 === "vibrato") {
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
      } else
        filename += `)_${title}.avi`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf5 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, output, verbose, filter: filter2, torproxy } = await qconf5.parseAsync(
      input
    );
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(engineData.AudioStore);
      let filename = "yt-dlx_(AudioHighest_";
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("avi");
      if (filter2 === "bassboost") {
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
      } else if (filter2 === "echo") {
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
      } else if (filter2 === "flanger") {
        ffmpeg.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
      } else if (filter2 === "nightcore") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
      } else if (filter2 === "panning") {
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
      } else if (filter2 === "phaser") {
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
      } else if (filter2 === "reverse") {
        ffmpeg.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
      } else if (filter2 === "slow") {
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
      } else if (filter2 === "speed") {
        ffmpeg.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
      } else if (filter2 === "subboost") {
        ffmpeg.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
      } else if (filter2 === "superslow") {
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
      } else if (filter2 === "superspeed") {
        ffmpeg.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
      } else if (filter2 === "surround") {
        ffmpeg.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
      } else if (filter2 === "vaporwave") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
      } else if (filter2 === "vibrato") {
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
      } else
        filename += `)_${title}.avi`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf6 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  quality: z4.z.enum(["high", "medium", "low", "ultralow"]),
  filter: z4.z.enum([
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
  try {
    const { query, output, verbose, quality, filter: filter2, torproxy } = await qconf6.parseAsync(input);
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const customData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      if (!customData) {
        console.log(
          colors28__default.default.red("@error: ") + quality + " not found in the video."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(customData);
      let filename = `yt-dlx_(AudioQualityCustom_${quality}`;
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("avi");
      if (filter2 === "bassboost") {
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
      } else if (filter2 === "echo") {
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
      } else if (filter2 === "flanger") {
        ffmpeg.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
      } else if (filter2 === "nightcore") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
      } else if (filter2 === "panning") {
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
      } else if (filter2 === "phaser") {
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
      } else if (filter2 === "reverse") {
        ffmpeg.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
      } else if (filter2 === "slow") {
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
      } else if (filter2 === "speed") {
        ffmpeg.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
      } else if (filter2 === "subboost") {
        ffmpeg.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
      } else if (filter2 === "superslow") {
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
      } else if (filter2 === "superspeed") {
        ffmpeg.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
      } else if (filter2 === "surround") {
        ffmpeg.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
      } else if (filter2 === "vaporwave") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
      } else if (filter2 === "vibrato") {
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
      } else
        filename += `)_${title}.avi`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf7 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, stream, verbose, output, filter: filter2, torproxy } = await qconf7.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(engineData.VideoStore);
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      let filename = "yt-dlx_(VideoLowest_";
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf8 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, stream, verbose, output, filter: filter2, torproxy } = await qconf8.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(engineData.VideoStore);
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      let filename = "yt-dlx_(VideoHighest_";
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf9 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  quality: z4.z.enum([
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
  filter: z4.z.enum([
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
  try {
    const { query, stream, verbose, output, quality, filter: filter2, torproxy } = await qconf9.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const customData = engineData.VideoStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      if (!customData) {
        throw new Error(
          colors28__default.default.red("@error: ") + quality + " not found in the video."
        );
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(customData);
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      let filename = `yt-dlx_(VideoQualityCustom_${quality}`;
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf10 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, output, verbose, filter: filter2, torproxy } = await qconf10.parseAsync(
      input
    );
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(engineData.VideoStore);
      let filename = "yt-dlx_(VideoLowest_";
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf11 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, verbose, output, filter: filter2, torproxy } = await qconf11.parseAsync(
      input
    );
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(engineData.VideoStore);
      let filename = "yt-dlx_(VideoHighest_";
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf12 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  quality: z4.z.enum([
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
  filter: z4.z.enum([
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
  try {
    const { query, verbose, output, quality, filter: filter2, torproxy } = await qconf12.parseAsync(input);
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const customData = engineData.VideoStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      if (!customData) {
        console.log(
          colors28__default.default.red("@error: ") + quality + " not found in the video."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(customData);
      let filename = `yt-dlx_(VideoQualityCustom_${quality}`;
      const ffmpeg = ffmpeg_default({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf13 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, stream, verbose, output, filter: filter2, torproxy } = await qconf13.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const [AudioData, VideoData] = await Promise.all([
        await lowEntry(engineData.AudioStore),
        await lowEntry(engineData.VideoStore)
      ]);
      const ffmpeg = ffmpeg_default({
        size: sizeFormat(
          AudioData.AVInfo.filesizebytes + VideoData.AVInfo.filesizebytes
        ).toString(),
        input: VideoData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      let filename = "yt-dlx_(AudioVideoLowest_";
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf14 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, stream, verbose, output, filter: filter2, torproxy } = await qconf14.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const [AudioData, VideoData] = await Promise.all([
        await bigEntry(engineData.AudioStore),
        await bigEntry(engineData.VideoStore)
      ]);
      const ffmpeg = ffmpeg_default({
        size: sizeFormat(
          AudioData.AVInfo.filesizebytes + VideoData.AVInfo.filesizebytes
        ).toString(),
        input: VideoData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      let filename = "yt-dlx_(AudioVideoHighest_";
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf15 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  AQuality: z4.z.enum(["high", "medium", "low", "ultralow"]),
  VQuality: z4.z.enum([
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
  filter: z4.z.enum([
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
  try {
    const {
      query,
      stream,
      verbose,
      output,
      VQuality,
      AQuality,
      filter: filter2,
      torproxy
    } = await qconf15.parseAsync(input);
    const engineData = await Agent({ query, verbose, torproxy });
    if (engineData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const ACustomData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === AQuality
      );
      const VCustomData = engineData.VideoStore.filter(
        (op) => op.AVDownload.formatnote === VQuality
      );
      const [AudioData, VideoData] = await Promise.all([
        await bigEntry(ACustomData),
        await bigEntry(VCustomData)
      ]);
      const ffmpeg = ffmpeg_default({
        size: sizeFormat(
          AudioData.AVInfo.filesizebytes + VideoData.AVInfo.filesizebytes
        ).toString(),
        input: VideoData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      let filename = `yt-dlx_(AudioVideoQualityCustom_${VQuality}_${AQuality}`;
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      if (stream) {
        return {
          ffmpeg,
          filename: output ? path2__namespace.join(folder, filename) : filename.replace("_)_", ")_")
        };
      } else {
        await new Promise((resolve, _reject) => {
          ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors28__default.default.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors28__default.default.green("@info:"),
        "\u2763\uFE0F Thank you for using",
        colors28__default.default.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors28__default.default.green("\u{1F31F}starring"),
        "the github repo",
        colors28__default.default.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf16 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, verbose, output, filter: filter2, torproxy } = await qconf16.parseAsync(
      input
    );
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const [AudioData, VideoData] = await Promise.all([
        await bigEntry(engineData.AudioStore),
        await bigEntry(engineData.VideoStore)
      ]);
      let filename = "yt-dlx_(AudioVideoHighest_";
      const ffmpeg = ffmpeg_default({
        size: sizeFormat(
          AudioData.AVInfo.filesizebytes + VideoData.AVInfo.filesizebytes
        ).toString(),
        input: VideoData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf17 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  filter: z4.z.enum([
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
  try {
    const { query, verbose, output, filter: filter2, torproxy } = await qconf17.parseAsync(
      input
    );
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const [AudioData, VideoData] = await Promise.all([
        await lowEntry(engineData.AudioStore),
        await lowEntry(engineData.VideoStore)
      ]);
      let filename = "yt-dlx_(AudioVideoLowest_";
      const ffmpeg = ffmpeg_default({
        size: sizeFormat(
          AudioData.AVInfo.filesizebytes + VideoData.AVInfo.filesizebytes
        ).toString(),
        input: VideoData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}
var qconf18 = z4.z.object({
  query: z4.z.string().min(1),
  output: z4.z.string().optional(),
  verbose: z4.z.boolean().optional(),
  torproxy: z4.z.string().min(1).optional(),
  AQuality: z4.z.enum(["high", "medium", "low", "ultralow"]),
  VQuality: z4.z.enum([
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
  filter: z4.z.enum([
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
  try {
    const { query, verbose, output, VQuality, AQuality, filter: filter2, torproxy } = await qconf18.parseAsync(input);
    const playlistData = await web_default.search.PlaylistInfo({ query });
    if (playlistData === void 0) {
      throw new Error(
        colors28__default.default.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await Agent({
        query: video.videoLink,
        torproxy,
        verbose
      });
      if (engineData === void 0) {
        console.log(
          colors28__default.default.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path2__namespace.join(process.cwd(), output) : process.cwd();
      if (!fs__namespace.existsSync(folder))
        fs__namespace.mkdirSync(folder, { recursive: true });
      const ACustomData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === AQuality
      );
      const VCustomData = engineData.VideoStore.filter(
        (op) => op.AVDownload.formatnote === VQuality
      );
      const [AudioData, VideoData] = await Promise.all([
        await bigEntry(ACustomData),
        await bigEntry(VCustomData)
      ]);
      let filename = "yt-dlx_(AudioVideoQualityCustom_";
      const ffmpeg = ffmpeg_default({
        size: sizeFormat(
          AudioData.AVInfo.filesizebytes + VideoData.AVInfo.filesizebytes
        ).toString(),
        input: VideoData.AVDownload.mediaurl,
        verbose
      });
      ffmpeg.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      if (filter2 === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter2 === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter2 === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter2 === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter2 === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter2 === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter2 === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else
        filename += `)_${title}.mkv`;
      await new Promise((resolve, _reject) => {
        ffmpeg.output(path2__namespace.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", (error) => {
          throw new Error(colors28__default.default.red("@error: ") + error.message);
        });
        ffmpeg.run();
      });
    }
    console.log(
      colors28__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using",
      colors28__default.default.green("yt-dlx."),
      "If you enjoy the project, consider",
      colors28__default.default.green("\u{1F31F}starring"),
      "the github repo",
      colors28__default.default.green("https://github.com/yt-dlx")
    );
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors28__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors28__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors28__default.default.red("@error: ") + "internal server error");
  }
}

// core/index.ts
var ytdlx = {
  search: {
    PlaylistInfo: web_default.search.PlaylistInfo,
    SearchVideos: web_default.search.SearchVideos,
    VideoInfo: web_default.search.VideoInfo
  },
  info: {
    help,
    extract,
    list_formats,
    extract_playlist_videos
  },
  audio: {
    single: {
      lowest: AudioLowest,
      highest: AudioHighest,
      custom: AudioQualityCustom
    },
    playlist: {
      lowest: ListAudioLowest,
      highest: ListAudioHighest,
      custom: ListAudioQualityCustom
    }
  },
  video: {
    single: {
      lowest: VideoLowest,
      highest: VideoHighest,
      custom: VideoQualityCustom
    },
    playlist: {
      lowest: ListVideoLowest,
      highest: ListVideoHighest,
      custom: ListVideoQualityCustom
    }
  },
  audio_video: {
    single: {
      lowest: AudioVideoLowest,
      highest: AudioVideoHighest,
      custom: AudioVideoQualityCustom
    },
    playlist: {
      lowest: ListAudioVideoHighest,
      highest: ListAudioVideoLowest,
      custom: ListAudioVideoQualityCustom
    }
  }
};
var core_default = ytdlx;
var proTube = minimist__default.default(process.argv.slice(2), {
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
var program = async () => {
  const command = proTube._[0];
  switch (command) {
    case "version":
    case "v":
      console.error(colors28__default.default.green("Installed Version: yt-dlx@" + version));
      break;
    case "help":
    case "h":
      core_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28__default.default.red(error));
        process.exit();
      });
      break;
    case "extract":
    case "e":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.info.extract({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "list-formats":
    case "f":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.info.list_formats({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-highest":
    case "ah":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.audio.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-lowest":
    case "al":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.audio.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "video_highest":
    case "vh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.video.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "video-lowest":
    case "vl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.video.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-highest":
    case "avh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.audio_video.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-lowest":
    case "avl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      } else
        core_default.audio_video.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors28__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-quality-custom":
    case "aqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors28__default.default.red("error: no format"));
      }
      core_default.audio.single.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28__default.default.red(error));
        process.exit();
      });
      break;
    case "video-quality-custom":
    case "vqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors28__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors28__default.default.red("error: no format"));
      }
      core_default.video.single.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28__default.default.red(error));
        process.exit();
      });
      break;
    default:
      core_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors28__default.default.red(error));
        process.exit();
      });
      break;
  }
};
if (!proTube._[0]) {
  core_default.info.help().then((data) => {
    console.log(data);
    process.exit();
  }).catch((error) => {
    console.error(colors28__default.default.red(error));
    process.exit();
  });
} else
  program();
