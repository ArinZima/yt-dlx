/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
import * as fs from 'fs';
import fs__default from 'fs';
import colors from 'colors';
import { load } from 'cheerio';
import retry from 'async-retry';
import puppeteer from 'puppeteer';
import spinClient from 'spinnies';
import * as z from 'zod';
import { z as z$1, ZodError } from 'zod';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { promisify } from 'util';
import { exec, execSync } from 'child_process';
import * as async from 'async';
import readline from 'readline';
import fluent from 'fluent-ffmpeg';

async function closers(browser) {
    try {
        const pages = await browser.pages();
        await Promise.all(pages.map((page) => page.close()));
        await browser.close();
    }
    catch (error) {
        console.error(colors.red("@error:"), error);
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
async function crawler(verbose) {
    try {
        browser = await puppeteer.launch({
            headless: verbose ? false : true,
            userDataDir: "others",
            args: [
                "--no-zygote",
                "--incognito",
                "--no-sandbox",
                "--enable-automation",
                "--disable-dev-shm-usage",
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
            verbose: z$1.boolean().optional(),
            screenshot: z$1.boolean().optional(),
        });
        const { query, screenshot, verbose } = await QuerySchema.parseAsync(input);
        await crawler(verbose);
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
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));

async function PlaylistInfo(input) {
    try {
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
            verbose: z$1.boolean().optional(),
            screenshot: z$1.boolean().optional(),
        });
        const { screenshot, verbose } = await QuerySchema.parseAsync(input);
        await crawler(verbose);
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
            case error instanceof ZodError:
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
            verbose: z$1.boolean().optional(),
            screenshot: z$1.boolean().optional(),
        });
        const { screenshot, verbose } = await QuerySchema.parseAsync(input);
        await crawler(verbose);
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
            case error instanceof ZodError:
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
// Audio: {
// bitrate: core.abr,
// codec: core.acodec,
// samplerate: core.asr,
// extension: core.audio_ext,
// channels: core.audio_channels,
// },
// Video: {
// bitrate: core.vbr,
// width: core.width,
// codec: core.vcodec,
// height: core.height,
// extension: core.video_ext,
// resolution: core.resolution,
// aspectratio: core.aspect_ratio,
// },
// AVDownload: {
// mediaurl: core.url,
// originalformat: core.format
// .replace(/[-\s]+/g, "_")
// .replace(/_/g, "_"),
// formatid: core.format_id,
// formatnote: core.format_note,
// },
// AVInfo: {
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
// if (reTube.AVDownload.formatnote) {
// switch (true) {
// case (reTube.AVDownload.formatnote.includes("ultralow") ||
// reTube.AVDownload.formatnote.includes("medium") ||
// reTube.AVDownload.formatnote.includes("high") ||
// reTube.AVDownload.formatnote.includes("low")) &&
// reTube.Video.resolution &&
// reTube.Video.resolution.includes("audio"):
// pushTube.push({ Tube: "AudioStore", reTube });
// break;
// case reTube.AVDownload.formatnote.includes("HDR"):
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

var version = "4.2.0";

async function Agent({ query, verbose, }) {
    try {
        let respEngine = undefined;
        let videoId = await YouTubeID(query);
        let TubeBody;
        console.log(colors.green("@info:"), "using", colors.green("yt-dlx"), "version", colors.green(version));
        if (!videoId) {
            TubeBody = (await web.search.SearchVideos({
                type: "video",
                verbose,
                query,
            }));
            if (!TubeBody[0]) {
                throw new Error(colors.red("@error: ") + "Unable to get response from YouTube...");
            }
            else {
                console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody[0].title));
                respEngine = await Engine(TubeBody[0].videoLink);
            }
        }
        else {
            TubeBody = (await web.search.VideoInfo({
                verbose,
                query,
            }));
            if (!TubeBody) {
                throw new Error(colors.red("@error: ") + "Unable to get response from YouTube...");
            }
            else {
                console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody.title));
                respEngine = await Engine(TubeBody.videoLink);
            }
        }
        if (respEngine === undefined) {
            throw new Error(colors.red("@error: ") + "Unable to get response from YouTube...");
        }
        else
            return respEngine;
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
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
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
            const zval = z
                .object({
                query: z.string().min(1),
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
            console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
        }
        catch (error) {
            reject(error instanceof z.ZodError ? error.errors : error);
        }
    });
}

