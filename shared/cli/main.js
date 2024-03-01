#!/usr/bin/env node
'use strict';

var fs = require('fs');
var colors20 = require('colors');
var cheerio = require('cheerio');
var retry = require('async-retry');
var spinClient = require('spinnies');
var z4 = require('zod');
var crypto = require('crypto');
var puppeteer = require('puppeteer');
var path2 = require('path');
var util = require('util');
var child_process = require('child_process');
var fluentffmpeg = require('fluent-ffmpeg');
var stream = require('stream');
var readline = require('readline');
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
var colors20__default = /*#__PURE__*/_interopDefault(colors20);
var retry__default = /*#__PURE__*/_interopDefault(retry);
var spinClient__default = /*#__PURE__*/_interopDefault(spinClient);
var z4__namespace = /*#__PURE__*/_interopNamespace(z4);
var puppeteer__default = /*#__PURE__*/_interopDefault(puppeteer);
var path2__namespace = /*#__PURE__*/_interopNamespace(path2);
var fluentffmpeg__default = /*#__PURE__*/_interopDefault(fluentffmpeg);
var readline__default = /*#__PURE__*/_interopDefault(readline);
var minimist__default = /*#__PURE__*/_interopDefault(minimist);

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
async function crawler() {
  try {
    browser = await puppeteer__default.default.launch({
      headless: true,
      args: [
        "--no-zygote",
        // Disables the use of the zygote process for forking child processes
        "--incognito",
        // Launch Chrome in incognito mode to avoid cookies and cache interference
        "--no-sandbox",
        // Disable the sandbox mode (useful for running in Docker containers)
        "--enable-automation",
        // Enable automation in Chrome (e.g., for Selenium)
        "--disable-dev-shm-usage"
        // Disable /dev/shm usage (useful for running in Docker containers)
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
        throw new Error(colors20__default.default.red("@error: ") + error.message);
      default:
        throw new Error(colors20__default.default.red("@error: ") + "internal server error");
    }
  }
}

// core/web/api/SearchVideos.ts
async function SearchVideos(input) {
  try {
    await crawler();
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
      screenshot: z4.z.boolean().optional()
    });
    const { query, screenshot } = await QuerySchema.parseAsync(input);
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
      text: colors20__default.default.green("@scrape: ") + "booting chromium..."
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
            text: colors20__default.default.yellow("@scrape: ") + "waiting for hydration..."
          });
          if (screenshot) {
            snapshot = await page.screenshot({
              path: "TypeVideo.png"
            });
            fs__namespace.default.writeFileSync("TypeVideo.png", snapshot);
            spinnies.update(spin, {
              text: colors20__default.default.yellow("@scrape: ") + "took snapshot..."
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
            text: colors20__default.default.green("@info: ") + colors20__default.default.white("scrapping done")
          });
          if (page)
            await page.close();
          if (browser)
            await browser.close();
          return metaTube;
        }, retryOptions);
        return TubeResp;
      case "playlist":
        TubeResp = await retry__default.default(async () => {
          url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query) + "&sp=EgIQAw%253D%253D";
          await page.goto(url);
          for (let i = 0; i < 80; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          }
          spinnies.update(spin, {
            text: colors20__default.default.yellow("@scrape: ") + "waiting for hydration..."
          });
          if (screenshot) {
            snapshot = await page.screenshot({
              path: "TypePlaylist.png"
            });
            fs__namespace.default.writeFileSync("TypePlaylist.png", snapshot);
            spinnies.update(spin, {
              text: colors20__default.default.yellow("@scrape: ") + "took snapshot..."
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
            text: colors20__default.default.green("@info: ") + colors20__default.default.white("scrapping done")
          });
          if (page)
            await page.close();
          if (browser)
            await browser.close();
          return playlistMeta;
        }, retryOptions);
        return TubeResp;
      default:
        spinnies.fail(spin, {
          text: colors20__default.default.red("@error: ") + colors20__default.default.white("wrong filter type provided.")
        });
        if (page)
          await page.close();
        if (browser)
          await browser.close();
        return void 0;
    }
  } catch (error) {
    if (page)
      await page.close();
    if (browser)
      await browser.close();
    switch (true) {
      case error instanceof z4.ZodError:
        throw new Error(
          colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
        );
      case error instanceof Error:
        throw new Error(colors20__default.default.red("@error: ") + error.message);
      default:
        throw new Error(colors20__default.default.red("@error: ") + "internal server error");
    }
  }
}
async function PlaylistInfo(input) {
  try {
    await crawler();
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
      screenshot: z4.z.boolean().optional()
    });
    const { screenshot } = await QuerySchema.parseAsync(input);
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
        text: colors20__default.default.green("@scrape: ") + "booting chromium..."
      });
      await page.goto(query);
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      spinnies.update(spin, {
        text: colors20__default.default.yellow("@scrape: ") + "waiting for hydration..."
      });
      if (screenshot) {
        snapshot = await page.screenshot({
          path: "FilterVideo.png"
        });
        fs__namespace.default.writeFileSync("FilterVideo.png", snapshot);
        spinnies.update(spin, {
          text: colors20__default.default.yellow("@scrape: ") + "took snapshot..."
        });
      }
      const content = await page.content();
      const $ = cheerio.load(content);
      const playlistTitle = $(
        "yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string"
      ).text().trim();
      const videoCountText = $("yt-formatted-string.byline-item").text();
      const playlistVideoCount = parseInt(videoCountText.match(/\d+/)[0]);
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
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
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
        text: colors20__default.default.green("@info: ") + colors20__default.default.white("scrapping done")
      });
      await page.close();
      await browser.close();
      return {
        playlistVideos: metaTube,
        playlistDescription: playlistDescription.trim(),
        playlistVideoCount,
        playlistViews,
        playlistTitle
      };
    }, retryOptions);
    return TubeResp;
  } catch (error) {
    if (page)
      await page.close();
    if (browser)
      await browser.close();
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
async function VideoInfo(input) {
  try {
    await crawler();
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
      screenshot: z4.z.boolean().optional()
    });
    const { screenshot } = await QuerySchema.parseAsync(input);
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
        text: colors20__default.default.green("@scrape: ") + "booting chromium..."
      });
      await page.goto(query);
      for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      spinnies.update(spin, {
        text: colors20__default.default.yellow("@scrape: ") + "waiting for hydration..."
      });
      if (screenshot) {
        snapshot = await page.screenshot({
          path: "FilterVideo.png"
        });
        fs__namespace.default.writeFileSync("FilterVideo.png", snapshot);
        spinnies.update(spin, {
          text: colors20__default.default.yellow("@scrape: ") + "took snapshot..."
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
        text: colors20__default.default.green("@info: ") + colors20__default.default.white("scrapping done")
      });
      await page.close();
      await browser.close();
      return metaTube;
    }, retryOptions);
    return TubeResp;
  } catch (error) {
    if (page)
      await page.close();
    if (browser)
      await browser.close();
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
    colors20__default.default.bold.white(`
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
\u2503               \u2503   flanger                    nightdlp                                                        \u2503
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
async function Engine(query) {
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
      proLoc += ` --dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
      proLoc += ` --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'`;
      proLoc += ` '${query}'`;
    } else {
      throw new Error(
        colors20__default.default.red("@error: ") + "could not find the engine file."
      );
    }
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
    if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else {
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
    }
  }
}

