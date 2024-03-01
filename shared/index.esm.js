/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
import * as fs from 'fs';
import fs__default from 'fs';
import colors from 'colors';
import { load } from 'cheerio';
import retry from 'async-retry';
import spinClient from 'spinnies';
import * as z from 'zod';
import { z as z$1, ZodError } from 'zod';
import { randomUUID } from 'crypto';
import puppeteer from 'puppeteer';
import * as path from 'path';
import { promisify } from 'util';
import { exec, execSync } from 'child_process';
import fluentffmpeg from 'fluent-ffmpeg';
import { Readable, Writable } from 'stream';
import readline from 'readline';
import async from 'async';

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
async function crawler() {
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-zygote", // Disables the use of the zygote process for forking child processes
                "--incognito", // Launch Chrome in incognito mode to avoid cookies and cache interference
                "--no-sandbox", // Disable the sandbox mode (useful for running in Docker containers)
                "--enable-automation", // Enable automation in Chrome (e.g., for Selenium)
                "--disable-dev-shm-usage", // Disable /dev/shm usage (useful for running in Docker containers)
            ],
        });
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
                throw new Error(colors.red("@error: ") + error.message);
            default:
                throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

async function SearchVideos(input) {
    try {
        await crawler();
        const QuerySchema = z$1.object({
            query: z$1
                .string()
                .min(1)
                .refine(async (query) => {
                const result = await YouTubeID(query);
                return result === undefined;
            }, {
                message: "Query must not be a YouTube video/Playlist link",
            }),
            screenshot: z$1.boolean().optional(),
        });
        const { query, screenshot } = await QuerySchema.parseAsync(input);
        const retryOptions = {
            maxTimeout: 6000,
            minTimeout: 1000,
            retries: 4,
        };
        let url;
        let $;
        const spin = randomUUID();
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
                        fs__default.writeFileSync("TypeVideo.png", snapshot);
                        spinnies.update(spin, {
                            text: colors.yellow("@scrape: ") + "took snapshot...",
                        });
                    }
                    content = await page.content();
                    $ = load(content);
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
                        text: colors.green("@info: ") + colors.white("scrapping done"),
                    });
                    if (page)
                        await page.close();
                    if (browser)
                        await browser.close();
                    return metaTube;
                }, retryOptions);
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
                        fs__default.writeFileSync("TypePlaylist.png", snapshot);
                        spinnies.update(spin, {
                            text: colors.yellow("@scrape: ") + "took snapshot...",
                        });
                    }
                    const content = await page.content();
                    const $ = load(content);
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
                        text: colors.green("@info: ") + colors.white("scrapping done"),
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
                    text: colors.red("@error: ") +
                        colors.white("wrong filter type provided."),
                });
                if (page)
                    await page.close();
                if (browser)
                    await browser.close();
                return undefined;
        }
    }
    catch (error) {
        if (page)
            await page.close();
        if (browser)
            await browser.close();
        switch (true) {
            case error instanceof ZodError:
                throw new Error(colors.red("@error: ") +
                    error.errors.map((error) => error.message).join(", "));
            case error instanceof Error:
                throw new Error(colors.red("@error: ") + error.message);
            default:
                throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

async function PlaylistInfo(input) {
    try {
        await crawler();
        let query;
        const spinnies = new spinClient();
        const QuerySchema = z$1.object({
            query: z$1
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
            screenshot: z$1.boolean().optional(),
        });
        const { screenshot } = await QuerySchema.parseAsync(input);
        const retryOptions = {
            maxTimeout: 6000,
            minTimeout: 1000,
            retries: 4,
        };
        let metaTube = [];
        const spin = randomUUID();
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
                fs__default.writeFileSync("FilterVideo.png", snapshot);
                spinnies.update(spin, {
                    text: colors.yellow("@scrape: ") + "took snapshot...",
                });
            }
            const content = await page.content();
            const $ = load(content);
            const playlistTitle = $("yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string")
                .text()
                .trim();
            const videoCountText = $("yt-formatted-string.byline-item").text();
            const playlistVideoCount = parseInt(videoCountText.match(/\d+/)[0]);
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
                text: colors.green("@info: ") + colors.white("scrapping done"),
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
    }
    catch (error) {
        if (page)
            await page.close();
        if (browser)
            await browser.close();
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

async function VideoInfo(input) {
    try {
        await crawler();
        let query;
        const spinnies = new spinClient();
        const QuerySchema = z$1.object({
            query: z$1
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
            screenshot: z$1.boolean().optional(),
        });
        const { screenshot } = await QuerySchema.parseAsync(input);
        const retryOptions = {
            maxTimeout: 6000,
            minTimeout: 1000,
            retries: 4,
        };
        let TubeResp;
        const spin = randomUUID();
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
                fs__default.writeFileSync("FilterVideo.png", snapshot);
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
            const $ = load(htmlContent);
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
                text: colors.green("@info: ") + colors.white("scrapping done"),
            });
            await page.close();
            await browser.close();
            return metaTube;
        }, retryOptions);
        return TubeResp;
    }
    catch (error) {
        if (page)
            await page.close();
        if (browser)
            await browser.close();
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

const web = {
    search: {
        SearchVideos,
        PlaylistInfo,
        VideoInfo,
    },
};

function help() {
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
┃               ┃   flanger                    nightdlp                                                        ┃
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
async function Engine(query) {
    try {
        let pushTube = [];
        let proLoc = "";
        let maxTries = 6;
        let currentDir = __dirname;
        while (maxTries > 0) {
            const enginePath = path.join(currentDir, "util", "engine");
            if (fs.existsSync(enginePath)) {
                proLoc = enginePath;
                break;
            }
            else {
                currentDir = path.join(currentDir, "..");
                maxTries--;
            }
        }
        if (proLoc !== "") {
            proLoc += ` --dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
            proLoc += ` --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'`;
            proLoc += ` '${query}'`;
        }
        else {
            throw new Error(colors.red("@error: ") + "could not find the engine file.");
        }
        const result = await promisify(exec)(proLoc);
        const metaTube = await JSON.parse(result.stdout.toString());
        await metaTube.formats.forEach((io) => {
            const rmval = new Set(["storyboard", "Default"]);
            if (rmval.has(io.format_note) && io.filesize === undefined)
                return;
            const reTube = {
                meta_audio: {
                    samplerate: io.asr,
                    channels: io.audio_channels,
                    codec: io.acodec,
                    extension: io.audio_ext,
                    bitrate: io.abr,
                },
                meta_video: {
                    bitrate: io.vbr,
                    width: io.width,
                    codec: io.vcodec,
                    height: io.height,
                    extension: io.video_ext,
                    resolution: io.resolution,
                    aspectratio: io.aspect_ratio,
                },
                meta_dl: {
                    mediaurl: io.url,
                    formatid: io.format_id,
                    formatnote: io.format_note,
                    originalformat: io.format.replace(/[-\s]+/g, "_").replace(/_/g, "_"),
                },
                meta_info: {
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
            if (reTube.meta_dl.formatnote) {
                switch (true) {
                    case (reTube.meta_dl.formatnote.includes("ultralow") ||
                        reTube.meta_dl.formatnote.includes("medium") ||
                        reTube.meta_dl.formatnote.includes("high") ||
                        reTube.meta_dl.formatnote.includes("low")) &&
                        reTube.meta_video.resolution &&
                        reTube.meta_video.resolution.includes("audio"):
                        pushTube.push({ Tube: "AudioStore", reTube });
                        break;
                    case reTube.meta_dl.formatnote.includes("HDR"):
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
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}
// import * as bun from "bun";
// import retry from "async-retry";
// function sizeFormat(filesize: number) {
// if (isNaN(filesize) || filesize < 0) return filesize;
// const bytesPerMegabyte = 1024 * 1024;
// const bytesPerGigabyte = bytesPerMegabyte * 1024;
// const bytesPerTerabyte = bytesPerGigabyte * 1024;
// if (filesize < bytesPerMegabyte) return filesize + " B";
// else if (filesize < bytesPerGigabyte) {
// return (filesize / bytesPerMegabyte).toFixed(2) + " MB";
// } else if (filesize < bytesPerTerabyte) {
// return (filesize / bytesPerGigabyte).toFixed(2) + " GB";
// } else return (filesize / bytesPerTerabyte).toFixed(2) + " TB";
// }
// export default async function Engine(url: string): Promise<any> {
// try {
// const metaTube = await retry(
// async (bail) => {
// const result =
// await bun.$`util/Engine --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36" --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass --no-update --dump-json "${url}"`.json();
// if (!result) bail(new Error(result));
// else return result;
// },
// {
// factor: 2,
// retries: 4,
// minTimeout: 1000,
// maxTimeout: 4000,
// randomize: false,
// }
// );
// if (metaTube) {
// delete metaTube.automatic_captions;
// delete metaTube.requested_formats;
// delete metaTube._filename;
// delete metaTube.subtitles;
// delete metaTube.filename;
// delete metaTube._version;
// delete metaTube.heatmap;
// delete metaTube._type;
// let pushTube: any[] = [];
// metaTube.formats.forEach((core: any) => {
// const rmval = new Set(["storyboard", "Default"]);
// if (rmval.has(core.format_note) && core.filesize === undefined) return;
// const reTube: any = {
// meta_audio: {
// bitrate: core.abr,
// codec: core.acodec,
// samplerate: core.asr,
// extension: core.audio_ext,
// channels: core.audio_channels,
// },
// meta_video: {
// bitrate: core.vbr,
// width: core.width,
// codec: core.vcodec,
// height: core.height,
// extension: core.video_ext,
// resolution: core.resolution,
// aspectratio: core.aspect_ratio,
// },
// meta_dl: {
// mediaurl: core.url,
// originalformat: core.format
// .replace(/[-\s]+/g, "_")
// .replace(/_/g, "_"),
// formatid: core.format_id,
// formatnote: core.format_note,
// },
// meta_info: {
// framespersecond: core.fps,
// totalbitrate: core.tbr,
// qriginalextension: core.ext,
// filesizebytes: core.filesize,
// dynamicrange: core.dynamic_range,
// extensionconatainer: core.container,
// filesizeformatted: sizeFormat(core.filesize),
// },
// };
// pushTube.push({
// Tube: "metaTube",
// reTube: {
// id: metaTube.id,
// title: metaTube.title,
// channel: metaTube.channel,
// uploader: metaTube.uploader,
// duration: metaTube.duration,
// thumbnail: metaTube.thumbnail,
// age_limit: metaTube.age_limit,
// channel_id: metaTube.channel_id,
// categories: metaTube.categories,
// display_id: metaTube.display_id,
// description: metaTube.description,
// channel_url: metaTube.channel_url,
// webpage_url: metaTube.webpage_url,
// live_status: metaTube.live_status,
// upload_date: metaTube.upload_date,
// uploader_id: metaTube.uploader_id,
// original_url: metaTube.original_url,
// uploader_url: metaTube.uploader_url,
// duration_string: metaTube.duration_string,
// },
// });
// if (reTube.meta_dl.formatnote) {
// switch (true) {
// case (reTube.meta_dl.formatnote.includes("ultralow") ||
// reTube.meta_dl.formatnote.includes("medium") ||
// reTube.meta_dl.formatnote.includes("high") ||
// reTube.meta_dl.formatnote.includes("low")) &&
// reTube.meta_video.resolution &&
// reTube.meta_video.resolution.includes("audio"):
// pushTube.push({ Tube: "AudioStore", reTube });
// break;
// case reTube.meta_dl.formatnote.includes("HDR"):
// pushTube.push({ Tube: "HDRVideoStore", reTube });
// break;
// default:
// pushTube.push({ Tube: "VideoStore", reTube });
// break;
// }
// }
// });
// return {
// AudioStore:
// pushTube
// .filter((item: { Tube: string }) => item.Tube === "AudioStore")
// .map((item: { reTube: any }) => item.reTube) || undefined,
// VideoStore:
// pushTube
// .filter((item: { Tube: string }) => item.Tube === "VideoStore")
// .map((item: { reTube: any }) => item.reTube) || undefined,
// HDRVideoStore:
// pushTube
// .filter((item: { Tube: string }) => item.Tube === "HDRVideoStore")
// .map((item: { reTube: any }) => item.reTube) || undefined,
// metaTube:
// pushTube
// .filter((item: { Tube: string }) => item.Tube === "metaTube")
// .map((item: { reTube: any }) => item.reTube)[0] || undefined,
// };
// } else return undefined;
// } catch (error) {
// console.error("@error:", error);
// return undefined;
// }
// }

var version = "3.0.0";

async function Agent({ query, }) {
    try {
        let videoId;
        let respEngine = undefined;
        let TubeBody;
        console.log(colors.green("@info: ") + `using yt-dlx version ${version}`);
        switch (true) {
            case !query || query.trim() === "":
                throw new Error(colors.red("@error: ") + "'query' is required.");
            case /https/i.test(query) && /list/i.test(query):
                throw new Error(colors.red("@error: ") + "use extract_playlist_videos().");
            case /https/i.test(query) && !/list/i.test(query):
                videoId = await YouTubeID(query);
                break;
            default:
                videoId = await YouTubeID(query);
        }
        console.log(colors.green("@info: ") + `fetching metadata for ${query}`);
        switch (videoId) {
            case undefined:
                TubeBody = (await web.search.SearchVideos({
                    query: query,
                    type: "video",
                }));
                if (!TubeBody || TubeBody.length === 0) {
                    throw new Error(colors.red("@error: ") + "no data returned from server.");
                }
                else if (TubeBody[0]) {
                    console.log(colors.green("@info: ") +
                        `preparing payload for ${TubeBody[0].title}`);
                    respEngine = await Engine(TubeBody[0].videoLink);
                }
                else {
                    throw new Error(colors.red("@error: ") + "no data returned from server.");
                }
                break;
            default:
                TubeBody = (await web.search.VideoInfo({
                    query: query,
                }));
                if (!TubeBody) {
                    throw new Error(colors.red("@error: ") + "no data returned from server.");
                }
                console.log(colors.green("@info: ") + `preparing payload for ${TubeBody.title}`);
                respEngine = await Engine(TubeBody.videoLink);
                break;
        }
        if (respEngine === undefined) {
            throw new Error(colors.red("@error: ") + "no data returned from server.");
        }
        else {
            console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
            return respEngine;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

async function extract({ query }) {
    try {
        const metaBody = await Agent({ query });
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
        return payload;
    }
    catch (error) {
        return {
            message: error.message || "An unexpected error occurred",
            status: 500,
        };
    }
}

async function get_playlist({ playlistUrls, }) {
    try {
        const proTubeArr = [];
        const preTube = new Set();
        for (const videoLink of playlistUrls) {
            const ispUrl = videoLink.match(/list=([a-zA-Z0-9_-]+)/);
            if (!ispUrl) {
                console.error(colors.bold.red("@error: "), "Invalid YouTube Playlist URL:", videoLink);
                continue;
            }
            const resp = await web.search.PlaylistInfo({
                query: ispUrl[1],
            });
            if (resp === undefined) {
                console.error(colors.bold.red("@error: "), "Invalid Data Found For:", ispUrl[1]);
                continue;
            }
            for (let i = 0; i < resp.playlistVideos.length; i++) {
                try {
                    const videoLink = resp.playlistVideos[i]?.videoLink;
                    if (videoLink === undefined)
                        continue;
                    const metaTube = await web.search.VideoInfo({ query: videoLink });
                    if (metaTube === undefined)
                        continue;
                    console.log(colors.bold.green("INFO:"), colors.bold.green("<("), metaTube.title, colors.bold.green("by"), metaTube.author, colors.bold.green(")>"));
                    if (preTube.has(metaTube.videoId))
                        continue;
                    proTubeArr.push({ ...metaTube });
                }
                catch (error) {
                    console.error(colors.bold.red("@error: "), error);
                }
            }
        }
        return proTubeArr;
    }
    catch (error) {
        return error instanceof z.ZodError ? error.errors : error;
    }
}

function list_formats({ query, }) {
    return new Promise(async (resolve, reject) => {
        try {
            const zval = z
                .object({
                query: z.string().min(1),
            })
                .parse({ query });
            const EnResp = await Agent(zval);
            if (!EnResp)
                return reject("Unable to get response from YouTube...");
            const metaTube = (data) => data.filter((out) => !out.meta_dl.originalformat.includes("Premium"));
            const EnBody = {
                AudioFormatsData: metaTube(EnResp.AudioStore).map((out) => [
                    out.meta_dl.originalformat,
                    out.meta_info.filesizebytes,
                    out.meta_info.filesizeformatted,
                ]),
                VideoFormatsData: metaTube(EnResp.VideoStore).map((out) => [
                    out.meta_dl.originalformat,
                    out.meta_info.filesizebytes,
                    out.meta_info.filesizeformatted,
                ]),
                HdrVideoFormatsData: metaTube(EnResp.HDRVideoStore).map((out) => [
                    out.meta_dl.originalformat,
                    out.meta_info.filesizebytes,
                    out.meta_info.filesizeformatted,
                ]),
            };
            resolve(EnBody);
        }
        catch (error) {
            reject(error instanceof z.ZodError ? error.errors : error);
        }
    });
}

function get_video_data({ query, }) {
    return new Promise(async (resolve, reject) => {
        try {
            const zval = z
                .object({
                query: z.string().min(1),
            })
                .parse({ query });
            const EnResp = await Agent(zval);
            if (!EnResp)
                return reject("Unable to get response from YouTube...");
            const uploadDate = EnResp.metaTube.upload_date;
            const uploadDateFormatted = new Date(uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
            const currentDate = new Date();
            const daysAgo = Math.floor((currentDate.getTime() - uploadDateFormatted.getTime()) /
                (1000 * 60 * 60 * 24));
            const prettyDate = new Date(uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            const uploadAgoObject = calculateUploadAgo(daysAgo);
            const videoTimeInSeconds = EnResp.metaTube.duration;
            const videoDuration = calculateVideoDuration(videoTimeInSeconds);
            const viewCountFormatted = formatCount(EnResp.metaTube.view_count);
            const likeCountFormatted = formatCount(EnResp.metaTube.like_count);
            function calculateUploadAgo(days) {
                const years = Math.floor(days / 365);
                const months = Math.floor((days % 365) / 30);
                const remainingDays = days % 30;
                const formattedString = `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${remainingDays} days`;
                return {
                    years,
                    months,
                    days: remainingDays,
                    formatted: formattedString,
                };
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
                z;
            }
            resolve({
                id: EnResp.metaTube.id,
                original_url: EnResp.metaTube.original_url,
                webpage_url: EnResp.metaTube.webpage_url,
                title: EnResp.metaTube.title,
                view_count: EnResp.metaTube.view_count,
                like_count: EnResp.metaTube.like_count,
                view_count_formatted: viewCountFormatted,
                like_count_formatted: likeCountFormatted,
                uploader: EnResp.metaTube.uploader,
                uploader_id: EnResp.metaTube.uploader_id,
                uploader_url: EnResp.metaTube.uploader_url,
                thumbnail: EnResp.metaTube.thumbnail,
                categories: EnResp.metaTube.categories,
                time: videoTimeInSeconds,
                duration: videoDuration,
                age_limit: EnResp.metaTube.age_limit,
                live_status: EnResp.metaTube.live_status,
                description: EnResp.metaTube.description,
                full_description: EnResp.metaTube.description,
                upload_date: prettyDate,
                upload_ago: daysAgo,
                upload_ago_formatted: uploadAgoObject,
                comment_count: EnResp.metaTube.comment_count,
                comment_count_formatted: formatCount(EnResp.metaTube.comment_count),
                channel_id: EnResp.metaTube.channel_id,
                channel_name: EnResp.metaTube.channel,
                channel_url: EnResp.metaTube.channel_url,
                channel_follower_count: EnResp.metaTube.channel_follower_count,
                channel_follower_count_formatted: formatCount(EnResp.metaTube.channel_follower_count),
            });
        }
        catch (error) {
            reject(error instanceof z.ZodError ? error.errors : error);
        }
    });
}

async function extract_playlist_videos({ playlistUrls, }) {
    try {
        const proTubeArr = [];
        const processedVideoIds = new Set();
        for (const videoLink of playlistUrls) {
            const ispUrl = videoLink.match(/list=([a-zA-Z0-9_-]+)/);
            if (!ispUrl) {
                console.error(colors.bold.red("@error: "), "Invalid YouTube Playlist URL:", videoLink);
                continue;
            }
            const resp = await web.search.PlaylistInfo({
                query: ispUrl[1],
            });
            if (resp === undefined) {
                console.error(colors.bold.red("@error: "), "Invalid Data Found For:", ispUrl[1]);
                continue;
            }
            for (let i = 0; i < resp.playlistVideos.length; i++) {
                try {
                    const videoId = resp.playlistVideos[i]?.videoId;
                    if (videoId === undefined)
                        continue;
                    if (processedVideoIds.has(videoId))
                        continue;
                    const data = await Agent({ query: videoId });
                    if (data instanceof Array)
                        proTubeArr.push(...data);
                    else
                        proTubeArr.push(data);
                    processedVideoIds.add(videoId);
                }
                catch (error) {
                    console.error(colors.bold.red("@error: "), error);
                }
            }
        }
        return proTubeArr;
    }
    catch (error) {
        return error instanceof z.ZodError ? error.errors : error;
    }
}

async function ffmpeg() {
    try {
        return new Promise(async (resolve) => {
            let proc = fluentffmpeg();
            try {
                const ffmpegPath = execSync("which ffmpeg").toString().trim();
                const ffprobePath = execSync("which ffprobe").toString().trim();
                if (fs.existsSync(ffmpegPath) && fs.existsSync(ffprobePath)) {
                    proc.setFfprobePath(ffprobePath);
                    proc.setFfmpegPath(ffmpegPath);
                }
                else {
                    throw new Error(colors.red("@error: ") +
                        "could not find the ffmpeg & ffprobe files.");
                }
            }
            catch (error) {
                throw new Error(colors.red("@error: ") +
                    "An error occurred while locating ffmpeg & ffprobe executables.");
            }
            proc.addInputOption("-threads", "0");
            resolve(proc);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}
/**
 * This function is not available
 *
 * let bvc: string | null = null;
 * let bac: string | null = null;
 * fluentffmpeg.getAvailableCodecs((err, codecs) => {
 * if (err) reject({ bvc: null, bac: null });
 * if (!codecs) reject({ bvc: null, bac: null });
 * Object.keys(codecs).forEach((codec) => {
 * if (codec.includes("h264") || codec.includes("hevc")) {
 * const ci = codecs[codec] as { capabilities?: string[] };
 * if (!bvc || ci.capabilities?.includes("GPU")) bvc = codec;
 * }
 * if (codec.includes("aac") || codec.includes("mp3")) {
 * const ci = codecs[codec] as { capabilities?: string[] };
 * if (!bac || ci.capabilities?.includes("GPU")) bac = codec;
 * }
 * });
 * if (bac && bvc) {
 * console.log(colors.green("@ffmpeg:"), "using video codec", bvc);
 * console.log(colors.green("@ffmpeg:"), "using audio codec", bac);
 * proc.videoCodec(bvc);
 * proc.audioCodec(bac);
 * } else {
 * console.log(colors.yellow("@ffmpeg:"), "no video & audio codec found.");
 * proc.videoCodec("");
 * proc.audioCodec("");
 * }
 * proc.videoCodec("");
 * proc.audioCodec("");
 * resolve(proc);
 * });
 *
 */

async function lowEntry(metaBody) {
    if (!metaBody || metaBody.length === 0) {
        console.log(colors.red("@error:"), "sorry no downloadable data found");
        return undefined;
    }
    const sortedByFileSize = [...metaBody].sort((a, b) => a.meta_info.filesizebytes - b.meta_info.filesizebytes);
    return sortedByFileSize[0];
}

const progressBar = (prog) => {
    if (prog.percent === undefined)
        return;
    if (prog.timemark === undefined)
        return;
    let color = colors.green;
    if (prog.percent >= 98)
        prog.percent = 100;
    readline.cursorTo(process.stdout, 0);
    const width = Math.floor(process.stdout.columns / 3);
    const scomp = Math.round((width * prog.percent) / 100);
    if (prog.percent < 20)
        color = colors.red;
    else if (prog.percent < 80)
        color = colors.yellow;
    const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
    process.stdout.write(color("@prog: ") +
        sprog +
        " " +
        prog.percent.toFixed(2) +
        "% " +
        color("TIMEMARK: ") +
        prog.timemark);
    if (prog.percent >= 99)
        process.stdout.write("\n");
};

const AudioLowestInputSchema = z$1.object({
    query: z$1.string().min(1),
    filter: z$1.string().optional(),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    outputFormat: z$1.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function AudioLowest(input) {
    try {
        const { query, filter, stream, verbose, folderName, outputFormat = "mp3", } = AudioLowestInputSchema.parse(input);
        const metaBody = await Agent({ query });
        if (!metaBody) {
            throw new Error("Unable to get response from YouTube...");
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await lowEntry(metaBody.AudioStore);
        if (metaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const proc = await ffmpeg();
        proc.addInput(metaEntry.meta_dl.mediaurl);
        proc.addInput(metaBody.metaTube.thumbnail);
        proc.addOutputOption("-map", "1:0");
        proc.addOutputOption("-map", "0:a:0");
        proc.addOutputOption("-id3v2_version", "3");
        proc.format(outputFormat);
        proc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
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
        if (stream) {
            const readStream = new Readable({
                read() { },
            });
            const writeStream = new Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(undefined);
                    callback();
                },
            });
            proc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                proc.output(path.join(metaFold, metaName));
                proc.on("end", () => resolve());
                proc.on("error", reject);
                proc.run();
            });
            return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

async function bigEntry(metaBody) {
    if (!metaBody || metaBody.length === 0) {
        console.log(colors.red("@error:"), "sorry no downloadable data found");
        return undefined;
    }
    const sortedByFileSize = [...metaBody].sort((a, b) => b.meta_info.filesizebytes - a.meta_info.filesizebytes);
    return sortedByFileSize[0];
}

const AudioHighestInputSchema = z$1.object({
    query: z$1.string().min(1),
    filter: z$1.string().optional(),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    outputFormat: z$1.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function AudioHighest(input) {
    try {
        const { query, filter, stream, verbose, folderName, outputFormat = "mp3", } = AudioHighestInputSchema.parse(input);
        const metaBody = await Agent({ query });
        if (!metaBody) {
            throw new Error("Unable to get response from YouTube...");
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry(metaBody.AudioStore);
        if (metaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const proc = await ffmpeg();
        proc.addInput(metaEntry.meta_dl.mediaurl);
        proc.addInput(metaBody.metaTube.thumbnail);
        proc.addOutputOption("-map", "1:0");
        proc.addOutputOption("-map", "0:a:0");
        proc.addOutputOption("-id3v2_version", "3");
        proc.format(outputFormat);
        proc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
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
        if (stream) {
            const readStream = new Readable({
                read() { },
            });
            const writeStream = new Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(undefined);
                    callback();
                },
            });
            proc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                proc.output(path.join(metaFold, metaName));
                proc.on("end", () => resolve());
                proc.on("error", reject);
                proc.run();
            });
            return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const VideoLowestInputSchema$1 = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    filter: z$1.string().optional(),
    outputFormat: z$1.enum(["mp4", "avi", "mov"]).optional(),
});
async function VideoLowest$1(input) {
    try {
        const { query, filter, stream, verbose, folderName, outputFormat = "mp4", } = VideoLowestInputSchema$1.parse(input);
        const metaBody = await Agent({ query });
        if (!metaBody) {
            throw new Error("Unable to get response from YouTube...");
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await lowEntry(metaBody.VideoStore);
        if (metaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const proc = await ffmpeg();
        proc.addInput(metaEntry.meta_dl.mediaurl);
        proc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                proc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
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
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        proc.on("error", (error) => {
            return error;
        });
        switch (stream) {
            case true:
                const readStream = new Readable({
                    read() { },
                });
                const writeStream = new Writable({
                    write(chunk, _encoding, callback) {
                        readStream.push(chunk);
                        callback();
                    },
                    final(callback) {
                        readStream.push(undefined);
                        callback();
                    },
                });
                proc.pipe(writeStream, { end: true });
                return {
                    stream: readStream,
                    filename: folderName
                        ? path.join(metaFold, metaName.replace("-.", "."))
                        : metaName.replace("-.", "."),
                };
            default:
                await new Promise((resolve, reject) => {
                    proc.output(path.join(metaFold, metaName));
                    proc.on("end", () => resolve());
                    proc.on("error", reject);
                    proc.run();
                });
                return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const VideoHighestInputSchema = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    outputFormat: z$1.enum(["mp4", "avi", "mov"]).optional(),
    filter: z$1.string().optional(),
});
async function VideoHighest(input) {
    try {
        const { query, stream, verbose, folderName, outputFormat = "mp4", filter, } = VideoHighestInputSchema.parse(input);
        const metaBody = await Agent({ query });
        if (!metaBody) {
            throw new Error("Unable to get response from YouTube...");
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        let metaName = "";
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry(metaBody.VideoStore);
        if (metaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const proc = await ffmpeg();
        proc.addInput(metaEntry.meta_dl.mediaurl);
        proc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                proc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
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
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        proc.on("error", (error) => {
            return error;
        });
        switch (stream) {
            case true:
                const readStream = new Readable({
                    read() { },
                });
                const writeStream = new Writable({
                    write(chunk, _encoding, callback) {
                        readStream.push(chunk);
                        callback();
                    },
                    final(callback) {
                        readStream.push(undefined);
                        callback();
                    },
                });
                proc.pipe(writeStream, { end: true });
                return {
                    stream: readStream,
                    filename: folderName
                        ? path.join(metaFold, metaName.replace("-.", "."))
                        : metaName.replace("-.", "."),
                };
            default:
                await new Promise((resolve, reject) => {
                    proc.output(path.join(metaFold, metaName));
                    proc.on("end", () => resolve());
                    proc.on("error", reject);
                    proc.run();
                });
                return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const AudioVideoLowestInputSchema = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    outputFormat: z$1.enum(["webm", "avi", "mov"]).optional(),
});
async function AudioVideoLowest(input) {
    try {
        const { query, stream, verbose, folderName, outputFormat = "webm", } = AudioVideoLowestInputSchema.parse(input);
        const metaBody = await Agent({ query });
        if (!metaBody) {
            throw new Error("Unable to get response from YouTube...");
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const proc = await ffmpeg();
        const AmetaEntry = await lowEntry(metaBody.AudioStore);
        const VmetaEntry = await lowEntry(metaBody.VideoStore);
        if (AmetaEntry === undefined || VmetaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        proc.addInput(VmetaEntry.meta_dl.mediaurl);
        proc.addInput(AmetaEntry.meta_dl.mediaurl);
        proc.format(outputFormat);
        proc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        proc.on("error", (error) => {
            return error;
        });
        if (stream) {
            const readStream = new Readable({
                read() { },
            });
            const writeStream = new Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(undefined);
                    callback();
                },
            });
            proc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                proc.output(path.join(metaFold, metaName));
                proc.on("end", () => resolve());
                proc.on("error", reject);
                proc.run();
            });
            return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const AudioVideoHighestInputSchema = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    outputFormat: z$1.enum(["webm", "avi", "mov"]).optional(),
});
async function AudioVideoHighest(input) {
    try {
        const { query, stream, verbose, folderName, outputFormat = "webm", } = AudioVideoHighestInputSchema.parse(input);
        const metaBody = await Agent({ query });
        if (!metaBody) {
            throw new Error("Unable to get response from YouTube...");
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const proc = await ffmpeg();
        const AmetaEntry = await bigEntry(metaBody.AudioStore);
        const VmetaEntry = await bigEntry(metaBody.VideoStore);
        if (AmetaEntry === undefined || VmetaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        proc.addInput(VmetaEntry.meta_dl.mediaurl);
        proc.addInput(AmetaEntry.meta_dl.mediaurl);
        proc.format(outputFormat);
        proc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        proc.on("error", (error) => {
            return error;
        });
        if (stream) {
            const readStream = new Readable({
                read() { },
            });
            const writeStream = new Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(undefined);
                    callback();
                },
            });
            proc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                proc.output(path.join(metaFold, metaName));
                proc.on("end", () => resolve());
                proc.on("error", reject);
                proc.run();
            });
            return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const AudioQualityCustomInputSchema = z$1.object({
    query: z$1.string().min(1),
    filter: z$1.string().optional(),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    quality: z$1.enum(["high", "medium", "low", "ultralow"]),
    outputFormat: z$1.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function AudioQualityCustom(input) {
    try {
        const { query, filter, stream, verbose, quality, folderName, outputFormat = "mp3", } = AudioQualityCustomInputSchema.parse(input);
        const metaResp = await Agent({ query });
        if (!metaResp) {
            return {
                message: "The specified quality was not found...",
                status: 500,
            };
        }
        const metaBody = metaResp.AudioStore.filter((op) => op.meta_dl.formatnote === quality);
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        let metaName = "";
        const title = metaResp.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const proc = await ffmpeg();
        const metaEntry = await bigEntry(metaBody);
        if (metaEntry === undefined) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        proc.addInput(metaEntry.meta_dl.mediaurl);
        proc.addInput(metaResp.metaTube.thumbnail);
        proc.addOutputOption("-map", "1:0");
        proc.addOutputOption("-map", "0:a:0");
        proc.addOutputOption("-id3v2_version", "3");
        proc.withAudioBitrate(metaEntry.meta_audio.bitrate);
        proc.withAudioChannels(metaEntry.meta_audio.channels);
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
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        proc.on("error", (error) => {
            return error;
        });
        if (stream) {
            const readStream = new Readable({
                read() { },
            });
            const writeStream = new Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(undefined);
                    callback();
                },
            });
            proc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                proc.output(path.join(metaFold, metaName));
                proc.on("end", () => resolve());
                proc.on("error", reject);
                proc.run();
            });
            return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const VideoLowestInputSchema = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    filter: z$1.string().optional(),
    outputFormat: z$1.enum(["mp4", "avi", "mov"]).optional(),
});
async function VideoLowest(input) {
    try {
        const { query, filter, stream, verbose, folderName, outputFormat = "mp4", } = VideoLowestInputSchema.parse(input);
        const metaBody = await Agent({ query });
        if (!metaBody) {
            throw new Error("Unable to get response from YouTube...");
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry(metaBody.VideoStore);
        if (metaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const proc = await ffmpeg();
        proc.addInput(metaEntry.meta_dl.mediaurl);
        proc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                proc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
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
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("end", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("close", () => {
            progressBar({
                timemark: undefined,
                percent: undefined,
            });
        });
        proc.on("progress", (prog) => {
            progressBar({
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        proc.on("error", (error) => {
            return error;
        });
        switch (stream) {
            case true:
                const readStream = new Readable({
                    read() { },
                });
                const writeStream = new Writable({
                    write(chunk, _encoding, callback) {
                        readStream.push(chunk);
                        callback();
                    },
                    final(callback) {
                        readStream.push(undefined);
                        callback();
                    },
                });
                proc.pipe(writeStream, { end: true });
                return {
                    stream: readStream,
                    filename: folderName
                        ? path.join(metaFold, metaName.replace("-.", "."))
                        : metaName.replace("-.", "."),
                };
            default:
                await new Promise((resolve, reject) => {
                    proc.output(path.join(metaFold, metaName));
                    proc.on("end", () => resolve());
                    proc.on("error", reject);
                    proc.run();
                });
                return true;
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListVideoLowestInputSchema = z$1.object({
    filter: z$1.string().optional(),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    outputFormat: z$1.enum(["mp4", "avi", "mov"]).optional(),
});
async function ListVideoLowest(input) {
    try {
        const { filter, stream, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListVideoLowestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const videoLink of playlistUrls) {
            const metaList = await web.search.PlaylistInfo({ query: videoLink });
            if (metaList === undefined || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const uniqueVideos = metaList.playlistVideos.filter((video) => !uniqueVideoIds.has(video.videoId));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await web.search.VideoInfo({
                query: i.videoLink,
            });
            if (TubeBody === undefined)
                continue;
            const metaBody = await Agent({
                query: TubeBody.videoLink,
            });
            if (metaBody === undefined)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs.existsSync(metaFold))
                fs.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await lowEntry(metaBody.VideoStore);
            if (metaEntry === undefined)
                continue;
            const proc = await ffmpeg();
            proc.addInput(metaEntry.meta_dl.mediaurl);
            proc.format(outputFormat);
            proc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("end", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("close", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("progress", (prog) => {
                progressBar({
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "grayscale":
                    proc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
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
            switch (true) {
                case stream:
                    const readStream = new Readable({
                        read() { },
                    });
                    const writeStream = new Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(undefined);
                            callback();
                        },
                    });
                    proc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName
                            ? path.join(metaFold, metaName.replace("-.", "."))
                            : metaName.replace("-.", "."),
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        proc.output(path.join(metaFold, metaName));
                        proc.on("end", () => resolve());
                        proc.on("error", reject);
                        proc.run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListVideoHighestInputSchema = z$1.object({
    filter: z$1.string().optional(),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    outputFormat: z$1.enum(["mp4", "avi", "mov"]).optional(),
});
async function ListVideoHighest(input) {
    try {
        const { filter, stream, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListVideoHighestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const videoLink of playlistUrls) {
            const metaList = await web.search.PlaylistInfo({ query: videoLink });
            if (metaList === undefined || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const uniqueVideos = metaList.playlistVideos.filter((video) => !uniqueVideoIds.has(video.videoId));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await web.search.VideoInfo({
                query: i.videoLink,
            });
            if (TubeBody === undefined)
                continue;
            const metaBody = await Agent({
                query: TubeBody.videoLink,
            });
            if (metaBody === undefined)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs.existsSync(metaFold))
                fs.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(metaBody.VideoStore);
            if (metaEntry === undefined)
                continue;
            const proc = await ffmpeg();
            proc.addInput(metaEntry.meta_dl.mediaurl);
            proc.format(outputFormat);
            proc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("end", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("close", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("progress", (prog) => {
                progressBar({
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "grayscale":
                    proc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
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
            switch (true) {
                case stream:
                    const readStream = new Readable({
                        read() { },
                    });
                    const writeStream = new Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(undefined);
                            callback();
                        },
                    });
                    proc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName
                            ? path.join(metaFold, metaName.replace("-.", "."))
                            : metaName.replace("-.", "."),
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        proc.output(path.join(metaFold, metaName));
                        proc.on("end", () => resolve());
                        proc.on("error", reject);
                        proc.run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListVideoQualityCustomInputSchema = z$1.object({
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    quality: z$1.enum([
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
    outputFormat: z$1.enum(["mp4", "avi", "mov"]).optional(),
    filter: z$1.string().optional(),
});
async function ListVideoQualityCustom(input) {
    try {
        const { filter, stream, quality, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListVideoQualityCustomInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const videoLink of playlistUrls) {
            const metaList = await web.search.PlaylistInfo({ query: videoLink });
            if (metaList === undefined || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const uniqueVideos = metaList.playlistVideos.filter((video) => !uniqueVideoIds.has(video.videoId));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await web.search.VideoInfo({
                query: i.videoLink,
            });
            if (TubeBody === undefined)
                continue;
            const metaBody = await Agent({
                query: TubeBody.videoLink,
            });
            if (metaBody === undefined)
                continue;
            const newBody = metaBody.VideoStore.filter((op) => op.meta_dl.formatnote === quality);
            if (!newBody || newBody === undefined)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs.existsSync(metaFold))
                fs.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(newBody);
            if (metaEntry === undefined)
                continue;
            const proc = await ffmpeg();
            proc.addInput(metaEntry.meta_dl.mediaurl);
            proc.format(outputFormat);
            proc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("end", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("close", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("progress", (prog) => {
                progressBar({
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "grayscale":
                    proc.withVideoFilter([
                        "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
                    ]);
                    metaName = `yt-dlp_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
                    break;
                case "invert":
                    proc.withVideoFilter(["negate"]);
                    metaName = `yt-dlp_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
                    break;
                case "rotate90":
                    proc.withVideoFilter(["rotate=PI/2"]);
                    metaName = `yt-dlp_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
                    break;
                case "rotate180":
                    proc.withVideoFilter(["rotate=PI"]);
                    metaName = `yt-dlp_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
                    break;
                case "rotate270":
                    proc.withVideoFilter(["rotate=3*PI/2"]);
                    metaName = `yt-dlp_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
                    break;
                case "flipHorizontal":
                    proc.withVideoFilter(["hflip"]);
                    metaName = `yt-dlp_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                case "flipVertical":
                    proc.withVideoFilter(["vflip"]);
                    metaName = `yt-dlp_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
                    break;
                default:
                    proc.withVideoFilter([]);
                    metaName = `yt-dlp_(VideoQualityCustom)_${title}.${outputFormat}`;
            }
            switch (true) {
                case stream:
                    const readStream = new Readable({
                        read() { },
                    });
                    const writeStream = new Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(undefined);
                            callback();
                        },
                    });
                    proc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName
                            ? path.join(metaFold, metaName.replace("-.", "."))
                            : metaName.replace("-.", "."),
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        proc.output(path.join(metaFold, metaName));
                        proc.on("end", () => resolve());
                        proc.on("error", reject);
                        proc.run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListAudioLowestInputSchema = z$1.object({
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    outputFormat: z$1.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
    filter: z$1.string().optional(),
});
async function ListAudioLowest(input) {
    try {
        const { filter, stream, verbose, folderName, playlistUrls, outputFormat = "mp3", } = ListAudioLowestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const videoLink of playlistUrls) {
            const metaList = await web.search.PlaylistInfo({ query: videoLink });
            if (metaList === undefined || !metaList) {
                throw new Error("Unable to get response from YouTube...");
            }
            const uniqueVideos = metaList.playlistVideos.filter((video) => !uniqueVideoIds.has(video.videoId));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await web.search.VideoInfo({
                query: i.videoLink,
            });
            if (TubeBody === undefined)
                continue;
            const metaBody = await Agent({
                query: TubeBody.videoLink,
            });
            if (metaBody === undefined)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs.existsSync(metaFold))
                fs.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await lowEntry(metaBody.AudioStore);
            if (metaEntry === undefined)
                continue;
            const proc = await ffmpeg();
            proc.addInput(metaEntry.meta_dl.mediaurl);
            proc.addInput(metaBody.metaTube.thumbnail);
            proc.addOutputOption("-map", "1:0");
            proc.addOutputOption("-map", "0:a:0");
            proc.addOutputOption("-id3v2_version", "3");
            proc.format(outputFormat);
            proc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("end", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("close", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("progress", (prog) => {
                progressBar({
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
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
            switch (true) {
                case stream:
                    const readStream = new Readable({
                        read() { },
                    });
                    const writeStream = new Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(undefined);
                            callback();
                        },
                    });
                    proc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName
                            ? path.join(metaFold, metaName.replace("-.", "."))
                            : metaName.replace("-.", "."),
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        proc.output(path.join(metaFold, metaName));
                        proc.on("end", () => resolve());
                        proc.on("error", reject);
                        proc.run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListAudioHighestInputSchema = z$1.object({
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    outputFormat: z$1.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
    filter: z$1.string().optional(),
});
async function ListAudioHighest(input) {
    try {
        const { filter, stream, verbose, folderName, playlistUrls, outputFormat = "mp3", } = ListAudioHighestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const videoLink of playlistUrls) {
            const metaList = await web.search.PlaylistInfo({ query: videoLink });
            if (metaList === undefined || !metaList) {
                throw new Error("Unable to get response from YouTube...");
            }
            const uniqueVideos = metaList.playlistVideos.filter((video) => !uniqueVideoIds.has(video.videoId));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await web.search.VideoInfo({
                query: i.videoLink,
            });
            if (TubeBody === undefined)
                continue;
            const metaBody = await Agent({
                query: TubeBody.videoLink,
            });
            if (metaBody === undefined)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs.existsSync(metaFold))
                fs.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(metaBody.AudioStore);
            if (metaEntry === undefined)
                continue;
            const proc = await ffmpeg();
            proc.addInput(metaEntry.meta_dl.mediaurl);
            proc.addInput(metaBody.metaTube.thumbnail);
            proc.addOutputOption("-map", "1:0");
            proc.addOutputOption("-map", "0:a:0");
            proc.addOutputOption("-id3v2_version", "3");
            proc.format(outputFormat);
            proc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("end", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("close", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("progress", (prog) => {
                progressBar({
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
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
            switch (true) {
                case stream:
                    const readStream = new Readable({
                        read() { },
                    });
                    const writeStream = new Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(undefined);
                            callback();
                        },
                    });
                    proc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName
                            ? path.join(metaFold, metaName.replace("-.", "."))
                            : metaName.replace("-.", "."),
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        proc.output(path.join(metaFold, metaName));
                        proc.on("end", () => resolve());
                        proc.on("error", reject);
                        proc.run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListAudioQualityCustomInputSchema = z$1.object({
    filter: z$1.string().optional(),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    quality: z$1.enum(["high", "medium", "low", "ultralow"]),
    outputFormat: z$1.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function ListAudioQualityCustom(input) {
    try {
        const { filter, stream, quality, verbose, folderName, playlistUrls, outputFormat = "mp3", } = ListAudioQualityCustomInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const videoLink of playlistUrls) {
            const metaList = await web.search.PlaylistInfo({ query: videoLink });
            if (metaList === undefined || !metaList) {
                throw new Error("Unable to get response from YouTube...");
            }
            const uniqueVideos = metaList.playlistVideos.filter((video) => !uniqueVideoIds.has(video.videoId));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await web.search.VideoInfo({
                query: i.videoLink,
            });
            if (TubeBody === undefined)
                continue;
            const metaBody = await Agent({
                query: TubeBody.videoLink,
            });
            if (metaBody === undefined)
                continue;
            const newBody = metaBody.AudioStore.filter((op) => op.meta_dl.formatnote === quality);
            if (!newBody || newBody === undefined)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs.existsSync(metaFold))
                fs.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(newBody);
            if (metaEntry === undefined)
                continue;
            const proc = await ffmpeg();
            proc.addInput(metaEntry.meta_dl.mediaurl);
            proc.addInput(metaBody.metaTube.thumbnail);
            proc.addOutputOption("-map", "1:0");
            proc.addOutputOption("-map", "0:a:0");
            proc.addOutputOption("-id3v2_version", "3");
            proc.format(outputFormat);
            proc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("end", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("close", () => {
                progressBar({
                    timemark: undefined,
                    percent: undefined,
                });
            });
            proc.on("progress", (prog) => {
                progressBar({
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "bassboost":
                    proc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
                    break;
                case "echo":
                    proc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    metaName = `yt-dlp-(AudioQualityCustom_echo)-${title}.${outputFormat}`;
                    break;
                case "flanger":
                    proc.withAudioFilter(["flanger"]);
                    metaName = `yt-dlp-(AudioQualityCustom_flanger)-${title}.${outputFormat}`;
                    break;
                case "nightcore":
                    proc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                    metaName = `yt-dlp-(AudioQualityCustom_nightcore)-${title}.${outputFormat}`;
                    break;
                case "panning":
                    proc.withAudioFilter(["apulsator=hz=0.08"]);
                    metaName = `yt-dlp-(AudioQualityCustom_panning)-${title}.${outputFormat}`;
                    break;
                case "phaser":
                    proc.withAudioFilter(["aphaser=in_gain=0.4"]);
                    metaName = `yt-dlp-(AudioQualityCustom_phaser)-${title}.${outputFormat}`;
                    break;
                case "reverse":
                    proc.withAudioFilter(["areverse"]);
                    metaName = `yt-dlp-(AudioQualityCustom_reverse)-${title}.${outputFormat}`;
                    break;
                case "slow":
                    proc.withAudioFilter(["atempo=0.8"]);
                    metaName = `yt-dlp-(AudioQualityCustom_slow)-${title}.${outputFormat}`;
                    break;
                case "speed":
                    proc.withAudioFilter(["atempo=2"]);
                    metaName = `yt-dlp-(AudioQualityCustom_speed)-${title}.${outputFormat}`;
                    break;
                case "subboost":
                    proc.withAudioFilter(["asubboost"]);
                    metaName = `yt-dlp-(AudioQualityCustom_subboost)-${title}.${outputFormat}`;
                    break;
                case "superslow":
                    proc.withAudioFilter(["atempo=0.5"]);
                    metaName = `yt-dlp-(AudioQualityCustom_superslow)-${title}.${outputFormat}`;
                    break;
                case "superspeed":
                    proc.withAudioFilter(["atempo=3"]);
                    metaName = `yt-dlp-(AudioQualityCustom_superspeed)-${title}.${outputFormat}`;
                    break;
                case "surround":
                    proc.withAudioFilter(["surround"]);
                    metaName = `yt-dlp-(AudioQualityCustom_surround)-${title}.${outputFormat}`;
                    break;
                case "vaporwave":
                    proc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    metaName = `yt-dlp-(AudioQualityCustom_vaporwave)-${title}.${outputFormat}`;
                    break;
                case "vibrato":
                    proc.withAudioFilter(["vibrato=f=6.5"]);
                    metaName = `yt-dlp-(AudioQualityCustom_vibrato)-${title}.${outputFormat}`;
                    break;
                default:
                    proc.withAudioFilter([]);
                    metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
                    break;
            }
            switch (true) {
                case stream:
                    const readStream = new Readable({
                        read() { },
                    });
                    const writeStream = new Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(undefined);
                            callback();
                        },
                    });
                    proc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName
                            ? path.join(metaFold, metaName.replace("-.", "."))
                            : metaName.replace("-.", "."),
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        proc.output(path.join(metaFold, metaName));
                        proc.on("end", () => resolve());
                        proc.on("error", reject);
                        proc.run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListAudioVideoLowestInputSchema = z$1.object({
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    outputFormat: z$1.enum(["webm", "avi", "mov"]).optional(),
});
async function ListAudioVideoLowest(input) {
    try {
        const { stream, verbose, folderName, playlistUrls, outputFormat = "webm", } = ListAudioVideoLowestInputSchema.parse(input);
        switch (true) {
            case playlistUrls.length === 0:
                throw new Error("playlistUrls parameter cannot be empty");
            case !Array.isArray(playlistUrls):
                throw new Error("playlistUrls parameter must be an array");
            case !playlistUrls.every((url) => typeof url === "string" && url.trim().length > 0):
                throw new Error("Invalid playlistUrls[] parameter. Expecting a non-empty array of strings.");
            default:
                const videos = await get_playlist({
                    playlistUrls,
                });
                if (!videos) {
                    throw new Error("Unable to get response from YouTube..");
                }
                else {
                    const results = [];
                    await async.eachSeries(videos, async (video) => {
                        try {
                            const metaBody = await Agent({ query: video.url });
                            if (!metaBody) {
                                throw new Error("Unable to get response from YouTube...");
                            }
                            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                            let metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
                            const metaFold = folderName
                                ? path.join(process.cwd(), folderName)
                                : process.cwd();
                            if (!fs.existsSync(metaFold))
                                fs.mkdirSync(metaFold, { recursive: true });
                            const proc = await ffmpeg();
                            const AmetaEntry = await lowEntry(metaBody.AudioStore);
                            const VmetaEntry = await lowEntry(metaBody.VideoStore);
                            if (AmetaEntry === undefined || VmetaEntry === undefined)
                                return;
                            proc.addInput(VmetaEntry.meta_dl.mediaurl);
                            proc.addInput(AmetaEntry.meta_dl.mediaurl);
                            proc.format(outputFormat);
                            proc.on("start", (command) => {
                                if (verbose)
                                    console.log(command);
                                progressBar({
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            proc.on("end", () => {
                                progressBar({
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            proc.on("close", () => {
                                progressBar({
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            proc.on("progress", (prog) => {
                                progressBar({
                                    timemark: prog.timemark,
                                    percent: prog.percent,
                                });
                            });
                            if (stream) {
                                const readStream = new Readable({
                                    read() { },
                                });
                                const writeStream = new Writable({
                                    write(chunk, _encoding, callback) {
                                        readStream.push(chunk);
                                        callback();
                                    },
                                    final(callback) {
                                        readStream.push(undefined);
                                        callback();
                                    },
                                });
                                proc.pipe(writeStream, { end: true });
                                results.push({
                                    stream: readStream,
                                    filename: folderName
                                        ? path.join(metaFold, metaName.replace("-.", "."))
                                        : metaName.replace("-.", "."),
                                });
                            }
                            else {
                                await new Promise((resolve, reject) => {
                                    proc.output(path.join(metaFold, metaName));
                                    proc.on("end", () => resolve());
                                    proc.on("error", reject);
                                    proc.run();
                                });
                            }
                        }
                        catch (error) {
                            results.push(true);
                        }
                    });
                    return results;
                }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ListAudioVideoHighestInputSchema = z$1.object({
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    playlistUrls: z$1.array(z$1.string().min(1)),
    outputFormat: z$1.enum(["webm", "avi", "mov"]).optional(),
});
async function ListAudioVideoHighest(input) {
    try {
        const { stream, verbose, folderName, playlistUrls, outputFormat = "webm", } = ListAudioVideoHighestInputSchema.parse(input);
        switch (true) {
            case playlistUrls.length === 0:
                throw new Error("playlistUrls parameter cannot be empty");
            case !Array.isArray(playlistUrls):
                throw new Error("playlistUrls parameter must be an array");
            case !playlistUrls.every((url) => typeof url === "string" && url.trim().length > 0):
                throw new Error("Invalid playlistUrls[] parameter. Expecting a non-empty array of strings.");
            default:
                const videos = await get_playlist({
                    playlistUrls,
                });
                if (!videos) {
                    throw new Error("Unable to get response from YouTube..");
                }
                else {
                    const results = [];
                    await async.eachSeries(videos, async (video) => {
                        try {
                            const metaBody = await Agent({ query: video.url });
                            if (!metaBody) {
                                throw new Error("Unable to get response from YouTube...");
                            }
                            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                            let metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
                            const metaFold = folderName
                                ? path.join(process.cwd(), folderName)
                                : process.cwd();
                            if (!fs.existsSync(metaFold))
                                fs.mkdirSync(metaFold, { recursive: true });
                            const proc = await ffmpeg();
                            const AmetaEntry = await bigEntry(metaBody.AudioStore);
                            const VmetaEntry = await bigEntry(metaBody.VideoStore);
                            if (AmetaEntry === undefined || VmetaEntry === undefined)
                                return;
                            proc.addInput(VmetaEntry.meta_dl.mediaurl);
                            proc.addInput(AmetaEntry.meta_dl.mediaurl);
                            proc.format(outputFormat);
                            proc.on("start", (command) => {
                                if (verbose)
                                    console.log(command);
                                progressBar({
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            proc.on("end", () => {
                                progressBar({
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            proc.on("close", () => {
                                progressBar({
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            proc.on("progress", (prog) => {
                                progressBar({
                                    timemark: prog.timemark,
                                    percent: prog.percent,
                                });
                            });
                            if (stream) {
                                const readStream = new Readable({
                                    read() { },
                                });
                                const writeStream = new Writable({
                                    write(chunk, _encoding, callback) {
                                        readStream.push(chunk);
                                        callback();
                                    },
                                    final(callback) {
                                        readStream.push(undefined);
                                        callback();
                                    },
                                });
                                proc.pipe(writeStream, { end: true });
                                results.push({
                                    stream: readStream,
                                    filename: folderName
                                        ? path.join(metaFold, metaName.replace("-.", "."))
                                        : metaName.replace("-.", "."),
                                });
                            }
                            else {
                                await new Promise((resolve, reject) => {
                                    proc.output(path.join(metaFold, metaName));
                                    proc.on("end", () => resolve());
                                    proc.on("error", reject);
                                    proc.run();
                                });
                            }
                        }
                        catch (error) {
                            results.push(true);
                        }
                    });
                    return results;
                }
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else {
            throw new Error(colors.red("@error: ") + "internal server error");
        }
    }
}

const ytdlx = {
    search: {
        PlaylistInfo: web.search.PlaylistInfo,
        SearchVideos: web.search.SearchVideos,
        VideoInfo: web.search.VideoInfo,
    },
    info: {
        help,
        extract,
        list_formats,
        get_playlist,
        get_video_data,
        extract_playlist_videos,
    },
    audio: {
        single: {
            lowest: AudioLowest,
            highest: AudioHighest,
            custom: AudioQualityCustom,
        },
        playlist: {
            lowest: ListAudioLowest,
            highest: ListAudioHighest,
            custom: ListAudioQualityCustom,
        },
    },
    video: {
        single: {
            lowest: VideoLowest$1,
            highest: VideoHighest,
            custom: VideoLowest,
        },
        playlist: {
            lowest: ListVideoLowest,
            highest: ListVideoHighest,
            custom: ListVideoQualityCustom,
        },
    },
    audio_video: {
        single: {
            lowest: AudioVideoLowest,
            highest: AudioVideoHighest,
        },
        playlist: { lowest: ListAudioVideoLowest, highest: ListAudioVideoHighest },
    },
};

export { ytdlx as default };
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
