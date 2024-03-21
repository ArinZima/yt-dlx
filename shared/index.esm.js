/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
import { z } from 'zod';
import colors from 'colors';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';
import { spawn, exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import retry from 'async-retry';
import { promisify } from 'util';
import * as async from 'async';
import ffmpeg from 'fluent-ffmpeg';

async function closers(browser) {
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await browser.close();
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
async function crawler(verbose, onionTor) {
    if (onionTor) {
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
                "--proxy-server=socks5://127.0.0.1:9050",
            ],
        });
    }
    else {
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
            ],
        });
    }
    page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
}

async function VideoInfo(input) {
    let query = "";
    const QuerySchema = z.object({
        query: z
            .string()
            .min(1)
            .refine(async (input) => {
            query = input;
            switch (true) {
                case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(input):
                    const resultLink = await YouTubeID(input);
                    if (resultLink !== undefined)
                        return true;
                    break;
                default:
                    const resultId = await YouTubeID(`https://www.youtube.com/watch?v=${input}`);
                    if (resultId !== undefined)
                        return true;
                    break;
            }
            return false;
        }, {
            message: "Query must be a valid YouTube video Link or ID.",
        }),
        verbose: z.boolean().optional(),
        onionTor: z.boolean().optional(),
        screenshot: z.boolean().optional(),
    });
    const { screenshot, verbose, onionTor } = await QuerySchema.parseAsync(input);
    await crawler(verbose, onionTor);
    await page.goto(query);
    for (let i = 0; i < 40; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    }
    if (screenshot) {
        await page.screenshot({ path: "FilterVideo.png" });
        console.log(colors.yellow("@scrape:"), "took snapshot...");
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
    const TubeResp = {
        views,
        author,
        videoId,
        uploadOn,
        thumbnailUrls,
        title: title.trim(),
        videoLink: "https://www.youtube.com/watch?v=" + videoId,
    };
    console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
    await closers(browser);
    return TubeResp;
}
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));

async function SearchVideos(input) {
    const QuerySchema = z.object({
        query: z
            .string()
            .min(1)
            .refine(async (query) => {
            const result = await YouTubeID(query);
            return result === undefined;
        }, {
            message: "Query must not be a YouTube video/Playlist link",
        }),
        verbose: z.boolean().optional(),
        onionTor: z.boolean().optional(),
        screenshot: z.boolean().optional(),
    });
    const { query, screenshot, verbose, onionTor } = await QuerySchema.parseAsync(input);
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
            url =
                "https://www.youtube.com/results?search_query=" +
                    encodeURIComponent(query) +
                    "&sp=EgIQAQ%253D%253D";
            await page.goto(url);
            for (let i = 0; i < 40; i++) {
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            }
            if (screenshot) {
                await page.screenshot({
                    path: "TypeVideo.png",
                });
                console.log(colors.yellow("@scrape:"), "took snapshot...");
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
                    description: $(vide).find(".metadata-snippet-text").text().trim() || undefined,
                });
            });
            console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
            TubeResp = metaTube;
            break;
        case "playlist":
            url =
                "https://www.youtube.com/results?search_query=" +
                    encodeURIComponent(query) +
                    "&sp=EgIQAw%253D%253D";
            await page.goto(url);
            for (let i = 0; i < 80; i++) {
                await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            }
            if (screenshot) {
                await page.screenshot({
                    path: "TypePlaylist.png",
                });
                console.log(colors.yellow("@scrape:"), "took snapshot...");
            }
            content = await page.content();
            $ = load(content);
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
                    videoCount: parseInt(vCount.replace(/ videos\nNOW PLAYING/g, "")) || undefined,
                });
            });
            console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
            TubeResp = playlistMeta;
            break;
        default:
            console.log(colors.red("@error:"), colors.white("wrong filter type provided."));
            TubeResp = undefined;
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
    const QuerySchema = z.object({
        query: z
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
        verbose: z.boolean().optional(),
        onionTor: z.boolean().optional(),
        screenshot: z.boolean().optional(),
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
            path: "FilterVideo.png",
        });
        console.log(colors.yellow("@scrape:"), "took snapshot...");
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
    console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
    await closers(browser);
    return {
        playlistVideos: metaTube,
        playlistDescription: playlistDescription.trim(),
        playlistVideoCount: metaTube.length,
        playlistViews,
        playlistTitle,
    };
}
process.on("SIGINT", async () => await closers(browser));
process.on("SIGTERM", async () => await closers(browser));
process.on("uncaughtException", async () => await closers(browser));
process.on("unhandledRejection", async () => await closers(browser));