// package.json
var version = "3.0.6";

// core/base/Agent.ts
async function Agent({
  query
}) {
  try {
    console.log(
      colors20__default.default.green("@info:"),
      "\u2763\uFE0F Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
    );
    let videoId;
    let respEngine = void 0;
    let TubeBody;
    console.log(colors20__default.default.green("@info: ") + `using yt-dlx version ${version}`);
    switch (true) {
      case (!query || query.trim() === ""):
        throw new Error(colors20__default.default.red("@error: ") + "'query' is required.");
      case (/https/i.test(query) && /list/i.test(query)):
        throw new Error(
          colors20__default.default.red("@error: ") + "use extract_playlist_videos()."
        );
      case (/https/i.test(query) && !/list/i.test(query)):
        videoId = await YouTubeID(query);
        break;
      default:
        videoId = await YouTubeID(query);
    }
    switch (videoId) {
      case void 0:
        TubeBody = await web_default.search.SearchVideos({
          query,
          type: "video"
        });
        if (!TubeBody || TubeBody.length === 0) {
          throw new Error(
            colors20__default.default.red("@error: ") + "no data returned from server."
          );
        } else if (TubeBody[0]) {
          console.log(
            colors20__default.default.green("@info: ") + `preparing payload for ${TubeBody[0].title}`
          );
          respEngine = await Engine(TubeBody[0].videoLink);
        } else {
          throw new Error(
            colors20__default.default.red("@error: ") + "no data returned from server."
          );
        }
        break;
      default:
        TubeBody = await web_default.search.VideoInfo({
          query
        });
        if (!TubeBody) {
          throw new Error(
            colors20__default.default.red("@error: ") + "no data returned from server."
          );
        }
        console.log(
          colors20__default.default.green("@info: ") + `preparing payload for ${TubeBody.title}`
        );
        respEngine = await Engine(TubeBody.videoLink);
        break;
    }
    if (respEngine === void 0) {
      throw new Error(colors20__default.default.red("@error: ") + "no data returned from server.");
    } else
      return respEngine;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else {
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
    }
  }
}

