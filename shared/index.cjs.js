/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
'use strict';

var fs = require('fs');
var colors = require('colors');
var cheerio = require('cheerio');
var retry = require('async-retry');
var puppeteer = require('puppeteer');
var spinClient = require('spinnies');
var z = require('zod');
var crypto = require('crypto');
var child_process = require('child_process');
var path = require('path');
var util = require('util');
var async = require('async');
var readline = require('readline');
var ffmpeg = require('fluent-ffmpeg');

function _interopNamespaceDefault(e) {
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

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var z__namespace = /*#__PURE__*/_interopNamespaceDefault(z);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var async__namespace = /*#__PURE__*/_interopNamespaceDefault(async);

async function closers(browser) {
    try {
        const pages = await browser.pages();
        await Promise.all(pages.map((page) => page.close()));
        await browser.close();
    }
    catch (error) {
        console.error(error);
    }
}

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
                /playlist\?list=([^#\&\?]+)/,
            ];
            for (i = 0; i < patterns.length; ++i) {
                if (patterns[i].test(videoLink)) {
                    if (i === patterns.length - 1) {
                        const match = patterns[i].exec(videoLink);
                        const playlistParams = new URLSearchParams(match[0]);
                        const videoId = playlistParams.get("v");
                        return resolve(videoId);
                    }
                    else
                        return resolve(patterns[i].exec(videoLink)[1]);
                }
            }
        }
        resolve(undefined);
    });
}