async function playlistVideos({ playlistId, }) {
    const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/playlistVideos?playlistId=${playlistId}`, {
        method: "POST",
    });
    const { result } = await response.json();
    return result;
}

async function relatedVideos({ videoId }) {
    const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/relatedVideos?videoId=${videoId}`, {
        method: "POST",
    });
    const { result } = await response.json();
    return result;
}

async function searchPlaylists({ query }) {
    const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/searchPlaylists?query=${query}`, {
        method: "POST",
    });
    const { result } = await response.json();
    return result;
}

async function searchVideos({ query }) {
    const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/searchVideos?query=${query}`, {
        method: "POST",
    });
    const { result } = await response.json();
    return result;
}

async function singleVideo({ videoId }) {
    const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/singleVideo?videoId=${videoId}`, {
        method: "POST",
    });
    const result = await response.json();
    return result;
}

const web = {
    browser: {
        VideoInfo,
        SearchVideos,
        PlaylistInfo,
    },
    browserLess: {
        singleVideo,
        searchVideos,
        relatedVideos,
        playlistVideos,
        searchPlaylists,
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

const sizeFormat = (filesize) => {
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
};
// =====================================================================================
async function Engine({ query, ipAddress, onionTor, }) {
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
        const enginePath = path.join(dirC, "util", "engine");
        if (fs.existsSync(enginePath)) {
            pLoc = enginePath;
            break;
        }
        else {
            dirC = path.join(dirC, "..");
            maxT--;
        }
    }
    const metaCore = await retry(async () => {
        if (onionTor)
            pLoc += ` --proxy "socks5://127.0.0.1:9050"`;
        pLoc += ` --dump-single-json "${query}"`;
        pLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
        pLoc += ` --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"`;
        return await promisify(exec)(pLoc);
    }, {
        factor: 2,
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 3000,
    });
    const i = JSON.parse(metaCore.stdout.toString());
    i.formats.forEach((tube) => {
        const rm = new Set(["storyboard", "Default"]);
        if (!rm.has(tube.format_note) &&
            tube.protocol === "m3u8_native" &&
            tube.vbr) {
            if (!ManifestLow[tube.resolution] ||
                tube.vbr < ManifestLow[tube.resolution].vbr)
                ManifestLow[tube.resolution] = tube;
            if (!ManifestHigh[tube.resolution] ||
                tube.vbr > ManifestHigh[tube.resolution].vbr)
                ManifestHigh[tube.resolution] = tube;
        }
        if (rm.has(tube.format_note) || tube.filesize === undefined || null)
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
        }
        else if (tube.format_note.includes("HDR")) {
            if (!VideoLowHDR[tube.format_note] ||
                tube.filesize < VideoLowHDR[tube.format_note].filesize)
                VideoLowHDR[tube.format_note] = tube;
            if (!VideoHighHDR[tube.format_note] ||
                tube.filesize > VideoHighHDR[tube.format_note].filesize)
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
                case !AudioLowF || audio.filesize < AudioLowF.filesize:
                    AudioLowF = audio;
                    break;
                case !AudioHighF || audio.filesize > AudioHighF.filesize:
                    AudioHighF = audio;
                    break;
            }
        }
    });
    Object.values(VideoLow).forEach((video) => {
        if (video.filesize !== null) {
            switch (true) {
                case !VideoLowF || video.filesize < VideoLowF.filesize:
                    VideoLowF = video;
                    break;
                case !VideoHighF || video.filesize > VideoHighF.filesize:
                    VideoHighF = video;
                    break;
            }
        }
    });
    function propfilter(formats) {
        return formats.filter((i) => {
            return !i.format_note.includes("DRC") && !i.format_note.includes("HDR");
        });
    }
    const payLoad = {
        ipAddress,
        AudioLowF: (() => {
            const i = AudioLowF || {};
            return nAudio(i);
        })(),
        AudioHighF: (() => {
            const i = AudioHighF || {};
            return nAudio(i);
        })(),
        VideoLowF: (() => {
            const i = VideoLowF || {};
            return nVideo(i);
        })(),
        VideoHighF: (() => {
            const i = VideoHighF || {};
            return nVideo(i);
        })(),
        AudioLowDRC: Object.values(AudioLowDRC).map((i) => pAudio(i)),
        AudioHighDRC: Object.values(AudioHighDRC).map((i) => pAudio(i)),
        AudioLow: propfilter(Object.values(AudioLow)).map((i) => pAudio(i)),
        AudioHigh: propfilter(Object.values(AudioHigh)).map((i) => pAudio(i)),
        VideoLowHDR: Object.values(VideoLowHDR).map((i) => pVideo(i)),
        VideoHighHDR: Object.values(VideoHighHDR).map((i) => pVideo(i)),
        VideoLow: propfilter(Object.values(VideoLow)).map((i) => pVideo(i)),
        VideoHigh: propfilter(Object.values(VideoHigh)).map((i) => pVideo(i)),
        ManifestLow: Object.values(ManifestLow).map((i) => pManifest(i)),
        ManifestHigh: Object.values(ManifestHigh).map((i) => pManifest(i)),
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
            duration_string: i.duration_string,
        },
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
        format: i.format,
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
        format: i.format,
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
        format: i.format,
    };
}