// core/pipes/command/extract.ts
async function extract({ query }) {
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
    const metaBody = await Agent({ query });
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
    return payload;
  } catch (error) {
    return {
      message: error.message || "An unexpected error occurred",
      status: 500
    };
  }
}
function list_formats({
  query
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const zval = z4__namespace.object({
        query: z4__namespace.string().min(1)
      }).parse({ query });
      const EnResp = await Agent(zval);
      if (!EnResp)
        return reject("Unable to get response from YouTube...");
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
    } catch (error) {
      reject(error instanceof z4__namespace.ZodError ? error.errors : error);
    }
  });
}
async function extract_playlist_videos({
  playlistUrls
}) {
  try {
    const proTubeArr = [];
    const processedVideoIds = /* @__PURE__ */ new Set();
    for (const videoLink of playlistUrls) {
      const ispUrl = videoLink.match(/list=([a-zA-Z0-9_-]+)/);
      if (!ispUrl) {
        console.error(
          colors20__default.default.bold.red("@error: "),
          "Invalid YouTube Playlist URL:",
          videoLink
        );
        continue;
      }
      const resp = await web_default.search.PlaylistInfo({
        query: ispUrl[1]
      });
      if (resp === void 0) {
        console.error(
          colors20__default.default.bold.red("@error: "),
          "Invalid Data Found For:",
          ispUrl[1]
        );
        continue;
      }
      for (let i = 0; i < resp.playlistVideos.length; i++) {
        try {
          const videoId = resp.playlistVideos[i]?.videoId;
          if (videoId === void 0)
            continue;
          if (processedVideoIds.has(videoId))
            continue;
          const data = await Agent({ query: videoId });
          if (data instanceof Array)
            proTubeArr.push(...data);
          else
            proTubeArr.push(data);
          processedVideoIds.add(videoId);
        } catch (error) {
          console.error(colors20__default.default.bold.red("@error: "), error);
        }
      }
    }
    return proTubeArr;
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
async function lowEntry(metaBody) {
  if (!metaBody || metaBody.length === 0) {
    console.log(colors20__default.default.red("@error:"), "sorry no downloadable data found");
    return void 0;
  }
  const validEntries = metaBody.filter(
    (entry) => entry.AVInfo.filesizebytes !== null && entry.AVInfo.filesizebytes !== void 0 && !isNaN(entry.AVInfo.filesizebytes)
  );
  if (validEntries.length === 0) {
    console.log(colors20__default.default.red("@error:"), "sorry no downloadable data found");
    return void 0;
  }
  const sortedByFileSize = [...validEntries].sort(
    (a, b) => a.AVInfo.filesizebytes - b.AVInfo.filesizebytes
  );
  return sortedByFileSize[0];
}
var progressBar = (prog) => {
  if (prog.percent === void 0)
    return;
  if (prog.timemark === void 0)
    return;
  let color = colors20__default.default.green;
  if (prog.percent >= 98)
    prog.percent = 100;
  readline__default.default.cursorTo(process.stdout, 0);
  const width = Math.floor(process.stdout.columns / 3);
  const scomp = Math.round(width * prog.percent / 100);
  if (prog.percent < 20)
    color = colors20__default.default.red;
  else if (prog.percent < 80)
    color = colors20__default.default.yellow;
  const sprog = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
  process.stdout.write(
    color("@prog: ") + sprog + " " + prog.percent.toFixed(2) + "% " + color("@timemark: ") + prog.timemark
  );
  if (prog.percent >= 99)
    process.stdout.write("\n");
};
var progressBar_default = progressBar;

// core/pipes/audio/AudioLowest.ts
var AudioLowestZod = z4.z.object({
  query: z4.z.string().min(1),
  filter: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  outputFormat: z4.z.enum(["mp3", "ogg", "flac", "aiff"]).optional()
});
async function AudioLowest(input) {
  try {
    const {
      query,
      filter,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp3"
    } = AudioLowestZod.parse(input);
    const metaBody = await Agent({ query });
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await lowEntry(metaBody.AudioStore);
    if (metaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    const proc = fluentffmpeg__default.default();
    proc.addInput(metaEntry.AVDownload.mediaurl);
    proc.addInput(metaBody.metaTube.thumbnail);
    proc.addOutputOption("-map", "1:0");
    proc.addOutputOption("-map", "0:a:0");
    proc.addOutputOption("-id3v2_version", "3");
    proc.format(outputFormat);
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    switch (filter) {
      case "bassboost":
        proc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-dlp-(AudioLowest_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        proc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-dlp-(AudioLowest_echo)-${title}.${outputFormat}`;
        break;
      case "flanger":
        proc.withAudioFilter(["flanger"]);
        metaName = `yt-dlp-(AudioLowest_flanger)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-dlp-(AudioLowest_nightcore)-${title}.${outputFormat}`;
        break;
      case "panning":
        proc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-dlp-(AudioLowest_panning)-${title}.${outputFormat}`;
        break;
      case "phaser":
        proc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-dlp-(AudioLowest_phaser)-${title}.${outputFormat}`;
        break;
      case "reverse":
        proc.withAudioFilter(["areverse"]);
        metaName = `yt-dlp-(AudioLowest_reverse)-${title}.${outputFormat}`;
        break;
      case "slow":
        proc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-dlp-(AudioLowest_slow)-${title}.${outputFormat}`;
        break;
      case "speed":
        proc.withAudioFilter(["atempo=2"]);
        metaName = `yt-dlp-(AudioLowest_speed)-${title}.${outputFormat}`;
        break;
      case "subboost":
        proc.withAudioFilter(["asubboost"]);
        metaName = `yt-dlp-(AudioLowest_subboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        proc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-dlp-(AudioLowest_superslow)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        proc.withAudioFilter(["atempo=3"]);
        metaName = `yt-dlp-(AudioLowest_superspeed)-${title}.${outputFormat}`;
        break;
      case "surround":
        proc.withAudioFilter(["surround"]);
        metaName = `yt-dlp-(AudioLowest_surround)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-dlp-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        proc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-dlp-(AudioLowest_vibrato)-${title}.${outputFormat}`;
        break;
      default:
        proc.withAudioFilter([]);
        metaName = `yt-dlp-(AudioLowest)-${title}.${outputFormat}`;
        break;
    }
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(void 0);
          callback();
        }
      });
      proc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
      };
    } else {
      await new Promise((resolve, reject) => {
        proc.output(path2__namespace.join(metaFold, metaName));
        proc.on("end", () => resolve());
        proc.on("error", reject);
        proc.run();
      });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
async function bigEntry(metaBody) {
  if (!metaBody || metaBody.length === 0) {
    console.log(colors20__default.default.red("@error:"), "sorry no downloadable data found");
    return void 0;
  }
  const validEntries = metaBody.filter(
    (entry) => entry.AVInfo.filesizebytes !== null && entry.AVInfo.filesizebytes !== void 0 && !isNaN(entry.AVInfo.filesizebytes)
  );
  if (validEntries.length === 0) {
    console.log(colors20__default.default.red("@error:"), "sorry no downloadable data found");
    return void 0;
  }
  const sortedByFileSize = [...validEntries].sort(
    (a, b) => b.AVInfo.filesizebytes - a.AVInfo.filesizebytes
  );
  return sortedByFileSize[0];
}
var AudioHighestZod = z4.z.object({
  query: z4.z.string().min(1),
  filter: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  outputFormat: z4.z.enum(["mp3", "ogg", "flac", "aiff"]).optional()
});
async function AudioHighest(input) {
  try {
    const {
      query,
      filter,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp3"
    } = AudioHighestZod.parse(input);
    const metaBody = await Agent({ query });
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await bigEntry(metaBody.AudioStore);
    if (metaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    const proc = fluentffmpeg__default.default();
    proc.addInput(metaEntry.AVDownload.mediaurl);
    proc.addInput(metaBody.metaTube.thumbnail);
    proc.addOutputOption("-map", "1:0");
    proc.addOutputOption("-map", "0:a:0");
    proc.addOutputOption("-id3v2_version", "3");
    proc.format(outputFormat);
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    switch (filter) {
      case "bassboost":
        proc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-dlp-(AudioHighest_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        proc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-dlp-(AudioHighest_echo)-${title}.${outputFormat}`;
        break;
      case "flanger":
        proc.withAudioFilter(["flanger"]);
        metaName = `yt-dlp-(AudioHighest_flanger)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-dlp-(AudioHighest_nightcore)-${title}.${outputFormat}`;
        break;
      case "panning":
        proc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-dlp-(AudioHighest_panning)-${title}.${outputFormat}`;
        break;
      case "phaser":
        proc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-dlp-(AudioHighest_phaser)-${title}.${outputFormat}`;
        break;
      case "reverse":
        proc.withAudioFilter(["areverse"]);
        metaName = `yt-dlp-(AudioHighest_reverse)-${title}.${outputFormat}`;
        break;
      case "slow":
        proc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-dlp-(AudioHighest_slow)-${title}.${outputFormat}`;
        break;
      case "speed":
        proc.withAudioFilter(["atempo=2"]);
        metaName = `yt-dlp-(AudioHighest_speed)-${title}.${outputFormat}`;
        break;
      case "subboost":
        proc.withAudioFilter(["asubboost"]);
        metaName = `yt-dlp-(AudioHighest_subboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        proc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-dlp-(AudioHighest_superslow)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        proc.withAudioFilter(["atempo=3"]);
        metaName = `yt-dlp-(AudioHighest_superspeed)-${title}.${outputFormat}`;
        break;
      case "surround":
        proc.withAudioFilter(["surround"]);
        metaName = `yt-dlp-(AudioHighest_surround)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-dlp-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        proc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-dlp-(AudioHighest_vibrato)-${title}.${outputFormat}`;
        break;
      default:
        proc.withAudioFilter([]);
        metaName = `yt-dlp-(AudioHighest)-${title}.${outputFormat}`;
        break;
    }
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(void 0);
          callback();
        }
      });
      proc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
      };
    } else {
      await new Promise((resolve, reject) => {
        proc.output(path2__namespace.join(metaFold, metaName));
        proc.on("end", () => resolve());
        proc.on("error", reject);
        proc.run();
      });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
var VideoLowestZod = z4.z.object({
  query: z4.z.string().min(1),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  filter: z4.z.string().optional(),
  outputFormat: z4.z.enum(["mp4", "avi", "mov"]).optional()
});
async function VideoLowest(input) {
  try {
    const {
      query,
      filter,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4"
    } = VideoLowestZod.parse(input);
    const metaBody = await Agent({ query });
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await lowEntry(metaBody.VideoStore);
    if (metaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    const proc = fluentffmpeg__default.default();
    proc.addInput(metaEntry.AVDownload.mediaurl);
    proc.format(outputFormat);
    switch (filter) {
      case "grayscale":
        proc.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        proc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        proc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        proc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        proc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        proc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        proc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
    }
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    switch (stream$1) {
      case true:
        const readStream = new stream.Readable({
          read() {
          }
        });
        const writeStream = new stream.Writable({
          write(chunk, _encoding, callback) {
            readStream.push(chunk);
            callback();
          },
          final(callback) {
            readStream.push(void 0);
            callback();
          }
        });
        proc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
        };
      default:
        await new Promise((resolve, reject) => {
          proc.output(path2__namespace.join(metaFold, metaName));
          proc.on("end", () => resolve());
          proc.on("error", reject);
          proc.run();
        });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
var VideoHighestZod = z4.z.object({
  query: z4.z.string().min(1),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  outputFormat: z4.z.enum(["mp4", "avi", "mov"]).optional(),
  filter: z4.z.string().optional()
});
async function VideoHighest(input) {
  try {
    const {
      query,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4",
      filter
    } = VideoHighestZod.parse(input);
    const metaBody = await Agent({ query });
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    let metaName = "";
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await bigEntry(metaBody.VideoStore);
    if (metaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    const proc = fluentffmpeg__default.default();
    proc.addInput(metaEntry.AVDownload.mediaurl);
    proc.format(outputFormat);
    switch (filter) {
      case "grayscale":
        proc.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        proc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        proc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        proc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        proc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        proc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        proc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
    }
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    switch (stream$1) {
      case true:
        const readStream = new stream.Readable({
          read() {
          }
        });
        const writeStream = new stream.Writable({
          write(chunk, _encoding, callback) {
            readStream.push(chunk);
            callback();
          },
          final(callback) {
            readStream.push(void 0);
            callback();
          }
        });
        proc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
        };
      default:
        await new Promise((resolve, reject) => {
          proc.output(path2__namespace.join(metaFold, metaName));
          proc.on("end", () => resolve());
          proc.on("error", reject);
          proc.run();
        });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
var AudioVideoLowestZod = z4.z.object({
  query: z4.z.string().min(1),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  outputFormat: z4.z.enum(["webm", "avi", "mov"]).optional()
});
async function AudioVideoLowest(input) {
  try {
    const {
      query,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "webm"
    } = AudioVideoLowestZod.parse(input);
    const metaBody = await Agent({ query });
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const proc = fluentffmpeg__default.default();
    const [AmetaEntry, VmetaEntry] = await Promise.all([
      lowEntry(metaBody.AudioStore),
      lowEntry(metaBody.VideoStore)
    ]);
    if (AmetaEntry === void 0 || VmetaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    proc.addInput(VmetaEntry.AVDownload.mediaurl);
    proc.addInput(AmetaEntry.AVDownload.mediaurl);
    proc.addOutputOption("-shortest");
    proc.format(outputFormat);
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(void 0);
          callback();
        }
      });
      proc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
      };
    } else {
      await new Promise((resolve, reject) => {
        proc.output(path2__namespace.join(metaFold, metaName));
        proc.on("end", () => resolve());
        proc.on("error", reject);
        proc.run();
      });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
var AudioVideoHighestZod = z4.z.object({
  query: z4.z.string().min(1),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  outputFormat: z4.z.enum(["webm", "avi", "mov"]).optional()
});
async function AudioVideoHighest(input) {
  try {
    const {
      query,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "webm"
    } = AudioVideoHighestZod.parse(input);
    const metaBody = await Agent({ query });
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const proc = fluentffmpeg__default.default();
    const [AmetaEntry, VmetaEntry] = await Promise.all([
      bigEntry(metaBody.AudioStore),
      bigEntry(metaBody.VideoStore)
    ]);
    if (AmetaEntry === void 0 || VmetaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    proc.addInput(VmetaEntry.AVDownload.mediaurl);
    proc.addInput(AmetaEntry.AVDownload.mediaurl);
    proc.addOption("-shortest");
    proc.format(outputFormat);
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(void 0);
          callback();
        }
      });
      proc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
      };
    } else {
      await new Promise((resolve, reject) => {
        proc.output(path2__namespace.join(metaFold, metaName));
        proc.on("end", () => resolve());
        proc.on("error", reject);
        proc.run();
      });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
var AudioQualityCustomZod = z4.z.object({
  query: z4.z.string().min(1),
  filter: z4.z.string().optional(),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  quality: z4.z.enum(["high", "medium", "low", "ultralow"]),
  outputFormat: z4.z.enum(["mp3", "ogg", "flac", "aiff"]).optional()
});
async function AudioQualityCustom(input) {
  try {
    const {
      query,
      filter,
      stream: stream$1,
      verbose,
      quality,
      folderName,
      outputFormat = "mp3"
    } = AudioQualityCustomZod.parse(input);
    const metaResp = await Agent({ query });
    if (!metaResp) {
      throw new Error("Unable to get response from YouTube...");
    }
    const metaBody = metaResp.AudioStore.filter(
      (op) => op.AVDownload.formatnote === quality
    );
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    let metaName = "";
    const title = metaResp.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const proc = fluentffmpeg__default.default();
    const metaEntry = await bigEntry(metaBody);
    if (metaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    proc.addInput(metaEntry.AVDownload.mediaurl);
    proc.addInput(metaResp.metaTube.thumbnail);
    proc.addOutputOption("-map", "1:0");
    proc.addOutputOption("-map", "0:a:0");
    proc.addOutputOption("-id3v2_version", "3");
    proc.format(outputFormat);
    switch (filter) {
      case "bassboost":
        proc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        proc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "flanger":
        proc.withAudioFilter(["flanger"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "panning":
        proc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "phaser":
        proc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "reverse":
        proc.withAudioFilter(["areverse"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "slow":
        proc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "speed":
        proc.withAudioFilter(["atempo=2"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "subboost":
        proc.withAudioFilter(["asubboost"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        proc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        proc.withAudioFilter(["atempo=3"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "surround":
        proc.withAudioFilter(["surround"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        proc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      default:
        proc.withAudioFilter([]);
        metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
        break;
    }
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(void 0);
          callback();
        }
      });
      proc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
      };
    } else {
      await new Promise((resolve, reject) => {
        proc.output(path2__namespace.join(metaFold, metaName));
        proc.on("end", () => resolve());
        proc.on("error", reject);
        proc.run();
      });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
  }
}
var VideoLowestZod2 = z4.z.object({
  query: z4.z.string().min(1),
  stream: z4.z.boolean().optional(),
  verbose: z4.z.boolean().optional(),
  folderName: z4.z.string().optional(),
  filter: z4.z.string().optional(),
  outputFormat: z4.z.enum(["mp4", "avi", "mov"]).optional()
});
async function VideoLowest2(input) {
  try {
    const {
      query,
      filter,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4"
    } = VideoLowestZod2.parse(input);
    const metaBody = await Agent({ query });
    if (!metaBody)
      throw new Error("Unable to get response from YouTube...");
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path2__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await bigEntry(metaBody.VideoStore);
    if (metaEntry === void 0) {
      throw new Error("Unable to get response from YouTube...");
    }
    const proc = fluentffmpeg__default.default();
    proc.addInput(metaEntry.AVDownload.mediaurl);
    proc.format(outputFormat);
    switch (filter) {
      case "grayscale":
        proc.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        proc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        proc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        proc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        proc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        proc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        proc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
    }
    proc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("end", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("close", () => {
      progressBar_default({
        timemark: void 0,
        percent: void 0
      });
    });
    proc.on("progress", (prog) => {
      progressBar_default({
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    switch (stream$1) {
      case true:
        const readStream = new stream.Readable({
          read() {
          }
        });
        const writeStream = new stream.Writable({
          write(chunk, _encoding, callback) {
            readStream.push(chunk);
            callback();
          },
          final(callback) {
            readStream.push(void 0);
            callback();
          }
        });
        proc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName ? path2__namespace.join(metaFold, metaName.replace("-.", ".")) : metaName.replace("-.", ".")
        };
      default:
        await new Promise((resolve, reject) => {
          proc.output(path2__namespace.join(metaFold, metaName));
          proc.on("end", () => resolve());
          proc.on("error", reject);
          proc.run();
        });
    }
  } catch (error) {
    if (error instanceof z4.ZodError) {
      throw new Error(
        colors20__default.default.red("@error: ") + error.errors.map((error2) => error2.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors20__default.default.red("@error: ") + error.message);
    } else
      throw new Error(colors20__default.default.red("@error: ") + "internal server error");
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
    lowest: AudioLowest,
    highest: AudioHighest,
    custom: AudioQualityCustom
  },
  video: {
    lowest: VideoLowest,
    highest: VideoHighest,
    custom: VideoLowest2
  },
  audio_video: {
    lowest: AudioVideoLowest,
    highest: AudioVideoHighest
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
      console.error(colors20__default.default.green("Installed Version: yt-dlx@" + version));
      break;
    case "help":
    case "h":
      core_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors20__default.default.red(error));
        process.exit();
      });
      break;
    case "extract":
    case "e":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.info.extract({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "list-formats":
    case "f":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.info.list_formats({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-highest":
    case "ah":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.audio.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-lowest":
    case "al":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.audio.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "video_highest":
    case "vh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.video.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "video-lowest":
    case "vl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.video.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-highest":
    case "avh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.audio_video.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-lowest":
    case "avl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      } else
        core_default.audio_video.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors20__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-quality-custom":
    case "aqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors20__default.default.red("error: no format"));
      }
      core_default.audio.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors20__default.default.red(error));
        process.exit();
      });
      break;
    case "video-quality-custom":
    case "vqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors20__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors20__default.default.red("error: no format"));
      }
      core_default.video.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors20__default.default.red(error));
        process.exit();
      });
      break;
    default:
      core_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors20__default.default.red(error));
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
    console.error(colors20__default.default.red(error));
    process.exit();
  });
} else
  program();