async function extract_playlist_videos({ playlistUrls, }) {
    try {
        let counter = 0;
        const metaTubeArr = [];
        await async.eachSeries(playlistUrls, async (listLink) => {
            const query = await YouTubeID(listLink);
            if (query === undefined) {
                console.error(colors.bold.red("@error: "), "invalid youtube playlist url:", listLink);
                return;
            }
            else {
                const resp = await web.search.PlaylistInfo({
                    query,
                });
                if (resp === undefined) {
                    console.error(colors.bold.red("@error: "), "unable to get response from youtube for", query);
                    return;
                }
                else {
                    console.log(colors.green("@info:"), "total videos in playlist", colors.green(resp.playlistTitle), resp.playlistVideoCount);
                    await async.eachSeries(resp.playlistVideos, async (vid) => {
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
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
        return metaTubeArr;
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

function gpuffmpeg(input, verbose) {
    let maxTries = 6;
    let currentDir = __dirname;
    let FfprobePath, FfmpegPath;
    const progressBar = (prog) => {
        if (prog.timemark === undefined || prog.percent === undefined)
            return;
        if (prog.percent < 1 && prog.timemark.includes("-"))
            return;
        readline.cursorTo(process.stdout, 0);
        let color = colors.green;
        if (prog.percent < 25)
            color = colors.red;
        else if (prog.percent < 50)
            color = colors.yellow;
        const width = Math.floor(process.stdout.columns / 4);
        const scomp = Math.round((width * prog.percent) / 100);
        const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
        process.stdout.write(color("@prog: ") +
            sprog +
            " | " +
            color("@percent: ") +
            prog.percent.toFixed(2) +
            "% | " +
            color("@timemark: ") +
            prog.timemark +
            " | " +
            color("@frames: ") +
            prog.frames +
            " | " +
            color("@currentFps: ") +
            prog.currentFps);
        if (prog.timemark.includes("-"))
            process.stdout.write("\n\n");
    };
    const getTerm = (command) => {
        try {
            return execSync(command).toString().trim();
        }
        catch {
            return undefined;
        }
    };
    const ffmpeg = fluent(input)
        .on("start", (command) => {
        if (verbose)
            console.log(colors.green("@ffmpeg:"), command);
    })
        .on("progress", (prog) => progressBar(prog))
        .on("end", () => console.log(colors.green("\n@ffmpeg:"), "ended"))
        .on("error", (e) => console.error(colors.red("\n@ffmpeg:"), e.message));
    while (maxTries > 0) {
        FfprobePath = path.join(currentDir, "util", "ffmpeg", "bin", "ffprobe");
        FfmpegPath = path.join(currentDir, "util", "ffmpeg", "bin", "ffmpeg");
        if (fs.existsSync(FfprobePath) && fs.existsSync(FfmpegPath)) {
            ffmpeg.setFfprobePath(FfprobePath);
            ffmpeg.setFfmpegPath(FfmpegPath);
            break;
        }
        else {
            currentDir = path.join(currentDir, "..");
            maxTries--;
        }
    }
    const vendor = getTerm("nvidia-smi --query-gpu=name --format=csv,noheader");
    switch (true) {
        case vendor && vendor.includes("NVIDIA"):
            console.log(colors.green("@ffmpeg:"), "using GPU", colors.green(vendor));
            ffmpeg.withInputOption("-hwaccel cuda");
            ffmpeg.withVideoCodec("h264_nvenc");
            break;
        default:
            console.log(colors.yellow("@ffmpeg:"), "GPU vendor not recognized.", "defaulting to software processing.");
    }
    return ffmpeg;
}

async function lowEntry(metaBody) {
    if (!metaBody || metaBody.length === 0) {
        console.log(colors.red("@error:"), "sorry no downloadable data found");
        return undefined;
    }
    if (metaBody.length === 1)
        return metaBody[0];
    const validEntries = metaBody.filter((entry) => entry.AVInfo.filesizebytes !== null &&
        entry.AVInfo.filesizebytes !== undefined &&
        !isNaN(entry.AVInfo.filesizebytes));
    if (validEntries.length === 0) {
        console.log(colors.red("@error:"), "sorry no downloadable data found");
        return undefined;
    }
    const sortedByFileSize = [...validEntries].sort((a, b) => a.AVInfo.filesizebytes - b.AVInfo.filesizebytes);
    return sortedByFileSize[0];
}

const AudioLowestZod = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
});
async function AudioLowest(input) {
    try {
        const { query, stream, verbose, folderName } = AudioLowestZod.parse(input);
        const metaBody = await Agent({ query, verbose });
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
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
        const outputFormat = "avi";
        const ffmpeg = gpuffmpeg(metaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.addInput(metaBody.metaTube.thumbnail);
        ffmpeg.addOutputOption("-map", "1:0");
        ffmpeg.addOutputOption("-map", "0:a:0");
        ffmpeg.addOutputOption("-id3v2_version", "3");
        ffmpeg.outputFormat("avi");
        ffmpeg.on("error", (error) => {
            return error;
        });
        ffmpeg.withAudioFilter([]);
        metaName = `yt-dlp-(AudioLowest)-${title}.${outputFormat}`;
        if (stream) {
            return {
                ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

async function bigEntry(metaBody) {
    if (!metaBody || metaBody.length === 0) {
        console.log(colors.red("@error:"), "sorry no downloadable data found");
        return undefined;
    }
    if (metaBody.length === 1)
        return metaBody[0];
    const validEntries = metaBody.filter((entry) => entry.AVInfo.filesizebytes !== null &&
        entry.AVInfo.filesizebytes !== undefined &&
        !isNaN(entry.AVInfo.filesizebytes));
    if (validEntries.length === 0) {
        console.log(colors.red("@error:"), "sorry no downloadable data found");
        return undefined;
    }
    const sortedByFileSize = [...validEntries].sort((a, b) => b.AVInfo.filesizebytes - a.AVInfo.filesizebytes);
    return sortedByFileSize[0];
}

const AudioHighestZod = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
});
async function AudioHighest(input) {
    try {
        const { query, stream, verbose, folderName } = AudioHighestZod.parse(input);
        const metaBody = await Agent({ query, verbose });
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
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
        const outputFormat = "avi";
        const ffmpeg = gpuffmpeg(metaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.addInput(metaBody.metaTube.thumbnail);
        ffmpeg.addOutputOption("-map", "1:0");
        ffmpeg.addOutputOption("-map", "0:a:0");
        ffmpeg.addOutputOption("-id3v2_version", "3");
        ffmpeg.outputFormat("avi");
        ffmpeg.on("error", (error) => {
            return error;
        });
        ffmpeg.withAudioFilter([]);
        metaName = `yt-dlp-(AudioHighest)-${title}.${outputFormat}`;
        if (stream) {
            return {
                ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

const VideoLowestZod$1 = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
});
async function VideoLowest$1(input) {
    try {
        const { query, stream, verbose, folderName } = VideoLowestZod$1.parse(input);
        const metaBody = await Agent({ query, verbose });
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
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
        const outputFormat = "mkv";
        const ffmpeg = gpuffmpeg(metaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.outputFormat("matroska");
        metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
        ffmpeg.on("error", (error) => {
            return error;
        });
        if (stream) {
            return {
                stream: ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

const VideoHighestZod = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
});
async function VideoHighest(input) {
    try {
        const { query, stream, verbose, folderName } = VideoHighestZod.parse(input);
        const metaBody = await Agent({ query, verbose });
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
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
        const outputFormat = "mkv";
        const ffmpeg = gpuffmpeg(metaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.outputFormat("matroska");
        metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
        ffmpeg.on("error", (error) => {
            return error;
        });
        if (stream) {
            return {
                stream: ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

const AudioVideoLowestZod = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    outputFormat: z$1.enum(["webm", "avi", "mov"]).optional(),
});
async function AudioVideoLowest(input) {
    try {
        const { query, stream, verbose, folderName } = AudioVideoLowestZod.parse(input);
        const metaBody = await Agent({ query, verbose });
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const [AmetaEntry, VmetaEntry] = await Promise.all([
            lowEntry(metaBody.AudioStore),
            lowEntry(metaBody.VideoStore),
        ]);
        if (AmetaEntry === undefined || VmetaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const outputFormat = "mkv";
        const metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
        const ffmpeg = gpuffmpeg(VmetaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.addInput(AmetaEntry.AVDownload.mediaurl);
        ffmpeg.addOutputOption("-shortest");
        ffmpeg.outputFormat("matroska");
        ffmpeg.on("error", (error) => {
            return error;
        });
        if (stream) {
            return {
                stream: ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

const AudioVideoHighestZod = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
});
async function AudioVideoHighest(input) {
    try {
        const { query, stream, verbose, folderName } = AudioVideoHighestZod.parse(input);
        const metaBody = await Agent({ query, verbose });
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const outputFormat = "mkv";
        const metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
        const [AmetaEntry, VmetaEntry] = await Promise.all([
            bigEntry(metaBody.AudioStore),
            bigEntry(metaBody.VideoStore),
        ]);
        if (AmetaEntry === undefined || VmetaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const ffmpeg = gpuffmpeg(VmetaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.addInput(AmetaEntry.AVDownload.mediaurl);
        ffmpeg.outputFormat("matroska");
        ffmpeg.addOption("-shortest");
        ffmpeg.on("error", (error) => {
            return error;
        });
        if (stream) {
            return {
                stream: ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

const AudioQualityCustomZod = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
    quality: z$1.enum(["high", "medium", "low", "ultralow"]),
});
async function AudioQualityCustom(input) {
    try {
        const { query, stream, verbose, quality, folderName } = AudioQualityCustomZod.parse(input);
        const metaResp = await Agent({ query, verbose });
        if (!metaResp) {
            throw new Error("Unable to get response from YouTube...");
        }
        const metaBody = metaResp.AudioStore.filter((op) => op.AVDownload.formatnote === quality);
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
        let metaName = "";
        const title = metaResp.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs.existsSync(metaFold))
            fs.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry(metaBody);
        if (metaEntry === undefined) {
            throw new Error("Unable to get response from YouTube...");
        }
        const outputFormat = "avi";
        const ffmpeg = gpuffmpeg(metaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.addInput(metaResp.metaTube.thumbnail);
        ffmpeg.addOutputOption("-map", "1:0");
        ffmpeg.addOutputOption("-map", "0:a:0");
        ffmpeg.addOutputOption("-id3v2_version", "3");
        ffmpeg.outputFormat("avi");
        ffmpeg.withAudioFilter([]);
        metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
        ffmpeg.on("error", (error) => {
            return error;
        });
        if (stream) {
            return {
                ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
    }
}

const VideoLowestZod = z$1.object({
    query: z$1.string().min(1),
    stream: z$1.boolean().optional(),
    verbose: z$1.boolean().optional(),
    folderName: z$1.string().optional(),
});
async function VideoLowest(input) {
    try {
        const { query, stream, verbose, folderName } = VideoLowestZod.parse(input);
        const metaBody = await Agent({ query, verbose });
        if (!metaBody)
            throw new Error("Unable to get response from YouTube...");
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
        const outputFormat = "mkv";
        const ffmpeg = gpuffmpeg(metaEntry.AVDownload.mediaurl, verbose);
        ffmpeg.outputFormat("matroska");
        metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
        ffmpeg.on("error", (error) => {
            return error;
        });
        if (stream) {
            return {
                stream: ffmpeg,
                filename: folderName
                    ? path.join(metaFold, metaName.replace("-.", "."))
                    : metaName.replace("-.", "."),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ffmpeg.output(path.join(metaFold, metaName));
                ffmpeg.on("end", () => resolve());
                ffmpeg.on("error", reject);
                ffmpeg.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx");
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new Error(colors.red("@error: ") +
                error.errors.map((error) => error.message).join(", "));
        }
        else if (error instanceof Error) {
            throw new Error(colors.red("@error: ") + error.message);
        }
        else
            throw new Error(colors.red("@error: ") + "internal server error");
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
        extract_playlist_videos,
    },
    audio: {
        lowest: AudioLowest,
        highest: AudioHighest,
        custom: AudioQualityCustom,
    },
    video: {
        lowest: VideoLowest$1,
        highest: VideoHighest,
        custom: VideoLowest,
    },
    audio_video: {
        lowest: AudioVideoLowest,
        highest: AudioVideoHighest,
    },
};

export { ytdlx as default };
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