let browser;
let page;
async function crawler(verbose, autoSocks5) {
    try {
        if (autoSocks5) {
            browser = await puppeteer.launch({
                headless: verbose ? false : true,
                args: [
                    "--no-zygote",
                    "--incognito",
                    "--no-sandbox",
                    "--lang=en-US",
                    "--enable-automation",
                    "--disable-dev-shm-usage",
                    "--ignore-certificate-errors",
                    "--allow-running-insecure-content",
                    "--proxy-server=socks5://127.0.0.1:9050",
                ],
            });
        }
        else {
            browser = await puppeteer.launch({
                headless: verbose ? false : true,
                args: [
                    "--no-zygote",
                    "--incognito",
                    "--no-sandbox",
                    "--lang=en-US",
                    "--enable-automation",
                    "--disable-dev-shm-usage",
                    "--ignore-certificate-errors",
                    "--allow-running-insecure-content",
                ],
            });
        }
        page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
    }
    catch (error) {
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

async function SearchVideos(input) {
    try {
        const QuerySchema = z.z.object({
            query: z.z
                .string()
                .min(1)
                .refine(async (query) => {
                const result = await YouTubeID(query);
                return result === undefined;
            }, {
                message: "Query must not be a YouTube video/Playlist link",
            }),
            verbose: z.z.boolean().optional(),
            autoSocks5: z.z.boolean().optional(),
            screenshot: z.z.boolean().optional(),
        });
        const { query, screenshot, verbose, autoSocks5 } = await QuerySchema.parseAsync(input);
        await crawler(verbose, autoSocks5);
        const retryOptions = {
            maxTimeout: 6000,
            minTimeout: 1000,
            retries: 4,
        };
        let url;
        let $;
        const spin = crypto.randomUUID();
        let content;
        let metaTube = [];
        const spinnies = new spinClient();
        let videoElements;
        let playlistMeta = [];
        let TubeResp;
        let snapshot;
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
                    $ = cheerio.load(content);
                    videoElements = $("ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])");
                    videoElements.each(async (_, vide) => {
                        const videoId = await YouTubeID("https://www.youtube.com" + $(vide).find("a").attr("href"));
                        const authorContainer = $(vide).find(".ytd-channel-name a");
                        const uploadedOnElement = $(vide).find(".inline-metadata-item.style-scope.ytd-video-meta-block");
                        metaTube.push({
                            title: $(vide).find("#video-title").text().trim() || undefined,
                            views: $(vide)
                                .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
                                .filter((_, vide) => $(vide).text().includes("views"))
                                .text()
                                .trim()
                                .replace(/ views/g, "") || undefined,
                            author: authorContainer.text().trim() || undefined,
                            videoId,
                            uploadOn: uploadedOnElement.length >= 2
                                ? $(uploadedOnElement[1]).text().trim()
                                : undefined,
                            authorUrl: "https://www.youtube.com" + authorContainer.attr("href") ||
                                undefined,
                            videoLink: "https://www.youtube.com/watch?v=" + videoId,
                            thumbnailUrls: [
                                `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                                `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                                `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                                `https://img.youtube.com/vi/${videoId}/default.jpg`,
                            ],
                            description: $(vide).find(".metadata-snippet-text").text().trim() ||
                                undefined,
                        });
                    });
                    spinnies.succeed(spin, {
                        text: colors.green("@info: ") +
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
                    const $ = cheerio.load(content);
                    const playlistElements = $("ytd-playlist-renderer");
                    playlistElements.each((_index, element) => {
                        const playlistLink = $(element)
                            .find(".style-scope.ytd-playlist-renderer #view-more a")
                            .attr("href");
                        const vCount = $(element).text().trim();
                        playlistMeta.push({
                            title: $(element)
                                .find(".style-scope.ytd-playlist-renderer #video-title")
                                .text()
                                .replace(/\s+/g, " ")
                                .trim() || undefined,
                            author: $(element)
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
                            videoCount: parseInt(vCount.replace(/ videos\nNOW PLAYING/g, "")) ||
                                undefined,
                        });
                    });
                    spinnies.succeed(spin, {
                        text: colors.green("@info: ") +
                            colors.white("scrapping done for ") +
                            query,
                    });
                    return playlistMeta;
                }, retryOptions);
                await closers(browser);
                return TubeResp;
            default:
                spinnies.fail(spin, {
                    text: colors.red("@error: ") +
                        colors.white("wrong filter type provided."),
                });
                await closers(browser);
                return undefined;
        }
    }
    catch (error) {
        await closers(browser);
        switch (true) {
            case error instanceof z.ZodError:
                throw new Error(colors.red("@error: ") +
                    error.errors.map((error) => error.message).join(", "));
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

async function PlaylistInfo(input) {
    try {
        let query;
        const spinnies = new spinClient();
        const QuerySchema = z.z.object({
            query: z.z
                .string()
                .min(1)
                .refine(async (input) => {
                switch (true) {
                    case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                        const resultLink = await YouTubeID(input);
                        if (resultLink !== undefined) {
                            query = input;
                            return true;
                        }
                        break;
                    default:
                        const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                        if (resultId !== undefined) {
                            query = `https://www.youtube.com/playlist?list=${input}`;
                            return true;
                        }
                        break;
                }
                return false;
            }, {
                message: "Query must be a valid YouTube Playlist Link or ID.",
            }),
            verbose: z.z.boolean().optional(),
            autoSocks5: z.z.boolean().optional(),
            screenshot: z.z.boolean().optional(),
        });
        const { screenshot, verbose, autoSocks5 } = await QuerySchema.parseAsync(input);
        await crawler(verbose, autoSocks5);
        const retryOptions = {
            maxTimeout: 6000,
            minTimeout: 1000,
            retries: 4,
        };
        let metaTube = [];
        const spin = crypto.randomUUID();
        let TubeResp;
        let snapshot;
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
            const $ = cheerio.load(content);
            const playlistTitle = $("yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string")
                .text()
                .trim();
            const viewsText = $("yt-formatted-string.byline-item").eq(1).text();
            const playlistViews = parseInt(viewsText.replace(/,/g, "").match(/\d+/)[0]);
            let playlistDescription = $("span#plain-snippet-text").text();
            $("ytd-playlist-video-renderer").each(async (_index, element) => {
                const title = $(element).find("h3").text().trim();
                const videoLink = "https://www.youtube.com" + $(element).find("a").attr("href");
                const videoId = await YouTubeID(videoLink);
                const newLink = "https://www.youtube.com/watch?v=" + videoId;
                const author = $(element)
                    .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                    .text();
                const authorUrl = "https://www.youtube.com" +
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
                text: colors.green("@info: ") + colors.white("scrapping done for ") + query,
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
    }
    catch (error) {
        await closers(browser);
        switch (true) {
            case error instanceof z.ZodError:
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
        const spinnies = new spinClient();
        const QuerySchema = z.z.object({
            query: z.z
                .string()
                .min(1)
                .refine(async (input) => {
                switch (true) {
                    case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(input):
                        const resultLink = await YouTubeID(input);
                        if (resultLink !== undefined) {
                            query = input;
                            return true;
                        }
                        break;
                    default:
                        const resultId = await YouTubeID(`https://www.youtube.com/watch?v=${input}`);
                        if (resultId !== undefined) {
                            query = `https://www.youtube.com/watch?v=${input}`;
                            return true;
                        }
                        break;
                }
                return false;
            }, {
                message: "Query must be a valid YouTube video Link or ID.",
            }),
            verbose: z.z.boolean().optional(),
            autoSocks5: z.z.boolean().optional(),
            screenshot: z.z.boolean().optional(),
        });
        const { screenshot, verbose, autoSocks5 } = await QuerySchema.parseAsync(input);
        await crawler(verbose, autoSocks5);
        const retryOptions = {
            maxTimeout: 6000,
            minTimeout: 1000,
            retries: 4,
        };
        let TubeResp;
        const spin = crypto.randomUUID();
        let snapshot;
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
            const videoId = (await YouTubeID(query));
            await page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-metadata", { timeout: 10000 });
            await page.waitForSelector("a.yt-simple-endpoint.style-scope.yt-formatted-string", { timeout: 10000 });
            await page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-info-text", { timeout: 10000 });
            setTimeout(() => { }, 1000);
            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const title = $("yt-formatted-string.style-scope.ytd-watch-metadata")
                .text()
                .trim();
            const author = $("a.yt-simple-endpoint.style-scope.yt-formatted-string")
                .text()
                .trim();
            const viewsElement = $("yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('views')").first();
            const views = viewsElement.text().trim().replace(" views", "");
            const uploadOnElement = $("yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('ago')").first();
            const uploadOn = uploadOnElement.text().trim();
            const thumbnailUrls = [
                `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/default.jpg`,
            ];
            const metaTube = {
                views,
                author,
                videoId,
                uploadOn,
                thumbnailUrls,
                title: title.trim(),
                videoLink: "https://www.youtube.com/watch?v=" + videoId,
            };
            spinnies.succeed(spin, {
                text: colors.green("@info: ") + colors.white("scrapping done for ") + query,
            });
            return metaTube;
        }, retryOptions);
        await closers(browser);
        return TubeResp;
    }
    catch (error) {
        await closers(browser);
        switch (true) {
            case error instanceof z.ZodError:
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

const web = {
    search: {
        SearchVideos,
        PlaylistInfo,
        VideoInfo,
    },
};

function help() {
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    return Promise.resolve(colors.bold.white(`
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕
┃                                     YOUTUBE DOWNLOADER DLX <( YT-DLX /)>                                   ┃
┃                                            (License: MIT)                                                    ┃
┃                                         [Owner: ShovitDutta]                                                 ┃
┃                                       { Web: rebrand.ly/mixly }                                              ┃
┃                                                                                                              ┃
┃                               Supports both async/await and promise.then()                                   ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     ┃
┃──────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INSTALLATION  ┃ ❝ LOCALLY: ❞                                                                                 ┃
┃               ┃   bun add yt-dlx                                                                             ┃
┃               ┃   yarn add yt-dlx                                                                            ┃
┃               ┃   npm install yt-dlx                                                                         ┃
┃               ┃   pnpm install yt-dlx                                                                        ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ GLOBALLY: ❞                                                                                ┃
┃               ┃   yarn global add yt-dlx                                                   (use cli)         ┃
┃               ┃   npm install --global yt-dlx                                              (use cli)         ┃
┃               ┃   pnpm install --global yt-dlx                                             (use cli)         ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃    FILTERS    ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   bassboost                  echo                                                            ┃
┃               ┃   flanger                    nightcore                                                       ┃
┃               ┃   panning                    phaser                                                          ┃
┃               ┃   reverse                    slow                                                            ┃
┃               ┃   speed                      subboost                                                        ┃
┃               ┃   superslow                  superspeed                                                      ┃
┃               ┃   surround                   vaporwave                                                       ┃
┃               ┃   vibrato                                                                                    ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   grayscale                                                                                  ┃
┃               ┃   invert                                                                                     ┃
┃               ┃   rotate90                                                                                   ┃
┃               ┃   rotate180                                                                                  ┃
┃               ┃   rotate270                                                                                  ┃
┃               ┃   flipHorizontal                                                                             ┃
┃               ┃   flipVertical                                                                               ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃   CLI USAGE   ┃ ❝ INFO GRABBERS: ❞                                                                           ┃
┃               ┃   yt-dlx version                                                             (alias: v)      ┃
┃               ┃   yt-dlx help                                                                (alias: h)      ┃
┃               ┃   yt-dlx extract --query="video/url"                                         (alias: e)      ┃
┃               ┃   yt-dlx search-yt --query="video/url"                                       (alias: s)      ┃
┃               ┃   yt-dlx list-formats --query="video/url"                                    (alias: f)      ┃ 
┃               ┃   yt-dlx get-video-data --query="video/url"                                  (alias: gvd)    ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   yt-dlx audio-lowest --query="video/url"                                    (alias: al)     ┃
┃               ┃   yt-dlx audio-highest --query="video/url"                                   (alias: ah)     ┃
┃               ┃   yt-dlx audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)    ┃
┃               ┃       ──────────────────────────────────────────────────────────────                         ┃
┃               ┃   yt-dlx audio-lowest --query="video/url" --filter="valid-filter"            (filter)        ┃
┃               ┃   yt-dlx audio-highest --query="video/url" --filter="valid-filter"           (filter)        ┃
┃               ┃   yt-dlx audio-quality-custom --query="video/url" --format="valid-format"    ........        ┃
┃               ┃                                                   --filter="valid-filter"    (filter)        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   yt-dlx video-lowest --query="video/url"                                    (alias: vl)     ┃
┃               ┃   yt-dlx video-highest --query="video/url"                                   (alias: vh)     ┃
┃               ┃   yt-dlx video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)    ┃
┃               ┃       ──────────────────────────────────────────────────────────────                         ┃
┃               ┃   yt-dlx video-lowest --query="video/url" --filter="valid-filter"            (filter)        ┃
┃               ┃   yt-dlx video-highest --query="video/url" --filter="valid-filter"           (filter)        ┃
┃               ┃   yt-dlx video-quality-custom --query="video/url" --format="valid-format"    ........        ┃
┃               ┃                                                   --filter="valid-filter"    (filter)        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                       ┃
┃               ┃   yt-dlx audio-video-lowest --query="video/url"                              (alias: avl)    ┃
┃               ┃   yt-dlx audio-video-highest --query="video/url"                             (alias: avh)    ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃   IMPORTING   ┃   import ytdlx from "yt-dlx";                                            TypeScript (ts)     ┃
┃               ┃   import ytdlx from "yt-dlx";                                            ECMAScript (esm)    ┃
┃               ┃   const ytdlx = require("yt-dlx");                                       CommonJS   (cjs)    ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INFO GRABBERS ┃   ytdlx.info.help();                                                                         ┃
┃               ┃   ytdlx.info.search({ query: "" });                                                          ┃
┃               ┃   ytdlx.info.extract({ query: "" });                                                         ┃
┃               ┃   ytdlx.info.list_formats({ query: "" });                                                    ┃
┃               ┃   ytdlx.info.get_video_data({ query: "" });                                                  ┃
┃               ┃   ytdlx.extract_playlist_videos({ playlistUrls: ["", "", "", ""] });                         ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃  DOWNLOADERS  ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   ytdlx.audio.download.lowest({ query: "", filter: "" });                                    ┃
┃               ┃   ytdlx.audio.download.highest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlx.audio.download.custom({ query: "", format: "", filter: "" });                        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   ytdlx.video.download.lowest({ query: "", filter: "" });                                    ┃
┃               ┃   ytdlx.video.download.highest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlx.video.download.custom({ query: "", filter: "" });                                    ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                       ┃
┃               ┃   ytdlx.audio_video.download.lowest({ query: "" });                                          ┃
┃               ┃   ytdlx.audio_video.download.highest({ query: "" });                                         ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃  MEDIA PIPE   ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   ytdlx.audio.pipe.lowest({ query: "", filter: "" });                                        ┃
┃               ┃   ytdlx.audio.pipe.highest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlx.audio.pipe.custom({ query: "", format: "", filter: "" });                            ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   ytdlx.video.pipe.lowest({ query: "", filter: "" });                                        ┃
┃               ┃   ytdlx.video.pipe.highest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlx.video.pipe.custom({ query: "", filter: "" });                                        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                       ┃
┃               ┃   ytdlx.audio_video.pipe.lowest({ query: "" });                                              ┃
┃               ┃   ytdlx.audio_video.pipe.highest({ query: "" });                                             ┃
┃──────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃                                     YOUTUBE DOWNLOADER DLX <( YT-DLX /)>                                   ┃
┃                                            (License: MIT)                                                    ┃
┃                                         [Owner: ShovitDutta]                                                 ┃
┃                                       { Web: rebrand.ly/mixly }                                              ┃
┃                                                                                                              ┃
┃                               Supports both async/await and promise.then()                                   ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     ┃
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕`));
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
        new Promise((resolve, reject) => {
            const stdoutData = [];
            prox.stdout.on("data", (data) => stdoutData.push(data));
            prox.on("close", (code) => {
                if (code === 0)
                    resolve(Buffer.concat(stdoutData).toString());
                else
                    reject(new Error("Try running npx yt-dlx install:socks5"));
            });
        }),
        new Promise((resolve, reject) => {
            const stderrData = [];
            prox.stderr.on("data", (data) => stderrData.push(data));
            prox.on("close", (code) => {
                if (code === 0)
                    resolve(Buffer.concat(stderrData).toString());
                else
                    reject(new Error("Try running npx yt-dlx install:socks5"));
            });
        }),
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
    }
    else if (filesize < bytesPerTerabyte) {
        return (filesize / bytesPerGigabyte).toFixed(2) + " GB";
    }
    else
        return (filesize / bytesPerTerabyte).toFixed(2) + " TB";
}
async function Engine({ query, ipAddress, autoSocks5, }) {
    try {
        let pushTube = [];
        let proLoc = "";
        let maxTries = 6;
        let currentDir = __dirname;
        while (maxTries > 0) {
            const enginePath = path__namespace.join(currentDir, "util", "engine");
            if (fs__namespace.existsSync(enginePath)) {
                proLoc = enginePath;
                break;
            }
            else {
                currentDir = path__namespace.join(currentDir, "..");
                maxTries--;
            }
        }
        if (proLoc !== "") {
            if (autoSocks5)
                proLoc += " --proxy socks5://127.0.0.1:9050";
            proLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
            proLoc += ` --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'`;
            proLoc += ` --dump-single-json '${query}'`;
        }
        else {
            throw new Error("Could not find dependencies. Try running npx yt-dlx install:deps");
        }
        const result = await util.promisify(child_process.exec)(proLoc);
        const metaTube = await JSON.parse(result.stdout.toString());
        await metaTube.formats.forEach((io) => {
            const rmval = new Set(["storyboard", "Default"]);
            if (rmval.has(io.format_note) && io.filesize === undefined)
                return;
            const reTube = {
                Audio: {
                    bitrate: io.abr,
                    codec: io.acodec,
                    samplerate: io.asr,
                    extension: io.audio_ext,
                    channels: io.audio_channels,
                },
                Video: {
                    bitrate: io.vbr,
                    width: io.width,
                    codec: io.vcodec,
                    height: io.height,
                    extension: io.video_ext,
                    resolution: io.resolution,
                    aspectratio: io.aspect_ratio,
                },
                AVDownload: {
                    mediaurl: io.url,
                    formatid: io.format_id,
                    formatnote: io.format_note,
                    originalformat: io.format.replace(/[-\s]+/g, "_").replace(/_/g, "_"),
                },
                AVInfo: {
                    totalbitrate: io.tbr,
                    framespersecond: io.fps,
                    qriginalextension: io.ext,
                    filesizebytes: io.filesize,
                    dynamicrange: io.dynamic_range,
                    extensionconatainer: io.container,
                    filesizeformatted: sizeFormat(io.filesize),
                },
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
                    duration_string: metaTube.duration_string,
                },
            });
            if (reTube.AVDownload.formatnote) {
                switch (true) {
                    case (reTube.AVDownload.formatnote.includes("ultralow") ||
                        reTube.AVDownload.formatnote.includes("medium") ||
                        reTube.AVDownload.formatnote.includes("high") ||
                        reTube.AVDownload.formatnote.includes("low")) &&
                        reTube.Video.resolution &&
                        reTube.Video.resolution.includes("audio"):
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
            AudioStore: pushTube
                .filter((item) => item.Tube === "AudioStore")
                .map((item) => item.reTube) || undefined,
            VideoStore: pushTube
                .filter((item) => item.Tube === "VideoStore")
                .map((item) => item.reTube) || undefined,
            HDRVideoStore: pushTube
                .filter((item) => item.Tube === "HDRVideoStore")
                .map((item) => item.reTube) || undefined,
            metaTube: pushTube
                .filter((item) => item.Tube === "metaTube")
                .map((item) => item.reTube)[0] || undefined,
            ipAddress,
        };
    }
    catch (error) {
        if (error instanceof Error)
            throw new Error(error.message);
        else
            throw new Error("Internal server error");
    }
}

var version = "5.10.0";

async function Agent({ query, verbose, autoSocks5, }) {
    try {
        console.log(colors.green("@info:"), "using", colors.green("yt-dlx"), "version", colors.green(version));
        let nipTor;
        let ipAddress = undefined;
        nipTor = await niptor(["curl https://checkip.amazonaws.com --insecure"]);
        console.log(colors.green("@info:"), "system", colors.green("ipAddress"), nipTor.stdout.trim());
        ipAddress = nipTor.stdout.trim();
        if (autoSocks5) {
            nipTor = await niptor([
                "systemctl restart tor && sleep 2 && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure",
            ]);
            if (nipTor.stdout.trim().length > 0) {
                console.log(colors.green("@info:"), "autoSocks5", colors.green("ipAddress"), nipTor.stdout.trim());
                ipAddress = nipTor.stdout.trim();
            }
            else
                throw new Error("Unable to connect to Tor.");
        }
        let respEngine = undefined;
        let videoId = await YouTubeID(query);
        let TubeBody;
        if (!videoId) {
            TubeBody = (await web.search.SearchVideos({
                type: "video",
                autoSocks5,
                verbose,
                query,
            }));
            if (!TubeBody[0]) {
                throw new Error("Unable to get response from YouTube.");
            }
            else {
                console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody[0].title));
                respEngine = await Engine({
                    query: TubeBody[0].videoLink,
                    autoSocks5,
                    ipAddress,
                });
                return respEngine;
            }
        }
        else {
            TubeBody = (await web.search.VideoInfo({
                autoSocks5,
                verbose,
                query,
            }));
            if (!TubeBody) {
                throw new Error("Unable to get response from YouTube.");
            }
            else {
                console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody.title));
                respEngine = await Engine({
                    query: TubeBody.videoLink,
                    autoSocks5,
                    ipAddress,
                });
                return respEngine;
            }
        }
    }
    catch (error) {
        if (error instanceof Error)
            throw new Error(error.message);
        else
            throw new Error("Internal server error");
    }
}

async function extract({ query, verbose, }) {
    try {
        const metaBody = await Agent({ query, verbose });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const uploadDate = new Date(metaBody.metaTube.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
        const currentDate = new Date();
        const daysAgo = Math.floor((currentDate.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
        const prettyDate = uploadDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const uploadAgoObject = calculateUploadAgo(daysAgo);
        const videoTimeInSeconds = metaBody.metaTube.duration;
        const videoDuration = calculateVideoDuration(videoTimeInSeconds);
        const viewCountFormatted = formatCount(metaBody.metaTube.view_count);
        const likeCountFormatted = formatCount(metaBody.metaTube.like_count);
        function calculateUploadAgo(days) {
            const years = Math.floor(days / 365);
            const months = Math.floor((days % 365) / 30);
            const remainingDays = days % 30;
            const formattedString = `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${remainingDays} days`;
            return { years, months, days: remainingDays, formatted: formattedString };
        }
        function calculateVideoDuration(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            const formattedString = `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${remainingSeconds} seconds`;
            return {
                hours,
                minutes,
                seconds: remainingSeconds,
                formatted: formattedString,
            };
        }
        function formatCount(count) {
            const abbreviations = ["K", "M", "B", "T"];
            for (let i = abbreviations.length - 1; i >= 0; i--) {
                const size = Math.pow(10, (i + 1) * 3);
                if (size <= count) {
                    const formattedCount = Math.round((count / size) * 10) / 10;
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
                channel_follower_count_formatted: formatCount(metaBody.metaTube.channel_follower_count),
            },
        };
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        return payload;
    }
    catch (error) {
        return {
            message: error.message || "An unexpected error occurred",
            status: 500,
        };
    }
}

function list_formats({ query, verbose, }) {
    return new Promise(async (resolve, reject) => {
        try {
            const zval = z__namespace
                .object({
                query: z__namespace.string().min(1),
            })
                .parse({ query, verbose });
            const EnResp = await Agent(zval);
            if (!EnResp)
                return reject("Unable to get response from YouTube...");
            const metaTube = (data) => data.filter((out) => !out.AVDownload.originalformat.includes("Premium"));
            const EnBody = {
                AudioFormatsData: metaTube(EnResp.AudioStore).map((out) => [
                    out.AVDownload.originalformat,
                    out.AVInfo.filesizebytes,
                    out.AVInfo.filesizeformatted,
                ]),
                VideoFormatsData: metaTube(EnResp.VideoStore).map((out) => [
                    out.AVDownload.originalformat,
                    out.AVInfo.filesizebytes,
                    out.AVInfo.filesizeformatted,
                ]),
                HdrVideoFormatsData: metaTube(EnResp.HDRVideoStore).map((out) => [
                    out.AVDownload.originalformat,
                    out.AVInfo.filesizebytes,
                    out.AVInfo.filesizeformatted,
                ]),
            };
            resolve(EnBody);
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
        catch (error) {
            reject(error instanceof z__namespace.ZodError ? error.errors : error);
        }
    });
}

async function extract_playlist_videos({ autoSocks5, playlistUrls, }) {
    try {
        let counter = 0;
        const metaTubeArr = [];
        await async__namespace.eachSeries(playlistUrls, async (listLink) => {
            const query = await YouTubeID(listLink);
            if (query === undefined) {
                console.error(colors.bold.red("@error: "), "invalid youtube playlist url:", listLink);
                return;
            }
            else {
                const resp = await web.search.PlaylistInfo({
                    query,
                    autoSocks5,
                });
                if (resp === undefined) {
                    console.error(colors.bold.red("@error: "), "unable to get response from youtube for", query);
                    return;
                }
                else {
                    console.log(colors.green("@info:"), "total videos in playlist", colors.green(resp.playlistTitle), resp.playlistVideoCount);
                    await async__namespace.eachSeries(resp.playlistVideos, async (vid) => {
                        const metaTube = await Agent({
                            query: vid.videoLink,
                        });
                        counter++;
                        console.log(colors.green("@info:"), "added", counter + "/" + resp.playlistVideoCount);
                        metaTubeArr.push(metaTube);
                    });
                }
            }
        });
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        return metaTubeArr;
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

function progressBar(prog) {
    if (prog.timemark === undefined || prog.percent === undefined)
        return;
    if (prog.percent < 1 && prog.timemark.includes("-"))
        return;
    readline.cursorTo(process.stdout, 0);
    let color = colors.green;
    if (prog.percent > 98)
        prog.percent = 100;
    if (prog.percent < 25)
        color = colors.red;
    else if (prog.percent < 50)
        color = colors.yellow;
    const width = Math.floor(process.stdout.columns / 4);
    const scomp = Math.round((width * prog.percent) / 100);
    const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
    let output = color("@prog: ") +
        sprog +
        " " +
        prog.percent.toFixed(2) +
        "% | " +
        color("@timemark: ") +
        prog.timemark;
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
async function proTube({ adata, vdata, ipAddress, }) {
    let max = 6;
    let dirC = __dirname;
    const ff = ffmpeg();
    let ffprobepath, ffmpegpath;
    while (max > 0) {
        ffprobepath = path__namespace.join(dirC, "util", "ffmpeg", "bin", "ffprobe");
        ffmpegpath = path__namespace.join(dirC, "util", "ffmpeg", "bin", "ffmpeg");
        switch (true) {
            case fs__namespace.existsSync(ffprobepath) && fs__namespace.existsSync(ffmpegpath):
                ff.setFfprobePath(ffprobepath);
                ff.setFfmpegPath(ffmpegpath);
                max = 0;
                break;
            default:
                dirC = path__namespace.join(dirC, "..");
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
    }
    else if (adata && !vdata) {
        ff.addInput(adata.AVDownload.mediaurl);
        if (adata.Audio.channels)
            ff.withAudioChannels(adata.Audio.channels);
        if (adata.Audio.bitrate)
            ff.withAudioBitrate(adata.Audio.bitrate);
    }
    else if (adata && vdata) {
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
    console.log(colors.green("@ffmpeg:"), "using", colors.green("ipAddress"), ipAddress);
    ff.addOption("-headers", `X-Forwarded-For: ${ipAddress}`);
    ff.on("progress", (progress) => progressBar(progress));
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("error", (error) => {
        throw new Error(error.message);
    });
    return ff;
}

async function lowEntry(metaBody) {
    const validEntries = metaBody.filter((entry) => entry.AVInfo.filesizebytes !== null &&
        entry.AVInfo.filesizebytes !== undefined &&
        !isNaN(entry.AVInfo.filesizebytes));
    const sortedByFileSize = [...validEntries].sort((a, b) => a.AVInfo.filesizebytes - b.AVInfo.filesizebytes);
    if (!sortedByFileSize[0])
        throw new Error("sorry no downloadable data found");
    else
        return sortedByFileSize[0];
}

/**
 * AudioHighest function is designed for fetching lowest audio content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply audio filters like echo, flanger, nightcore, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$h = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    filter: z.z
        .enum([
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
        "superspeed",
    ])
        .optional(),
});
async function AudioLowest(input) {
    try {
        const { query, output, stream, verbose, filter, autoSocks5 } = await qconf$h.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            let filename = "yt-dlx_(AudioLowest_";
            const ffmpeg = await proTube({
                adata: await lowEntry(engineData.AudioStore),
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.withOutputFormat("avi");
            switch (filter) {
                case "bassboost":
                    ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    filename += `bassboost)_${title}.avi`;
                    break;
                case "echo":
                    ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    filename += `echo)_${title}.avi`;
                    break;
                case "flanger":
                    ffmpeg.withAudioFilter(["flanger"]);
                    filename += `flanger)_${title}.avi`;
                    break;
                case "nightcore":
                    ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                    filename += `nightcore)_${title}.avi`;
                    break;
                case "panning":
                    ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
                    filename += `panning)_${title}.avi`;
                    break;
                case "phaser":
                    ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
                    filename += `phaser)_${title}.avi`;
                    break;
                case "reverse":
                    ffmpeg.withAudioFilter(["areverse"]);
                    filename += `reverse)_${title}.avi`;
                    break;
                case "slow":
                    ffmpeg.withAudioFilter(["atempo=0.8"]);
                    filename += `slow)_${title}.avi`;
                    break;
                case "speed":
                    ffmpeg.withAudioFilter(["atempo=2"]);
                    filename += `speed)_${title}.avi`;
                    break;
                case "subboost":
                    ffmpeg.withAudioFilter(["asubboost"]);
                    filename += `subboost)_${title}.avi`;
                    break;
                case "superslow":
                    ffmpeg.withAudioFilter(["atempo=0.5"]);
                    filename += `superslow)_${title}.avi`;
                    break;
                case "superspeed":
                    ffmpeg.withAudioFilter(["atempo=3"]);
                    filename += `superspeed)_${title}.avi`;
                    break;
                case "surround":
                    ffmpeg.withAudioFilter(["surround"]);
                    filename += `surround)_${title}.avi`;
                    break;
                case "vaporwave":
                    ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    filename += `vaporwave)_${title}.avi`;
                    break;
                case "vibrato":
                    ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
                    filename += `vibrato)_${title}.avi`;
                    break;
                default:
                    filename += `)_${title}.avi`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

async function bigEntry(metaBody) {
    const validEntries = metaBody.filter((entry) => entry.AVInfo.filesizebytes !== null &&
        entry.AVInfo.filesizebytes !== undefined &&
        !isNaN(entry.AVInfo.filesizebytes));
    const sortedByFileSize = [...validEntries].sort((a, b) => b.AVInfo.filesizebytes - a.AVInfo.filesizebytes);
    if (!sortedByFileSize[0])
        throw new Error("sorry no downloadable data found");
    else
        return sortedByFileSize[0];
}

/**
 * AudioHighest function is designed for fetching highest audio content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply audio filters like echo, flanger, nightcore, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$g = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    filter: z.z
        .enum([
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
        "superspeed",
    ])
        .optional(),
});
async function AudioHighest(input) {
    try {
        const { query, output, stream, verbose, filter, autoSocks5 } = await qconf$g.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            let filename = "yt-dlx_(AudioHighest_";
            const ffmpeg = await proTube({
                adata: await bigEntry(engineData.AudioStore),
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.withOutputFormat("avi");
            switch (filter) {
                case "bassboost":
                    ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    filename += `bassboost)_${title}.avi`;
                    break;
                case "echo":
                    ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    filename += `echo)_${title}.avi`;
                    break;
                case "flanger":
                    ffmpeg.withAudioFilter(["flanger"]);
                    filename += `flanger)_${title}.avi`;
                    break;
                case "nightcore":
                    ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                    filename += `nightcore)_${title}.avi`;
                    break;
                case "panning":
                    ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
                    filename += `panning)_${title}.avi`;
                    break;
                case "phaser":
                    ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
                    filename += `phaser)_${title}.avi`;
                    break;
                case "reverse":
                    ffmpeg.withAudioFilter(["areverse"]);
                    filename += `reverse)_${title}.avi`;
                    break;
                case "slow":
                    ffmpeg.withAudioFilter(["atempo=0.8"]);
                    filename += `slow)_${title}.avi`;
                    break;
                case "speed":
                    ffmpeg.withAudioFilter(["atempo=2"]);
                    filename += `speed)_${title}.avi`;
                    break;
                case "subboost":
                    ffmpeg.withAudioFilter(["asubboost"]);
                    filename += `subboost)_${title}.avi`;
                    break;
                case "superslow":
                    ffmpeg.withAudioFilter(["atempo=0.5"]);
                    filename += `superslow)_${title}.avi`;
                    break;
                case "superspeed":
                    ffmpeg.withAudioFilter(["atempo=3"]);
                    filename += `superspeed)_${title}.avi`;
                    break;
                case "surround":
                    ffmpeg.withAudioFilter(["surround"]);
                    filename += `surround)_${title}.avi`;
                    break;
                case "vaporwave":
                    ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    filename += `vaporwave)_${title}.avi`;
                    break;
                case "vibrato":
                    ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
                    filename += `vibrato)_${title}.avi`;
                    break;
                default:
                    filename += `)_${title}.avi`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

/**
 * AudioHighest function is designed for fetching custom quality audio content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply audio filters like echo, flanger, nightcore, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$f = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    quality: z.z.enum(["high", "medium", "low", "ultralow"]),
    filter: z.z
        .enum([
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
        "superspeed",
    ])
        .optional(),
});
async function AudioQualityCustom(input) {
    try {
        const { query, stream, verbose, output, quality, filter, autoSocks5 } = await qconf$f.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const customData = engineData.AudioStore.filter((op) => op.AVDownload.formatnote === quality);
            if (!customData) {
                throw new Error(colors.red("@error: ") + quality + " not found in the video.");
            }
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            const ffmpeg = await proTube({
                adata: await bigEntry(customData),
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.withOutputFormat("avi");
            let filename = `yt-dlx_(AudioQualityCustom_${quality}`;
            switch (filter) {
                case "bassboost":
                    ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    filename += `bassboost)_${title}.avi`;
                    break;
                case "echo":
                    ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    filename += `echo)_${title}.avi`;
                    break;
                case "flanger":
                    ffmpeg.withAudioFilter(["flanger"]);
                    filename += `flanger)_${title}.avi`;
                    break;
                case "nightcore":
                    ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                    filename += `nightcore)_${title}.avi`;
                    break;
                case "panning":
                    ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
                    filename += `panning)_${title}.avi`;
                    break;
                case "phaser":
                    ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
                    filename += `phaser)_${title}.avi`;
                    break;
                case "reverse":
                    ffmpeg.withAudioFilter(["areverse"]);
                    filename += `reverse)_${title}.avi`;
                    break;
                case "slow":
                    ffmpeg.withAudioFilter(["atempo=0.8"]);
                    filename += `slow)_${title}.avi`;
                    break;
                case "speed":
                    ffmpeg.withAudioFilter(["atempo=2"]);
                    filename += `speed)_${title}.avi`;
                    break;
                case "subboost":
                    ffmpeg.withAudioFilter(["asubboost"]);
                    filename += `subboost)_${title}.avi`;
                    break;
                case "superslow":
                    ffmpeg.withAudioFilter(["atempo=0.5"]);
                    filename += `superslow)_${title}.avi`;
                    break;
                case "superspeed":
                    ffmpeg.withAudioFilter(["atempo=3"]);
                    filename += `superspeed)_${title}.avi`;
                    break;
                case "surround":
                    ffmpeg.withAudioFilter(["surround"]);
                    filename += `surround)_${title}.avi`;
                    break;
                case "vaporwave":
                    ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    filename += `vaporwave)_${title}.avi`;
                    break;
                case "vibrato":
                    ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
                    filename += `vibrato)_${title}.avi`;
                    break;
                default:
                    filename += `)_${title}.avi`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$e = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    filter: z.z
        .enum([
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
        "superspeed",
    ])
        .optional(),
});
async function ListAudioLowest(input) {
    try {
        const { query, output, verbose, filter, autoSocks5 } = await qconf$e.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", video.videoLink);
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                let filename = "yt-dlx_(AudioLowest_";
                const ffmpeg = await proTube({
                    adata: await lowEntry(engineData.AudioStore),
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.withOutputFormat("avi");
                switch (filter) {
                    case "bassboost":
                        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                        filename += `bassboost)_${title}.avi`;
                        break;
                    case "echo":
                        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                        filename += `echo)_${title}.avi`;
                        break;
                    case "flanger":
                        ffmpeg.withAudioFilter(["flanger"]);
                        filename += `flanger)_${title}.avi`;
                        break;
                    case "nightcore":
                        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                        filename += `nightcore)_${title}.avi`;
                        break;
                    case "panning":
                        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
                        filename += `panning)_${title}.avi`;
                        break;
                    case "phaser":
                        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
                        filename += `phaser)_${title}.avi`;
                        break;
                    case "reverse":
                        ffmpeg.withAudioFilter(["areverse"]);
                        filename += `reverse)_${title}.avi`;
                        break;
                    case "slow":
                        ffmpeg.withAudioFilter(["atempo=0.8"]);
                        filename += `slow)_${title}.avi`;
                        break;
                    case "speed":
                        ffmpeg.withAudioFilter(["atempo=2"]);
                        filename += `speed)_${title}.avi`;
                        break;
                    case "subboost":
                        ffmpeg.withAudioFilter(["asubboost"]);
                        filename += `subboost)_${title}.avi`;
                        break;
                    case "superslow":
                        ffmpeg.withAudioFilter(["atempo=0.5"]);
                        filename += `superslow)_${title}.avi`;
                        break;
                    case "superspeed":
                        ffmpeg.withAudioFilter(["atempo=3"]);
                        filename += `superspeed)_${title}.avi`;
                        break;
                    case "surround":
                        ffmpeg.withAudioFilter(["surround"]);
                        filename += `surround)_${title}.avi`;
                        break;
                    case "vaporwave":
                        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                        filename += `vaporwave)_${title}.avi`;
                        break;
                    case "vibrato":
                        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
                        filename += `vibrato)_${title}.avi`;
                        break;
                    default:
                        filename += `)_${title}.avi`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$d = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    filter: z.z
        .enum([
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
        "superspeed",
    ])
        .optional(),
});
async function ListAudioHighest(input) {
    try {
        const { query, output, verbose, filter, autoSocks5 } = await qconf$d.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", video.videoLink);
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                let filename = "yt-dlx_(AudioHighest_";
                const ffmpeg = await proTube({
                    adata: await bigEntry(engineData.AudioStore),
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.withOutputFormat("avi");
                switch (filter) {
                    case "bassboost":
                        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                        filename += `bassboost)_${title}.avi`;
                        break;
                    case "echo":
                        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                        filename += `echo)_${title}.avi`;
                        break;
                    case "flanger":
                        ffmpeg.withAudioFilter(["flanger"]);
                        filename += `flanger)_${title}.avi`;
                        break;
                    case "nightcore":
                        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                        filename += `nightcore)_${title}.avi`;
                        break;
                    case "panning":
                        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
                        filename += `panning)_${title}.avi`;
                        break;
                    case "phaser":
                        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
                        filename += `phaser)_${title}.avi`;
                        break;
                    case "reverse":
                        ffmpeg.withAudioFilter(["areverse"]);
                        filename += `reverse)_${title}.avi`;
                        break;
                    case "slow":
                        ffmpeg.withAudioFilter(["atempo=0.8"]);
                        filename += `slow)_${title}.avi`;
                        break;
                    case "speed":
                        ffmpeg.withAudioFilter(["atempo=2"]);
                        filename += `speed)_${title}.avi`;
                        break;
                    case "subboost":
                        ffmpeg.withAudioFilter(["asubboost"]);
                        filename += `subboost)_${title}.avi`;
                        break;
                    case "superslow":
                        ffmpeg.withAudioFilter(["atempo=0.5"]);
                        filename += `superslow)_${title}.avi`;
                        break;
                    case "superspeed":
                        ffmpeg.withAudioFilter(["atempo=3"]);
                        filename += `superspeed)_${title}.avi`;
                        break;
                    case "surround":
                        ffmpeg.withAudioFilter(["surround"]);
                        filename += `surround)_${title}.avi`;
                        break;
                    case "vaporwave":
                        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                        filename += `vaporwave)_${title}.avi`;
                        break;
                    case "vibrato":
                        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
                        filename += `vibrato)_${title}.avi`;
                        break;
                    default:
                        filename += `)_${title}.avi`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$c = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    quality: z.z.enum(["high", "medium", "low", "ultralow"]),
    filter: z.z
        .enum([
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
        "superspeed",
    ])
        .optional(),
});
async function ListAudioQualityCustom(input) {
    try {
        const { query, output, verbose, quality, filter, autoSocks5 } = await qconf$c.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube.");
                    continue;
                }
                const customData = engineData.AudioStore.filter((op) => op.AVDownload.formatnote === quality);
                if (!customData) {
                    console.log(colors.red("@error: ") + quality + " not found in the video.");
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                let filename = `yt-dlx_(AudioQualityCustom_${quality}`;
                const ffmpeg = await proTube({
                    adata: await bigEntry(customData),
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.withOutputFormat("avi");
                switch (filter) {
                    case "bassboost":
                        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                        filename += `bassboost)_${title}.avi`;
                        break;
                    case "echo":
                        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                        filename += `echo)_${title}.avi`;
                        break;
                    case "flanger":
                        ffmpeg.withAudioFilter(["flanger"]);
                        filename += `flanger)_${title}.avi`;
                        break;
                    case "nightcore":
                        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                        filename += `nightcore)_${title}.avi`;
                        break;
                    case "panning":
                        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
                        filename += `panning)_${title}.avi`;
                        break;
                    case "phaser":
                        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
                        filename += `phaser)_${title}.avi`;
                        break;
                    case "reverse":
                        ffmpeg.withAudioFilter(["areverse"]);
                        filename += `reverse)_${title}.avi`;
                        break;
                    case "slow":
                        ffmpeg.withAudioFilter(["atempo=0.8"]);
                        filename += `slow)_${title}.avi`;
                        break;
                    case "speed":
                        ffmpeg.withAudioFilter(["atempo=2"]);
                        filename += `speed)_${title}.avi`;
                        break;
                    case "subboost":
                        ffmpeg.withAudioFilter(["asubboost"]);
                        filename += `subboost)_${title}.avi`;
                        break;
                    case "superslow":
                        ffmpeg.withAudioFilter(["atempo=0.5"]);
                        filename += `superslow)_${title}.avi`;
                        break;
                    case "superspeed":
                        ffmpeg.withAudioFilter(["atempo=3"]);
                        filename += `superspeed)_${title}.avi`;
                        break;
                    case "surround":
                        ffmpeg.withAudioFilter(["surround"]);
                        filename += `surround)_${title}.avi`;
                        break;
                    case "vaporwave":
                        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                        filename += `vaporwave)_${title}.avi`;
                        break;
                    case "vibrato":
                        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
                        filename += `vibrato)_${title}.avi`;
                        break;
                    default:
                        filename += `)_${title}.avi`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

/**
 * VideoHighest function is designed for fetching lowest video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$b = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function VideoLowest(input) {
    try {
        const { query, stream, verbose, output, filter, autoSocks5 } = await qconf$b.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            const ffmpeg = await proTube({
                vdata: await lowEntry(engineData.VideoStore),
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.addInput(engineData.metaTube.thumbnail);
            ffmpeg.withOutputFormat("matroska");
            let filename = "yt-dlx_(VideoLowest_";
            switch (filter) {
                case "grayscale":
                    ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    filename += `grayscale)_${title}.mkv`;
                    break;
                case "invert":
                    ffmpeg.withVideoFilter("negate");
                    filename += `invert)_${title}.mkv`;
                    break;
                case "rotate90":
                    ffmpeg.withVideoFilter("rotate=PI/2");
                    filename += `rotate90)_${title}.mkv`;
                    break;
                case "rotate180":
                    ffmpeg.withVideoFilter("rotate=PI");
                    filename += `rotate180)_${title}.mkv`;
                    break;
                case "rotate270":
                    ffmpeg.withVideoFilter("rotate=3*PI/2");
                    filename += `rotate270)_${title}.mkv`;
                    break;
                case "flipHorizontal":
                    ffmpeg.withVideoFilter("hflip");
                    filename += `flipHorizontal)_${title}.mkv`;
                    break;
                case "flipVertical":
                    ffmpeg.withVideoFilter("vflip");
                    filename += `flipVertical)_${title}.mkv`;
                    break;
                default:
                    filename += `)_${title}.mkv`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

/**
 * VideoHighest function is designed for fetching highest video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$a = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function VideoHighest(input) {
    try {
        const { query, stream, verbose, output, filter, autoSocks5 } = await qconf$a.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            const ffmpeg = await proTube({
                vdata: await bigEntry(engineData.VideoStore),
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.addInput(engineData.metaTube.thumbnail);
            ffmpeg.withOutputFormat("matroska");
            let filename = "yt-dlx_(VideoHighest_";
            switch (filter) {
                case "grayscale":
                    ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    filename += `grayscale)_${title}.mkv`;
                    break;
                case "invert":
                    ffmpeg.withVideoFilter("negate");
                    filename += `invert)_${title}.mkv`;
                    break;
                case "rotate90":
                    ffmpeg.withVideoFilter("rotate=PI/2");
                    filename += `rotate90)_${title}.mkv`;
                    break;
                case "rotate180":
                    ffmpeg.withVideoFilter("rotate=PI");
                    filename += `rotate180)_${title}.mkv`;
                    break;
                case "rotate270":
                    ffmpeg.withVideoFilter("rotate=3*PI/2");
                    filename += `rotate270)_${title}.mkv`;
                    break;
                case "flipHorizontal":
                    ffmpeg.withVideoFilter("hflip");
                    filename += `flipHorizontal)_${title}.mkv`;
                    break;
                case "flipVertical":
                    ffmpeg.withVideoFilter("vflip");
                    filename += `flipVertical)_${title}.mkv`;
                    break;
                default:
                    filename += `)_${title}.mkv`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

/**
 * VideoHighest function is designed for fetching custom resolution video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$9 = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    quality: z.z.enum([
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
        "12000p",
    ]),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function VideoQualityCustom(input) {
    try {
        const { query, stream, verbose, output, quality, filter, autoSocks5 } = await qconf$9.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const customData = engineData.VideoStore.filter((op) => op.AVDownload.formatnote === quality);
            if (!customData) {
                throw new Error(colors.red("@error: ") + quality + " not found in the video.");
            }
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            const ffmpeg = await proTube({
                vdata: await lowEntry(customData),
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.addInput(engineData.metaTube.thumbnail);
            ffmpeg.withOutputFormat("matroska");
            let filename = `yt-dlx_(VideoQualityCustom_${quality}`;
            switch (filter) {
                case "grayscale":
                    ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    filename += `grayscale)_${title}.mkv`;
                    break;
                case "invert":
                    ffmpeg.withVideoFilter("negate");
                    filename += `invert)_${title}.mkv`;
                    break;
                case "rotate90":
                    ffmpeg.withVideoFilter("rotate=PI/2");
                    filename += `rotate90)_${title}.mkv`;
                    break;
                case "rotate180":
                    ffmpeg.withVideoFilter("rotate=PI");
                    filename += `rotate180)_${title}.mkv`;
                    break;
                case "rotate270":
                    ffmpeg.withVideoFilter("rotate=3*PI/2");
                    filename += `rotate270)_${title}.mkv`;
                    break;
                case "flipHorizontal":
                    ffmpeg.withVideoFilter("hflip");
                    filename += `flipHorizontal)_${title}.mkv`;
                    break;
                case "flipVertical":
                    ffmpeg.withVideoFilter("vflip");
                    filename += `flipVertical)_${title}.mkv`;
                    break;
                default:
                    filename += `)_${title}.mkv`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$8 = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function ListVideoLowest(input) {
    try {
        const { query, output, verbose, filter, autoSocks5 } = await qconf$8.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube.");
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                let filename = "yt-dlx_(VideoLowest_";
                const ffmpeg = await proTube({
                    vdata: await lowEntry(engineData.VideoStore),
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.withOutputFormat("matroska");
                switch (filter) {
                    case "grayscale":
                        ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                        filename += `grayscale)_${title}.mkv`;
                        break;
                    case "invert":
                        ffmpeg.withVideoFilter("negate");
                        filename += `invert)_${title}.mkv`;
                        break;
                    case "rotate90":
                        ffmpeg.withVideoFilter("rotate=PI/2");
                        filename += `rotate90)_${title}.mkv`;
                        break;
                    case "rotate180":
                        ffmpeg.withVideoFilter("rotate=PI");
                        filename += `rotate180)_${title}.mkv`;
                        break;
                    case "rotate270":
                        ffmpeg.withVideoFilter("rotate=3*PI/2");
                        filename += `rotate270)_${title}.mkv`;
                        break;
                    case "flipHorizontal":
                        ffmpeg.withVideoFilter("hflip");
                        filename += `flipHorizontal)_${title}.mkv`;
                        break;
                    case "flipVertical":
                        ffmpeg.withVideoFilter("vflip");
                        filename += `flipVertical)_${title}.mkv`;
                        break;
                    default:
                        filename += `)_${title}.mkv`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$7 = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function ListVideoHighest(input) {
    try {
        const { query, verbose, output, filter, autoSocks5 } = await qconf$7.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube.");
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                let filename = "yt-dlx_(VideoHighest_";
                const ffmpeg = await proTube({
                    vdata: await bigEntry(engineData.VideoStore),
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.withOutputFormat("matroska");
                switch (filter) {
                    case "grayscale":
                        ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                        filename += `grayscale)_${title}.mkv`;
                        break;
                    case "invert":
                        ffmpeg.withVideoFilter("negate");
                        filename += `invert)_${title}.mkv`;
                        break;
                    case "rotate90":
                        ffmpeg.withVideoFilter("rotate=PI/2");
                        filename += `rotate90)_${title}.mkv`;
                        break;
                    case "rotate180":
                        ffmpeg.withVideoFilter("rotate=PI");
                        filename += `rotate180)_${title}.mkv`;
                        break;
                    case "rotate270":
                        ffmpeg.withVideoFilter("rotate=3*PI/2");
                        filename += `rotate270)_${title}.mkv`;
                        break;
                    case "flipHorizontal":
                        ffmpeg.withVideoFilter("hflip");
                        filename += `flipHorizontal)_${title}.mkv`;
                        break;
                    case "flipVertical":
                        ffmpeg.withVideoFilter("vflip");
                        filename += `flipVertical)_${title}.mkv`;
                        break;
                    default:
                        filename += `)_${title}.mkv`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$6 = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    quality: z.z.enum([
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
        "12000p",
    ]),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function ListVideoQualityCustom(input) {
    try {
        const { query, verbose, output, quality, filter, autoSocks5 } = await qconf$6.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube.");
                    continue;
                }
                const customData = engineData.VideoStore.filter((op) => op.AVDownload.formatnote === quality);
                if (!customData) {
                    console.log(colors.red("@error: ") + quality + " not found in the video.");
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                let filename = `yt-dlx_(VideoQualityCustom_${quality}`;
                const ffmpeg = await proTube({
                    vdata: await bigEntry(customData),
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.withOutputFormat("matroska");
                switch (filter) {
                    case "grayscale":
                        ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                        filename += `grayscale)_${title}.mkv`;
                        break;
                    case "invert":
                        ffmpeg.withVideoFilter("negate");
                        filename += `invert)_${title}.mkv`;
                        break;
                    case "rotate90":
                        ffmpeg.withVideoFilter("rotate=PI/2");
                        filename += `rotate90)_${title}.mkv`;
                        break;
                    case "rotate180":
                        ffmpeg.withVideoFilter("rotate=PI");
                        filename += `rotate180)_${title}.mkv`;
                        break;
                    case "rotate270":
                        ffmpeg.withVideoFilter("rotate=3*PI/2");
                        filename += `rotate270)_${title}.mkv`;
                        break;
                    case "flipHorizontal":
                        ffmpeg.withVideoFilter("hflip");
                        filename += `flipHorizontal)_${title}.mkv`;
                        break;
                    case "flipVertical":
                        ffmpeg.withVideoFilter("vflip");
                        filename += `flipVertical)_${title}.mkv`;
                        break;
                    default:
                        filename += `)_${title}.mkv`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

/**
 * AudioVideoHighest function is designed for fetching lowest audio & video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio & video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$5 = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function AudioVideoLowest(input) {
    try {
        const { query, stream, verbose, output, filter, autoSocks5 } = await qconf$5.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            const [AudioData, VideoData] = await Promise.all([
                lowEntry(engineData.AudioStore),
                lowEntry(engineData.VideoStore),
            ]);
            const ffmpeg = await proTube({
                adata: AudioData,
                vdata: VideoData,
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.addInput(AudioData.AVDownload.mediaurl);
            ffmpeg.withOutputFormat("matroska");
            let filename = "yt-dlx_(AudioVideoLowest_";
            switch (filter) {
                case "grayscale":
                    ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    filename += `grayscale)_${title}.mkv`;
                    break;
                case "invert":
                    ffmpeg.withVideoFilter("negate");
                    filename += `invert)_${title}.mkv`;
                    break;
                case "rotate90":
                    ffmpeg.withVideoFilter("rotate=PI/2");
                    filename += `rotate90)_${title}.mkv`;
                    break;
                case "rotate180":
                    ffmpeg.withVideoFilter("rotate=PI");
                    filename += `rotate180)_${title}.mkv`;
                    break;
                case "rotate270":
                    ffmpeg.withVideoFilter("rotate=3*PI/2");
                    filename += `rotate270)_${title}.mkv`;
                    break;
                case "flipHorizontal":
                    ffmpeg.withVideoFilter("hflip");
                    filename += `flipHorizontal)_${title}.mkv`;
                    break;
                case "flipVertical":
                    ffmpeg.withVideoFilter("vflip");
                    filename += `flipVertical)_${title}.mkv`;
                    break;
                default:
                    filename += `)_${title}.mkv`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

/**
 * AudioVideoHighest function is designed for fetching highest audio & video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio & video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$4 = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function AudioVideoHighest(input) {
    try {
        const { query, stream, verbose, output, filter, autoSocks5 } = await qconf$4.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            const [AudioData, VideoData] = await Promise.all([
                bigEntry(engineData.AudioStore),
                bigEntry(engineData.VideoStore),
            ]);
            const ffmpeg = await proTube({
                adata: AudioData,
                vdata: VideoData,
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.addInput(AudioData.AVDownload.mediaurl);
            ffmpeg.withOutputFormat("matroska");
            let filename = "yt-dlx_(AudioVideoHighest_";
            switch (filter) {
                case "grayscale":
                    ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    filename += `grayscale)_${title}.mkv`;
                    break;
                case "invert":
                    ffmpeg.withVideoFilter("negate");
                    filename += `invert)_${title}.mkv`;
                    break;
                case "rotate90":
                    ffmpeg.withVideoFilter("rotate=PI/2");
                    filename += `rotate90)_${title}.mkv`;
                    break;
                case "rotate180":
                    ffmpeg.withVideoFilter("rotate=PI");
                    filename += `rotate180)_${title}.mkv`;
                    break;
                case "rotate270":
                    ffmpeg.withVideoFilter("rotate=3*PI/2");
                    filename += `rotate270)_${title}.mkv`;
                    break;
                case "flipHorizontal":
                    ffmpeg.withVideoFilter("hflip");
                    filename += `flipHorizontal)_${title}.mkv`;
                    break;
                case "flipVertical":
                    ffmpeg.withVideoFilter("vflip");
                    filename += `flipVertical)_${title}.mkv`;
                    break;
                default:
                    filename += `)_${title}.mkv`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

/**
 * AudioVideoHighest function is designed for fetching custom audio & video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio & video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$3 = z.z.object({
    query: z.z.string().min(1),
    output: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    AQuality: z.z.enum(["high", "medium", "low", "ultralow"]),
    VQuality: z.z.enum([
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
        "12000p",
    ]),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function AudioVideoQualityCustom(input) {
    try {
        const { query, stream, verbose, output, VQuality, AQuality, filter, autoSocks5, } = await qconf$3.parseAsync(input);
        const engineData = await Agent({ query, verbose, autoSocks5 });
        if (engineData === undefined) {
            throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
        }
        else {
            const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path__namespace.join(process.cwd(), output) : process.cwd();
            if (!fs__namespace.existsSync(folder))
                fs__namespace.mkdirSync(folder, { recursive: true });
            const ACustomData = engineData.AudioStore.filter((op) => op.AVDownload.formatnote === AQuality);
            const VCustomData = engineData.VideoStore.filter((op) => op.AVDownload.formatnote === VQuality);
            const [AudioData, VideoData] = await Promise.all([
                bigEntry(ACustomData),
                bigEntry(VCustomData),
            ]);
            const ffmpeg = await proTube({
                adata: AudioData,
                vdata: VideoData,
                ipAddress: engineData.ipAddress,
            });
            ffmpeg.addInput(AudioData.AVDownload.mediaurl);
            ffmpeg.withOutputFormat("matroska");
            let filename = `yt-dlx_(AudioVideoQualityCustom_${VQuality}_${AQuality}`;
            switch (filter) {
                case "grayscale":
                    ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    filename += `grayscale)_${title}.mkv`;
                    break;
                case "invert":
                    ffmpeg.withVideoFilter("negate");
                    filename += `invert)_${title}.mkv`;
                    break;
                case "rotate90":
                    ffmpeg.withVideoFilter("rotate=PI/2");
                    filename += `rotate90)_${title}.mkv`;
                    break;
                case "rotate180":
                    ffmpeg.withVideoFilter("rotate=PI");
                    filename += `rotate180)_${title}.mkv`;
                    break;
                case "rotate270":
                    ffmpeg.withVideoFilter("rotate=3*PI/2");
                    filename += `rotate270)_${title}.mkv`;
                    break;
                case "flipHorizontal":
                    ffmpeg.withVideoFilter("hflip");
                    filename += `flipHorizontal)_${title}.mkv`;
                    break;
                case "flipVertical":
                    ffmpeg.withVideoFilter("vflip");
                    filename += `flipVertical)_${title}.mkv`;
                    break;
                default:
                    filename += `)_${title}.mkv`;
                    break;
            }
            if (stream) {
                return {
                    ffmpeg,
                    filename: output
                        ? path__namespace.join(folder, filename)
                        : filename.replace("_)_", ")_"),
                };
            }
            else {
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$2 = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function ListAudioVideoHighest(input) {
    try {
        const { query, verbose, output, filter, autoSocks5 } = await qconf$2.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube.");
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                const [AudioData, VideoData] = await Promise.all([
                    bigEntry(engineData.AudioStore),
                    bigEntry(engineData.VideoStore),
                ]);
                let filename = "yt-dlx_(AudioVideoHighest_";
                const ffmpeg = await proTube({
                    adata: AudioData,
                    vdata: VideoData,
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.withOutputFormat("matroska");
                switch (filter) {
                    case "grayscale":
                        ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                        filename += `grayscale)_${title}.mkv`;
                        break;
                    case "invert":
                        ffmpeg.withVideoFilter("negate");
                        filename += `invert)_${title}.mkv`;
                        break;
                    case "rotate90":
                        ffmpeg.withVideoFilter("rotate=PI/2");
                        filename += `rotate90)_${title}.mkv`;
                        break;
                    case "rotate180":
                        ffmpeg.withVideoFilter("rotate=PI");
                        filename += `rotate180)_${title}.mkv`;
                        break;
                    case "rotate270":
                        ffmpeg.withVideoFilter("rotate=3*PI/2");
                        filename += `rotate270)_${title}.mkv`;
                        break;
                    case "flipHorizontal":
                        ffmpeg.withVideoFilter("hflip");
                        filename += `flipHorizontal)_${title}.mkv`;
                        break;
                    case "flipVertical":
                        ffmpeg.withVideoFilter("vflip");
                        filename += `flipVertical)_${title}.mkv`;
                        break;
                    default:
                        filename += `)_${title}.mkv`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf$1 = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function ListAudioVideoLowest(input) {
    try {
        const { query, verbose, output, filter, autoSocks5 } = await qconf$1.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube.");
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                const [AudioData, VideoData] = await Promise.all([
                    lowEntry(engineData.AudioStore),
                    lowEntry(engineData.VideoStore),
                ]);
                let filename = "yt-dlx_(AudioVideoLowest_";
                const ffmpeg = await proTube({
                    adata: AudioData,
                    vdata: VideoData,
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.addInput(AudioData.AVDownload.mediaurl);
                ffmpeg.withOutputFormat("matroska");
                switch (filter) {
                    case "grayscale":
                        ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                        filename += `grayscale)_${title}.mkv`;
                        break;
                    case "invert":
                        ffmpeg.withVideoFilter("negate");
                        filename += `invert)_${title}.mkv`;
                        break;
                    case "rotate90":
                        ffmpeg.withVideoFilter("rotate=PI/2");
                        filename += `rotate90)_${title}.mkv`;
                        break;
                    case "rotate180":
                        ffmpeg.withVideoFilter("rotate=PI");
                        filename += `rotate180)_${title}.mkv`;
                        break;
                    case "rotate270":
                        ffmpeg.withVideoFilter("rotate=3*PI/2");
                        filename += `rotate270)_${title}.mkv`;
                        break;
                    case "flipHorizontal":
                        ffmpeg.withVideoFilter("hflip");
                        filename += `flipHorizontal)_${title}.mkv`;
                        break;
                    case "flipVertical":
                        ffmpeg.withVideoFilter("vflip");
                        filename += `flipVertical)_${title}.mkv`;
                        break;
                    default:
                        filename += `)_${title}.mkv`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const qconf = z.z.object({
    output: z.z.string().optional(),
    verbose: z.z.boolean().optional(),
    autoSocks5: z.z.boolean().optional(),
    query: z.z
        .array(z.z
        .string()
        .min(1)
        .refine(async (input) => {
        switch (true) {
            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined)
                    return true;
                break;
            default:
                const resultId = await YouTubeID(`https://www.youtube.com/playlist?list=${input}`);
                if (resultId !== undefined)
                    return true;
                break;
        }
        return false;
    }, {
        message: "Query must be a valid YouTube Playlist Link or ID.",
    }))
        .min(1),
    AQuality: z.z.enum(["high", "medium", "low", "ultralow"]),
    VQuality: z.z.enum([
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
        "12000p",
    ]),
    filter: z.z
        .enum([
        "invert",
        "rotate90",
        "rotate270",
        "grayscale",
        "rotate180",
        "flipVertical",
        "flipHorizontal",
    ])
        .optional(),
});
async function ListAudioVideoQualityCustom(input) {
    try {
        const { query, verbose, output, VQuality, AQuality, filter, autoSocks5 } = await qconf.parseAsync(input);
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = await web.search.PlaylistInfo({
                    query: pURL,
                    autoSocks5,
                });
                if (pDATA === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = await Agent({
                    query: video.videoLink,
                    autoSocks5,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors.red("@error:"), "unable to get response from youtube.");
                    continue;
                }
                const title = engineData.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output
                    ? path__namespace.join(process.cwd(), output)
                    : process.cwd();
                if (!fs__namespace.existsSync(folder))
                    fs__namespace.mkdirSync(folder, { recursive: true });
                const ACustomData = engineData.AudioStore.filter((op) => op.AVDownload.formatnote === AQuality);
                const VCustomData = engineData.VideoStore.filter((op) => op.AVDownload.formatnote === VQuality);
                const [AudioData, VideoData] = await Promise.all([
                    bigEntry(ACustomData),
                    bigEntry(VCustomData),
                ]);
                let filename = "yt-dlx_(AudioVideoQualityCustom_";
                const ffmpeg = await proTube({
                    adata: AudioData,
                    vdata: VideoData,
                    ipAddress: engineData.ipAddress,
                });
                ffmpeg.addInput(AudioData.AVDownload.mediaurl);
                ffmpeg.withOutputFormat("matroska");
                switch (filter) {
                    case "grayscale":
                        ffmpeg.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                        filename += `grayscale)_${title}.mkv`;
                        break;
                    case "invert":
                        ffmpeg.withVideoFilter("negate");
                        filename += `invert)_${title}.mkv`;
                        break;
                    case "rotate90":
                        ffmpeg.withVideoFilter("rotate=PI/2");
                        filename += `rotate90)_${title}.mkv`;
                        break;
                    case "rotate180":
                        ffmpeg.withVideoFilter("rotate=PI");
                        filename += `rotate180)_${title}.mkv`;
                        break;
                    case "rotate270":
                        ffmpeg.withVideoFilter("rotate=3*PI/2");
                        filename += `rotate270)_${title}.mkv`;
                        break;
                    case "flipHorizontal":
                        ffmpeg.withVideoFilter("hflip");
                        filename += `flipHorizontal)_${title}.mkv`;
                        break;
                    case "flipVertical":
                        ffmpeg.withVideoFilter("vflip");
                        filename += `flipVertical)_${title}.mkv`;
                        break;
                    default:
                        filename += `)_${title}.mkv`;
                        break;
                }
                await new Promise((resolve, _reject) => {
                    ffmpeg.output(path__namespace.join(folder, filename.replace("_)_", ")_")));
                    ffmpeg.on("end", () => resolve());
                    ffmpeg.on("error", (error) => {
                        throw new Error(colors.red("@error: ") + error.message);
                    });
                    ffmpeg.run();
                });
            }
            catch (error) {
                console.log(colors.red("@error:"), error);
                continue;
            }
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
    catch (error) {
        switch (true) {
            case error instanceof z.ZodError:
                throw error.errors.map((err) => err.message).join(", ");
            case error instanceof Error:
                throw error.message;
            default:
                throw "Internal server error";
        }
    }
}

const ytdlx = () => ({
    search: () => ({
        VideoInfo: web.search.VideoInfo,
        PlaylistInfo: web.search.PlaylistInfo,
        SearchVideos: web.search.SearchVideos,
    }),
    info: () => ({
        help,
        extract,
        list_formats,
        extract_playlist_videos,
    }),
    AudioOnly: () => ({
        Single: () => ({
            Lowest: AudioLowest,
            Highest: AudioHighest,
            Custom: AudioQualityCustom,
        }),
        List: () => ({
            Lowest: ListAudioLowest,
            Highest: ListAudioHighest,
            Custom: ListAudioQualityCustom,
        }),
    }),
    VideoOnly: () => ({
        Single: () => ({
            Lowest: VideoLowest,
            Highest: VideoHighest,
            Custom: VideoQualityCustom,
        }),
        List: () => ({
            Lowest: ListVideoLowest,
            Highest: ListVideoHighest,
            Custom: ListVideoQualityCustom,
        }),
    }),
    AudioVideo: () => ({
        Single: () => ({
            Lowest: AudioVideoLowest,
            Highest: AudioVideoHighest,
            Custom: AudioVideoQualityCustom,
        }),
        List: () => ({
            Lowest: ListAudioVideoHighest,
            Highest: ListAudioVideoLowest,
            Custom: ListAudioVideoQualityCustom,
        }),
    }),
});

module.exports = ytdlx;
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