var version = "5.21.0";

async function Agent({ query, verbose, onionTor, }) {
    console.log(colors.green("@info:"), "using", colors.green("yt-dlx"), "version", colors.green(version));
    let nipTor;
    let ipAddress = undefined;
    nipTor = await niptor(["curl https://checkip.amazonaws.com --insecure"]);
    console.log(colors.green("@info:"), "system", colors.green("ipAddress"), nipTor.stdout.trim());
    ipAddress = nipTor.stdout.trim();
    if (onionTor) {
        nipTor = await niptor([
            "systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure",
        ]);
        if (nipTor.stdout.trim().length > 0) {
            console.log(colors.green("@info:"), "socks5", colors.green("ipAddress"), nipTor.stdout.trim());
            ipAddress = nipTor.stdout.trim();
        }
        else
            throw new Error("Unable to connect to Tor.");
    }
    let TubeBody;
    let respEngine = undefined;
    let videoId = await YouTubeID(query);
    if (!videoId) {
        TubeBody = await web.browserLess.searchVideos({ query });
        if (!TubeBody[0])
            throw new Error("Unable to get response!");
        else {
            console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody[0].title));
            respEngine = await Engine({
                query: `https://www.youtube.com/watch?v=${TubeBody[0].id}`,
                onionTor,
                ipAddress,
            });
            return respEngine;
        }
    }
    else {
        TubeBody = await web.browserLess.singleVideo({ videoId });
        if (!TubeBody)
            throw new Error("Unable to get response!");
        else {
            console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody.title));
            respEngine = await Engine({
                query: `https://www.youtube.com/watch?v=${TubeBody.id}`,
                onionTor,
                ipAddress,
            });
            return respEngine;
        }
    }
}

async function extract({ query, verbose, onionTor, }) {
    const metaBody = await Agent({ query, verbose, onionTor });
    if (!metaBody) {
        return {
            message: "Unable to get response from YouTube...",
            status: 500,
        };
    }
    const uploadDate = new Date(metaBody.metaData.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    const currentDate = new Date();
    const daysAgo = Math.floor((currentDate.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
    const prettyDate = uploadDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const uploadAgoObject = calculateUploadAgo(daysAgo);
    const videoTimeInSeconds = metaBody.metaData.duration;
    const videoDuration = calculateVideoDuration(videoTimeInSeconds);
    const viewCountFormatted = formatCount(metaBody.metaData.view_count);
    const likeCountFormatted = formatCount(metaBody.metaData.like_count);
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
            channel_follower_count_formatted: formatCount(metaBody.metaData.channel_follower_count),
        },
    };
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    return payload;
}

async function list_formats({ query, verbose, onionTor, }) {
    const metaBody = await Agent({ query, verbose, onionTor });
    if (!metaBody) {
        throw new Error("@error: Unable to get response from YouTube.");
    }
    else {
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
    console.log(colors.green(title) + ":");
    data.forEach((item) => {
        console.log(" ".repeat(4), item.filesizeP.padEnd(10), "|", item.format_note);
    });
    console.log("");
}
function printManifestTable(title, data) {
    console.log(colors.green(title) + ":");
    data.forEach((item) => {
        console.log(" ".repeat(4), item.format.padEnd(10), "|", item.tbr);
    });
    console.log("");
}

async function extract_playlist_videos({ playlistUrls, }) {
    let counter = 0;
    const metaTubeArr = [];
    await async.eachSeries(playlistUrls, async (listLink) => {
        const query = await YouTubeID(listLink);
        if (query === undefined) {
            console.error(colors.bold.red("@error: "), "invalid youtube playlist url:", listLink);
            return;
        }
        else {
            const playlistId = await YouTubeID(query);
            if (!playlistId) {
                console.error(colors.bold.red("@error: "), "incorrect playlist link.", query);
                return;
            }
            const resp = await web.browserLess.playlistVideos({
                playlistId,
            });
            if (!resp) {
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
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    return metaTubeArr;
}

function formatTime(seconds) {
    if (!isFinite(seconds) || isNaN(seconds))
        return "00h 00m 00s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, "0")}h ${minutes
        .toString()
        .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
}

function calculateETA(startTime, percent) {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;
    const remainingTime = (elapsedTime / percent) * (100 - percent);
    return remainingTime.toFixed(2);
}

/**
 * AudioLowest function is designed for fetching lowest audio content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply audio filters like echo, flanger, nightcore, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$9 = z.object({
    query: z.string().min(1),
    output: z.string().optional(),
    stream: z.boolean().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    filter: z
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
    let startTime;
    const { query, output, stream, verbose, filter, onionTor } = await qconf$9.parseAsync(input);
    const engineData = await Agent({ query, verbose, onionTor });
    if (engineData === undefined) {
        throw new Error(colors.red("@error: ") + "unable to get response from YouTube.");
    }
    else {
        const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
        const folder = output ? path.join(process.cwd(), output) : process.cwd();
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder, { recursive: true });
        let filename = "yt-dlx_(AudioLowest_";
        const ff = ffmpeg();
        ff.addInput(engineData.AudioLowF.url);
        ff.addInput(engineData.metaData.thumbnail);
        ff.outputOptions(["-c", "copy"]);
        ff.withOutputFormat("avi");
        ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
        switch (filter) {
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
            startTime = new Date();
            if (verbose)
                console.info(colors.green("@comd:"), comd);
        });
        ff.on("end", () => process.stdout.write("\n"));
        ff.on("progress", ({ percent, timemark }) => {
            let color = colors.green;
            if (isNaN(percent))
                percent = 0;
            if (percent > 98)
                percent = 100;
            if (percent < 25)
                color = colors.red;
            else if (percent < 50)
                color = colors.yellow;
            const width = Math.floor(process.stdout.columns / 4);
            const scomp = Math.round((width * percent) / 100);
            const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
            process.stdout.write(`\r${color("@prog:")} ${progb}` +
                ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                ` ${color("| @timemark:")} ${timemark}` +
                ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
        });
        if (stream) {
            return {
                ffmpeg: ff,
                filename: output
                    ? path.join(folder, filename)
                    : filename.replace("_)_", ")_"),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    reject(new Error(colors.red("@error: ") + error.message));
                });
                ff.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the GitHub repo", colors.green("https://github.com/yt-dlx\n"));
    }
}

/**
 * AudioHighest function is designed for fetching highest audio content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply audio filters like echo, flanger, nightcore, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$8 = z.object({
    query: z.string().min(1),
    output: z.string().optional(),
    stream: z.boolean().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    filter: z
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
    let startTime;
    const { query, output, stream, verbose, filter, onionTor } = await qconf$8.parseAsync(input);
    const engineData = await Agent({ query, verbose, onionTor });
    if (engineData === undefined) {
        throw new Error(colors.red("@error: ") + "unable to get response from YouTube.");
    }
    else {
        const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
        const folder = output ? path.join(process.cwd(), output) : process.cwd();
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder, { recursive: true });
        let filename = "yt-dlx_(AudioHighest_";
        const ff = ffmpeg();
        ff.addInput(engineData.AudioHighF.url);
        ff.addInput(engineData.metaData.thumbnail);
        ff.outputOptions(["-c", "copy"]);
        ff.withOutputFormat("avi");
        ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
        switch (filter) {
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
            startTime = new Date();
            if (verbose)
                console.info(colors.green("@comd:"), comd);
        });
        ff.on("end", () => process.stdout.write("\n"));
        ff.on("progress", ({ percent, timemark }) => {
            let color = colors.green;
            if (isNaN(percent))
                percent = 0;
            if (percent > 98)
                percent = 100;
            if (percent < 25)
                color = colors.red;
            else if (percent < 50)
                color = colors.yellow;
            const width = Math.floor(process.stdout.columns / 4);
            const scomp = Math.round((width * percent) / 100);
            const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
            process.stdout.write(`\r${color("@prog:")} ${progb}` +
                ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                ` ${color("| @timemark:")} ${timemark}` +
                ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
        });
        if (stream) {
            return {
                ffmpeg: ff,
                filename: output
                    ? path.join(folder, filename)
                    : filename.replace("_)_", ")_"),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    reject(new Error(colors.red("@error: ") + error.message));
                });
                ff.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the GitHub repo", colors.green("https://github.com/yt-dlx\n"));
    }
}

const qconf$7 = z.object({
    output: z.string().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    query: z
        .array(z
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
    filter: z
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
    let startTime;
    const { query, output, verbose, filter, onionTor } = await qconf$7.parseAsync(input);
    const vDATA = new Set();
    for (const pURL of query) {
        try {
            const pDATA = await web.browserLess.playlistVideos({
                playlistId: (await YouTubeID(pURL)),
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
                onionTor,
                verbose,
            });
            if (engineData === undefined) {
                console.log(colors.red("@error:"), "unable to get response from youtube for", video.videoLink);
                continue;
            }
            const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path.join(process.cwd(), output) : process.cwd();
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder, { recursive: true });
            let filename = "yt-dlx_(AudioLowest_";
            const ff = ffmpeg();
            ff.addInput(engineData.AudioLowF.url);
            ff.addInput(engineData.metaData.thumbnail);
            ff.outputOptions(["-c", "copy"]);
            ff.withOutputFormat("avi");
            ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
            switch (filter) {
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
                startTime = new Date();
                if (verbose)
                    console.info(colors.green("@comd:"), comd);
            });
            ff.on("end", () => process.stdout.write("\n"));
            ff.on("progress", ({ percent, timemark }) => {
                let color = colors.green;
                if (isNaN(percent))
                    percent = 0;
                if (percent > 98)
                    percent = 100;
                if (percent < 25)
                    color = colors.red;
                else if (percent < 50)
                    color = colors.yellow;
                const width = Math.floor(process.stdout.columns / 4);
                const scomp = Math.round((width * percent) / 100);
                const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
                process.stdout.write(`\r${color("@prog:")} ${progb}` +
                    ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                    ` ${color("| @timemark:")} ${timemark}` +
                    ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
            });
            await new Promise((resolve, _reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    throw new Error(colors.red("@error: ") + error.message);
                });
                ff.run();
            });
        }
        catch (error) {
            console.log(colors.red("@error:"), error);
            continue;
        }
    }
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
}

const qconf$6 = z.object({
    output: z.string().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    query: z
        .array(z
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
    filter: z
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
    let startTime;
    const { query, output, verbose, filter, onionTor } = await qconf$6.parseAsync(input);
    const vDATA = new Set();
    for (const pURL of query) {
        try {
            const pDATA = await web.browserLess.playlistVideos({
                playlistId: (await YouTubeID(pURL)),
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
                onionTor,
                verbose,
            });
            if (engineData === undefined) {
                console.log(colors.red("@error:"), "unable to get response from youtube for", video.videoLink);
                continue;
            }
            const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path.join(process.cwd(), output) : process.cwd();
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder, { recursive: true });
            let filename = "yt-dlx_(AudioHighest_";
            const ff = ffmpeg();
            ff.addInput(engineData.AudioHighF.url);
            ff.addInput(engineData.metaData.thumbnail);
            ff.outputOptions(["-c", "copy"]);
            ff.withOutputFormat("avi");
            ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
            switch (filter) {
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
                startTime = new Date();
                if (verbose)
                    console.info(colors.green("@comd:"), comd);
            });
            ff.on("end", () => process.stdout.write("\n"));
            ff.on("progress", ({ percent, timemark }) => {
                let color = colors.green;
                if (isNaN(percent))
                    percent = 0;
                if (percent > 98)
                    percent = 100;
                if (percent < 25)
                    color = colors.red;
                else if (percent < 50)
                    color = colors.yellow;
                const width = Math.floor(process.stdout.columns / 4);
                const scomp = Math.round((width * percent) / 100);
                const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
                process.stdout.write(`\r${color("@prog:")} ${progb}` +
                    ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                    ` ${color("| @timemark:")} ${timemark}` +
                    ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
            });
            await new Promise((resolve, _reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    throw new Error(colors.red("@error: ") + error.message);
                });
                ff.run();
            });
        }
        catch (error) {
            console.log(colors.red("@error:"), error);
            continue;
        }
    }
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
}

/**
 * VideoLowest function is designed for fetching lowest video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$5 = z.object({
    query: z.string().min(1),
    output: z.string().optional(),
    stream: z.boolean().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    filter: z
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
    let startTime;
    const { query, stream, verbose, output, filter, onionTor } = await qconf$5.parseAsync(input);
    const engineData = await Agent({ query, verbose, onionTor });
    if (engineData === undefined) {
        throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
    }
    else {
        const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
        const folder = output ? path.join(process.cwd(), output) : process.cwd();
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder, { recursive: true });
        const ff = ffmpeg();
        const vdata = Array.isArray(engineData.ManifestLow) && engineData.ManifestLow.length > 0
            ? engineData.ManifestLow[0]?.url
            : undefined;
        if (vdata)
            ff.addInput(vdata.toString());
        else
            throw new Error(colors.red("@error: ") + "no video data found.");
        ff.outputOptions(["-c", "copy"]);
        ff.withOutputFormat("matroska");
        ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
        let filename = "yt-dlx_(VideoLowest_";
        switch (filter) {
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
            startTime = new Date();
            if (verbose)
                console.info(colors.green("@comd:"), comd);
        });
        ff.on("end", () => process.stdout.write("\n"));
        ff.on("progress", ({ percent, timemark }) => {
            let color = colors.green;
            if (isNaN(percent))
                percent = 0;
            if (percent > 98)
                percent = 100;
            if (percent < 25)
                color = colors.red;
            else if (percent < 50)
                color = colors.yellow;
            const width = Math.floor(process.stdout.columns / 4);
            const scomp = Math.round((width * percent) / 100);
            const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
            process.stdout.write(`\r${color("@prog:")} ${progb}` +
                ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                ` ${color("| @timemark:")} ${timemark}` +
                ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
        });
        if (stream) {
            return {
                ffmpeg: ff,
                filename: output
                    ? path.join(folder, filename)
                    : filename.replace("_)_", ")_"),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    reject(new Error(colors.red("@error: ") + error.message));
                });
                ff.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
}

/**
 * VideoHighest function is designed for fetching highest video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf$4 = z.object({
    query: z.string().min(1),
    output: z.string().optional(),
    stream: z.boolean().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    filter: z
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
    let startTime;
    const { query, stream, verbose, output, filter, onionTor } = await qconf$4.parseAsync(input);
    const engineData = await Agent({ query, verbose, onionTor });
    if (engineData === undefined) {
        throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
    }
    else {
        const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
        const folder = output ? path.join(process.cwd(), output) : process.cwd();
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder, { recursive: true });
        const ff = ffmpeg();
        const vdata = Array.isArray(engineData.ManifestHigh) &&
            engineData.ManifestHigh.length > 0
            ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url
            : undefined;
        if (vdata)
            ff.addInput(vdata.toString());
        else
            throw new Error(colors.red("@error: ") + "no video data found.");
        ff.outputOptions(["-c", "copy"]);
        ff.withOutputFormat("matroska");
        ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
        let filename = "yt-dlx_(VideoHighest_";
        switch (filter) {
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
            startTime = new Date();
            if (verbose)
                console.info(colors.green("@comd:"), comd);
        });
        ff.on("end", () => process.stdout.write("\n"));
        ff.on("progress", ({ percent, timemark }) => {
            let color = colors.green;
            if (isNaN(percent))
                percent = 0;
            if (percent > 98)
                percent = 100;
            if (percent < 25)
                color = colors.red;
            else if (percent < 50)
                color = colors.yellow;
            const width = Math.floor(process.stdout.columns / 4);
            const scomp = Math.round((width * percent) / 100);
            const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
            process.stdout.write(`\r${color("@prog:")} ${progb}` +
                ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                ` ${color("| @timemark:")} ${timemark}` +
                ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
        });
        if (stream) {
            return {
                ffmpeg: ff,
                filename: output
                    ? path.join(folder, filename)
                    : filename.replace("_)_", ")_"),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    reject(new Error(colors.red("@error: ") + error.message));
                });
                ff.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
}

const qconf$3 = z.object({
    output: z.string().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    query: z
        .array(z
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
    filter: z
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
    let startTime;
    const { query, verbose, output, filter, onionTor } = await qconf$3.parseAsync(input);
    const vDATA = new Set();
    for (const pURL of query) {
        try {
            const pDATA = await web.browserLess.playlistVideos({
                playlistId: (await YouTubeID(pURL)),
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
                onionTor,
                verbose,
            });
            if (engineData === undefined) {
                console.log(colors.red("@error:"), "unable to get response from youtube.");
                continue;
            }
            const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path.join(process.cwd(), output) : process.cwd();
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder, { recursive: true });
            let filename = "yt-dlx_(VideoLowest_";
            const ff = ffmpeg();
            const vdata = Array.isArray(engineData.ManifestLow) &&
                engineData.ManifestLow.length > 0
                ? engineData.ManifestLow[0]?.url
                : undefined;
            if (vdata)
                ff.addInput(vdata.toString());
            else
                throw new Error(colors.red("@error: ") + "no video data found.");
            ff.outputOptions(["-c", "copy"]);
            ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
            ff.withOutputFormat("matroska");
            switch (filter) {
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
                startTime = new Date();
                if (verbose)
                    console.info(colors.green("@comd:"), comd);
            });
            ff.on("end", () => process.stdout.write("\n"));
            ff.on("progress", ({ percent, timemark }) => {
                let color = colors.green;
                if (isNaN(percent))
                    percent = 0;
                if (percent > 98)
                    percent = 100;
                if (percent < 25)
                    color = colors.red;
                else if (percent < 50)
                    color = colors.yellow;
                const width = Math.floor(process.stdout.columns / 4);
                const scomp = Math.round((width * percent) / 100);
                const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
                process.stdout.write(`\r${color("@prog:")} ${progb}` +
                    ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                    ` ${color("| @timemark:")} ${timemark}` +
                    ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
            });
            await new Promise((resolve, _reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    throw new Error(colors.red("@error: ") + error.message);
                });
                ff.run();
            });
        }
        catch (error) {
            console.log(colors.red("@error:"), error);
            continue;
        }
    }
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
}

const qconf$2 = z.object({
    output: z.string().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    query: z
        .array(z
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
    filter: z
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
    let startTime;
    const { query, verbose, output, filter, onionTor } = await qconf$2.parseAsync(input);
    const vDATA = new Set();
    for (const pURL of query) {
        try {
            const pDATA = await web.browserLess.playlistVideos({
                playlistId: (await YouTubeID(pURL)),
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
                onionTor,
                verbose,
            });
            if (engineData === undefined) {
                console.log(colors.red("@error:"), "unable to get response from youtube.");
                continue;
            }
            const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
            const folder = output ? path.join(process.cwd(), output) : process.cwd();
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder, { recursive: true });
            let filename = "yt-dlx_(VideoHighest_";
            const ff = ffmpeg();
            const vdata = Array.isArray(engineData.ManifestHigh) &&
                engineData.ManifestHigh.length > 0
                ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url
                : undefined;
            if (vdata)
                ff.addInput(vdata.toString());
            else
                throw new Error(colors.red("@error: ") + "no video data found.");
            ff.outputOptions(["-c", "copy"]);
            ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
            ff.withOutputFormat("matroska");
            switch (filter) {
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
                startTime = new Date();
                if (verbose)
                    console.info(colors.green("@comd:"), comd);
            });
            ff.on("end", () => process.stdout.write("\n"));
            ff.on("progress", ({ percent, timemark }) => {
                let color = colors.green;
                if (isNaN(percent))
                    percent = 0;
                if (percent > 98)
                    percent = 100;
                if (percent < 25)
                    color = colors.red;
                else if (percent < 50)
                    color = colors.yellow;
                const width = Math.floor(process.stdout.columns / 4);
                const scomp = Math.round((width * percent) / 100);
                const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
                process.stdout.write(`\r${color("@prog:")} ${progb}` +
                    ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                    ` ${color("| @timemark:")} ${timemark}` +
                    ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
            });
            await new Promise((resolve, _reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    throw new Error(colors.red("@error: ") + error.message);
                });
                ff.run();
            });
        }
        catch (error) {
            console.log(colors.red("@error:"), error);
            continue;
        }
    }
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
}

const qconf$1 = z.object({
    query: z.string().min(1),
    output: z.string().optional(),
    stream: z.boolean().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    filter: z
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
    let startTime;
    const { query, stream, verbose, output, filter, onionTor } = await qconf$1.parseAsync(input);
    const engineData = await Agent({ query, verbose, onionTor });
    if (engineData === undefined) {
        throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
    }
    else {
        const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
        const folder = output ? path.join(process.cwd(), output) : process.cwd();
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder, { recursive: true });
        const ff = ffmpeg();
        const vdata = Array.isArray(engineData.ManifestHigh) &&
            engineData.ManifestHigh.length > 0
            ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url
            : undefined;
        ff.addInput(engineData.AudioHighF.url);
        if (vdata)
            ff.addInput(vdata.toString());
        else
            throw new Error(colors.red("@error: ") + "no video data found.");
        ff.outputOptions(["-c", "copy"]);
        ff.withOutputFormat("matroska");
        ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
        let filename = "yt-dlx_(AudioVideoHighest_";
        switch (filter) {
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
            startTime = new Date();
            if (verbose)
                console.info(colors.green("@comd:"), comd);
        });
        ff.on("end", () => process.stdout.write("\n"));
        ff.on("progress", ({ percent, timemark }) => {
            let color = colors.green;
            if (isNaN(percent))
                percent = 0;
            if (percent > 98)
                percent = 100;
            if (percent < 25)
                color = colors.red;
            else if (percent < 50)
                color = colors.yellow;
            const width = Math.floor(process.stdout.columns / 4);
            const scomp = Math.round((width * percent) / 100);
            const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
            process.stdout.write(`\r${color("@prog:")} ${progb}` +
                ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                ` ${color("| @timemark:")} ${timemark}` +
                ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
        });
        if (stream) {
            return {
                ffmpeg: ff,
                filename: output
                    ? path.join(folder, filename)
                    : filename.replace("_)_", ")_"),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    reject(new Error(colors.red("@error: ") + error.message));
                });
                ff.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
}

const qconf = z.object({
    query: z.string().min(1),
    output: z.string().optional(),
    stream: z.boolean().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    filter: z
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
    let startTime;
    const { query, stream, verbose, output, filter, onionTor } = await qconf.parseAsync(input);
    const engineData = await Agent({ query, verbose, onionTor });
    if (engineData === undefined) {
        throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
    }
    else {
        const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
        const folder = output ? path.join(process.cwd(), output) : process.cwd();
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder, { recursive: true });
        const ff = ffmpeg();
        const vdata = Array.isArray(engineData.ManifestLow) && engineData.ManifestLow.length > 0
            ? engineData.ManifestLow[0]?.url
            : undefined;
        ff.addInput(engineData.AudioLowF.url);
        if (vdata)
            ff.addInput(vdata.toString());
        else
            throw new Error(colors.red("@error: ") + "no video data found.");
        ff.outputOptions(["-c", "copy"]);
        ff.withOutputFormat("matroska");
        ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
        let filename = "yt-dlx_(AudioVideoLowest_";
        switch (filter) {
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
            startTime = new Date();
            if (verbose)
                console.info(colors.green("@comd:"), comd);
        });
        ff.on("end", () => process.stdout.write("\n"));
        ff.on("progress", ({ percent, timemark }) => {
            let color = colors.green;
            if (isNaN(percent))
                percent = 0;
            if (percent > 98)
                percent = 100;
            if (percent < 25)
                color = colors.red;
            else if (percent < 50)
                color = colors.yellow;
            const width = Math.floor(process.stdout.columns / 4);
            const scomp = Math.round((width * percent) / 100);
            const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
            process.stdout.write(`\r${color("@prog:")} ${progb}` +
                ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                ` ${color("| @timemark:")} ${timemark}` +
                ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`);
        });
        if (stream) {
            return {
                ffmpeg: ff,
                filename: output
                    ? path.join(folder, filename)
                    : filename.replace("_)_", ")_"),
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ff.output(path.join(folder, filename.replace("_)_", ")_")));
                ff.on("end", () => resolve());
                ff.on("error", (error) => {
                    reject(new Error(colors.red("@error: ") + error.message));
                });
                ff.run();
            });
        }
        console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    }
}

const ytdlx = {
    search: {
        browser: {
            SearchVideos: web.browser.SearchVideos,
            PlaylistInfo: web.browser.PlaylistInfo,
            VideoInfo: web.browser.VideoInfo,
        },
        browserLess: {
            playlistVideos: web.browserLess.playlistVideos,
            relatedVideos: web.browserLess.relatedVideos,
            searchPlaylists: web.browserLess.searchPlaylists,
            searchVideos: web.browserLess.searchVideos,
            singleVideo: web.browserLess.singleVideo,
        },
    },
    info: {
        help,
        extract,
        list_formats,
        extract_playlist_videos,
    },
    AudioOnly: {
        Single: {
            Lowest: AudioLowest,
            Highest: AudioHighest,
        },
        List: {
            Lowest: ListAudioLowest,
            Highest: ListAudioHighest,
        },
    },
    VideoOnly: {
        Single: {
            Lowest: VideoLowest,
            Highest: VideoHighest,
        },
        List: {
            Lowest: ListVideoLowest,
            Highest: ListVideoHighest,
        },
    },
    AudioVideo: {
        Single: {
            Lowest: AudioVideoLowest,
            Highest: AudioVideoHighest,
        },
        List: {},
    },
};

export { ytdlx as default };
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
