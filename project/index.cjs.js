/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands out as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
'use strict';

var colors = require('colors');
var playwright = require('playwright');
var YouTubeID = require('@shovit/ytid');
var z = require('zod');
var search$1 = require('yt-search');
var fs = require('fs');
var path = require('path');
var fluentffmpeg = require('fluent-ffmpeg');
var axios = require('axios');
var stream = require('stream');
var readline = require('readline');
var async = require('async');

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

var z__namespace = /*#__PURE__*/_interopNamespaceDefault(z);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

function help() {
    return Promise.resolve(colors.bold.white(`
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕
┃                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                    ┃
┃                                            (License: MIT)                                                   ┃
┃                                         [Owner: ShovitDutta]                                                ┃
┃                                       { Web: rebrand.ly/mixly }                                             ┃
┃                                                                                                             ┃
┃                               Supports both async/await and promise.then()                                  ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                    ┃
┃─────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INSTALLATION  ┃ ❝ LOCALLY: ❞                                                                                ┃
┃               ┃   bun add yt-dlp                                                                           ┃
┃               ┃   yarn add yt-dlp                                                                          ┃
┃               ┃   npm install yt-dlp                                                                       ┃
┃               ┃   pnpm install yt-dlp                                                                      ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ GLOBALLY: ❞                                                                               ┃
┃               ┃   yarn global add yt-dlp                                                   (use cli)       ┃
┃               ┃   npm install --global yt-dlp                                              (use cli)       ┃
┃               ┃   pnpm install --global yt-dlp                                             (use cli)       ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃    FILTERS    ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   bassboost                  echo                                                           ┃
┃               ┃   flanger                    nightdlp                                                      ┃
┃               ┃   panning                    phaser                                                         ┃
┃               ┃   reverse                    slow                                                           ┃
┃               ┃   speed                      subboost                                                       ┃
┃               ┃   superslow                  superspeed                                                     ┃
┃               ┃   surround                   vaporwave                                                      ┃
┃               ┃   vibrato                                                                                   ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   grayscale                                                                                 ┃
┃               ┃   invert                                                                                    ┃
┃               ┃   rotate90                                                                                  ┃
┃               ┃   rotate180                                                                                 ┃
┃               ┃   rotate270                                                                                 ┃
┃               ┃   flipHorizontal                                                                            ┃
┃               ┃   flipVertical                                                                              ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃   CLI USAGE   ┃ ❝ INFO GRABBERS: ❞                                                                          ┃
┃               ┃   yt-dlp version                                                             (alias: v)    ┃
┃               ┃   yt-dlp help                                                                (alias: h)    ┃
┃               ┃   yt-dlp extract --query="video/url"                                         (alias: e)    ┃
┃               ┃   yt-dlp search-yt --query="video/url"                                       (alias: s)    ┃
┃               ┃   yt-dlp list-formats --query="video/url"                                    (alias: f)    ┃ 
┃               ┃   yt-dlp get-video-data --query="video/url"                                  (alias: gvd)  ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   yt-dlp audio-lowest --query="video/url"                                    (alias: al)   ┃
┃               ┃   yt-dlp audio-highest --query="video/url"                                   (alias: ah)   ┃
┃               ┃   yt-dlp audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)  ┃
┃               ┃       ──────────────────────────────────────────────────────────────                        ┃
┃               ┃   yt-dlp audio-lowest --query="video/url" --filter="valid-filter"            (filter)      ┃
┃               ┃   yt-dlp audio-highest --query="video/url" --filter="valid-filter"           (filter)      ┃
┃               ┃   yt-dlp audio-quality-custom --query="video/url" --format="valid-format"    ........      ┃
┃               ┃                                                   --filter="valid-filter"    (filter)       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   yt-dlp video-lowest --query="video/url"                                    (alias: vl)   ┃
┃               ┃   yt-dlp video-highest --query="video/url"                                   (alias: vh)   ┃
┃               ┃   yt-dlp video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)  ┃
┃               ┃       ──────────────────────────────────────────────────────────────                        ┃
┃               ┃   yt-dlp video-lowest --query="video/url" --filter="valid-filter"            (filter)      ┃
┃               ┃   yt-dlp video-highest --query="video/url" --filter="valid-filter"           (filter)      ┃
┃               ┃   yt-dlp video-quality-custom --query="video/url" --format="valid-format"    ........      ┃
┃               ┃                                                   --filter="valid-filter"    (filter)       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                      ┃
┃               ┃   yt-dlp audio-video-lowest --query="video/url"                              (alias: avl)  ┃
┃               ┃   yt-dlp audio-video-highest --query="video/url"                             (alias: avh)  ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃   IMPORTING   ┃   import ytdlp from "yt-dlp";                                            TypeScript (ts)   ┃
┃               ┃   import ytdlp from "yt-dlp";                                            ECMAScript (esm)  ┃
┃               ┃   const ytdlp = require("yt-dlp");                                       CommonJS   (cjs)  ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INFO GRABBERS ┃   ytdlp.info.help();                                                                        ┃
┃               ┃   ytdlp.info.search({ query: "" });                                                         ┃
┃               ┃   ytdlp.info.extract({ query: "" });                                                        ┃
┃               ┃   ytdlp.info.list_formats({ query: "" });                                                   ┃
┃               ┃   ytdlp.info.get_video_data({ query: "" });                                                 ┃
┃               ┃   ytdlp.extract_playlist_videos({ playlistUrls: ["", "", "", ""] });                        ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃  DOWNLOADERS  ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.audio.download.lowest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlp.audio.download.highest({ query: "", filter: "" });                                  ┃
┃               ┃   ytdlp.audio.download.custom({ query: "", format: "", filter: "" });                       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.video.download.lowest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlp.video.download.highest({ query: "", filter: "" });                                  ┃
┃               ┃   ytdlp.video.download.custom({ query: "", filter: "" });                                   ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                      ┃
┃               ┃   ytdlp.audio_video.download.lowest({ query: "" });                                         ┃
┃               ┃   ytdlp.audio_video.download.highest({ query: "" });                                        ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃  MEDIA PIPE   ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.audio.pipe.lowest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlp.audio.pipe.highest({ query: "", filter: "" });                                      ┃
┃               ┃   ytdlp.audio.pipe.custom({ query: "", format: "", filter: "" });                           ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.video.pipe.lowest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlp.video.pipe.highest({ query: "", filter: "" });                                      ┃
┃               ┃   ytdlp.video.pipe.custom({ query: "", filter: "" });                                       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                      ┃
┃               ┃   ytdlp.audio_video.pipe.lowest({ query: "" });                                             ┃
┃               ┃   ytdlp.audio_video.pipe.highest({ query: "" });                                            ┃
┃─────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                    ┃
┃                                            (License: MIT)                                                   ┃
┃                                         [Owner: ShovitDutta]                                                ┃
┃                                       { Web: rebrand.ly/mixly }                                             ┃
┃                                                                                                             ┃
┃                               Supports both async/await and promise.then()                                  ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                    ┃
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕`));
}

async function ytcprox({ query, route, domain, }) {
    const browser = await playwright.chromium.launch({ headless: true });
    try {
        const host = `${domain}/${route}?query=${decodeURIComponent(query)}`;
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(host);
        await page.waitForSelector("button[class*=ring-blue-600]", {
            timeout: 10000,
        });
        await page.click("button[class*=ring-blue-600]");
        const payLoad = await new Promise((resolve) => {
            page.on("requestfinished", async (request) => {
                if (request.url().includes("/" + route)) {
                    const response = await request.response();
                    if (!response)
                        return resolve(null);
                    else
                        return resolve(await response.json());
                }
                else
                    return resolve(null);
            });
        });
        return JSON.stringify(payLoad);
    }
    catch (error) {
        console.log(colors.red("ERROR:"), error);
        return null;
    }
    finally {
        await browser.close();
    }
}

async function scrape(query) {
    try {
        const response = await ytcprox({
            query,
            route: "scrape",
            domain: "https://casual-insect-sunny.ngrok-free.app",
        });
        if (response !== null)
            return decodeURIComponent(response);
        else
            return null;
    }
    catch (error) {
        return null;
    }
}

async function search({ query }) {
    try {
        switch (true) {
            case !query || typeof query !== "string":
                return {
                    message: "Invalid query parameter",
                    status: 500,
                };
            default:
                return await scrape(query);
        }
    }
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return {
                    message: error.message,
                    status: 500,
                };
            default:
                return {
                    message: "Internal server error",
                    status: 500,
                };
        }
    }
}

async function ytdlp$1(query) {
    try {
        const response = await ytcprox({
            query,
            route: "core",
            domain: "https://casual-insect-sunny.ngrok-free.app",
        });
        if (response !== null)
            return decodeURIComponent(response);
        else
            return null;
    }
    catch (error) {
        return null;
    }
}

var version = "20.0.0";

async function Engine({ query, }) {
    let videoId, TubeDlp, TubeBody;
    console.log(colors.bold.green("\n\nINFO: ") +
        `⭕ using yt-dlp version <(${version})>` +
        colors.reset(""));
    if (!query || query.trim() === "") {
        console.log(colors.bold.red("ERROR: ") + "❗'query' is required..." + colors.reset(""));
        return null;
    }
    else if (/https/i.test(query) && /list/i.test(query)) {
        console.log(colors.bold.red("ERROR: ") +
            "❗use extract_playlist_videos() for playlists..." +
            colors.reset(""));
        return null;
    }
    else if (/https/i.test(query) && !/list/i.test(query)) {
        console.log(colors.bold.green("INFO: ") +
            `🛰️ fetching metadata for: <(${query})>` +
            colors.reset(""));
        videoId = await YouTubeID(query);
    }
    else
        videoId = await YouTubeID(query);
    switch (videoId) {
        case null:
            TubeBody = await scrape(query);
            if (TubeBody === null) {
                console.log(colors.bold.red("ERROR: ") +
                    "❗no data returned from server..." +
                    colors.reset(""));
                return null;
            }
            else
                TubeBody = JSON.parse(TubeBody);
            console.log(colors.bold.green("INFO: ") +
                `📡preparing payload for <(${TubeBody.Title} Author: ${TubeBody.Uploader})>` +
                colors.reset(""));
            TubeDlp = await ytdlp$1(TubeBody.Link);
            break;
        default:
            TubeBody = await scrape(videoId);
            if (TubeBody === null) {
                console.log(colors.bold.red("ERROR: ") +
                    "❗no data returned from server..." +
                    colors.reset(""));
                return null;
            }
            else
                TubeBody = JSON.parse(TubeBody);
            console.log(colors.bold.green("INFO: ") +
                `📡preparing payload for <(${TubeBody[0].Title} Author: ${TubeBody[0].Uploader})>` +
                colors.reset(""));
            TubeDlp = await ytdlp$1(TubeBody[0].Link);
            break;
    }
    switch (TubeDlp) {
        case null:
            console.log(colors.bold.red("ERROR: ") +
                "❗no data returned from server..." +
                colors.reset(""));
            return null;
        default:
            console.log(colors.bold.green("INFO:"), "❣️ Thank you for using yt-dlp! If you enjoy the project, consider starring the GitHub repo: https://github.com/shovitdutta/yt-dlp");
            return JSON.parse(TubeDlp);
    }
}

async function extract({ query }) {
    try {
        const metaBody = await Engine({ query });
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
            audio_data: metaBody.AudioTube,
            video_data: metaBody.VideoTube,
            hdrvideo_data: metaBody.HDRVideoTube,
            meta_data: {
                id: metaBody.metaTube.id,
                original_url: metaBody.metaTube.original_url,
                webpage_url: metaBody.metaTube.webpage_url,
                title: metaBody.metaTube.title,
                view_count: metaBody.metaTube.view_count,
                like_count: metaBody.metaTube.like_count,
                view_count_formatted: viewCountFormatted,
                like_count_formatted: likeCountFormatted,
                full_title: metaBody.metaTube.Fulltitle,
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
        for (const url of playlistUrls) {
            const ispUrl = url.match(/list=([a-zA-Z0-9_-]+)/);
            if (!ispUrl) {
                console.error(colors.bold.red("ERROR: "), "Invalid YouTube Playlist URL:", url);
                continue;
            }
            const resp = await search$1({ listId: ispUrl[1] });
            if (!resp) {
                console.error(colors.bold.red("ERROR: "), "Invalid Data Found For:", ispUrl[1]);
                continue;
            }
            for (let i = 0; i < resp.videos.length; i++) {
                try {
                    const videoId = resp.videos[i].videoId;
                    const metaTube = await search$1({ videoId: videoId });
                    console.log(colors.bold.green("INFO:"), colors.bold.green("<("), metaTube.title, colors.bold.green("by"), metaTube.author.name, colors.bold.green(")>"));
                    if (preTube.has(metaTube.videoId))
                        continue;
                    else {
                        const { author: { name: authorName, url: authorUrl }, duration, seconds, genre, ...newTube } = metaTube;
                        proTubeArr.push({ ...newTube, authorName, authorUrl });
                    }
                }
                catch (error) {
                    console.error(colors.bold.red("ERROR: "), error);
                }
            }
        }
        return proTubeArr;
    }
    catch (error) {
        return error instanceof z__namespace.ZodError ? error.errors : error;
    }
}

function list_formats({ query, }) {
    return new Promise(async (resolve, reject) => {
        try {
            const zval = z__namespace
                .object({
                query: z__namespace.string(),
            })
                .parse({ query });
            const EnResp = await Engine(zval);
            if (!EnResp)
                return reject("Unable to get response from YouTube...");
            const fprem = (data) => data.filter((out) => !out.meta_dl.originalformat.includes("Premium"));
            const EnBody = {
                AudioFormatsData: fprem(EnResp.AudioTube).map((out) => [
                    out.meta_dl.originalformat,
                    out.meta_info.filesizebytes,
                    out.meta_info.filesizeformatted,
                ]),
                VideoFormatsData: fprem(EnResp.VideoTube).map((out) => [
                    out.meta_dl.originalformat,
                    out.meta_info.filesizebytes,
                    out.meta_info.filesizeformatted,
                ]),
                HdrVideoFormatsData: fprem(EnResp.HDRVideoTube).map((out) => [
                    out.meta_dl.originalformat,
                    out.meta_info.filesizebytes,
                    out.meta_info.filesizeformatted,
                ]),
            };
            resolve(EnBody);
        }
        catch (error) {
            reject(error instanceof z__namespace.ZodError ? error.errors : error);
        }
    });
}

function get_video_data({ query, }) {
    return new Promise(async (resolve, reject) => {
        try {
            const zval = z__namespace
                .object({
                query: z__namespace.string(),
            })
                .parse({ query });
            const EnResp = await Engine(zval);
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
                z__namespace;
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
            reject(error instanceof z__namespace.ZodError ? error.errors : error);
        }
    });
}

async function extract_playlist_videos({ playlistUrls, }) {
    try {
        const proTubeArr = [];
        const processedVideoIds = new Set();
        for (const url of playlistUrls) {
            const ispUrl = url.match(/list=([a-zA-Z0-9_-]+)/);
            if (!ispUrl) {
                console.error(colors.bold.red("ERROR: "), "Invalid YouTube Playlist URL:", url);
                continue;
            }
            const resp = await scrape(ispUrl[1]);
            if (!resp) {
                console.error(colors.bold.red("ERROR: "), "Invalid Data Found For:", ispUrl[1]);
                continue;
            }
            for (let i = 0; i < resp.videos.length; i++) {
                try {
                    const videoId = resp.videos[i].videoId;
                    if (processedVideoIds.has(videoId))
                        continue;
                    const data = await Engine({ query: videoId });
                    if (data instanceof Array)
                        proTubeArr.push(...data);
                    else
                        proTubeArr.push(data);
                    processedVideoIds.add(videoId);
                }
                catch (error) {
                    console.error(colors.bold.red("ERROR: "), error);
                }
            }
        }
        return proTubeArr;
    }
    catch (error) {
        return error instanceof z__namespace.ZodError ? error.errors : error;
    }
}

async function checkUrl$1(url) {
    try {
        const response = await axios.head(url);
        return response.status === 200;
    }
    catch (error) {
        return false;
    }
}
async function bigEntry$1(metaBody) {
    switch (true) {
        case !metaBody || metaBody.length === 0:
            console.log(colors.bold.red("ERROR:"), "❗sorry no downloadable data found");
            return null;
        default:
            const sortedByFileSize = [...metaBody].sort((a, b) => a.meta_info.filesizebytes - b.meta_info.filesizebytes);
            for (const item of sortedByFileSize) {
                const { mediaurl } = item.meta_dl;
                if (mediaurl && (await checkUrl$1(mediaurl)))
                    return item;
            }
            console.log(colors.bold.red("ERROR:"), "❗sorry no downloadable data found");
            return null;
    }
}

const progressBar = (prog) => {
    if (prog.percent === undefined)
        return;
    if (prog.timemark === undefined)
        return;
    if (prog.currentKbps === undefined)
        return;
    if (prog.percent > 98)
        prog.percent = 100;
    readline.cursorTo(process.stdout, 0);
    const width = Math.floor(process.stdout.columns / 3);
    const scomp = Math.round((width * prog.percent) / 100);
    let color = colors.green;
    if (prog.percent < 20)
        color = colors.red;
    else if (prog.percent < 80)
        color = colors.yellow;
    const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
    process.stdout.write(color("PROG: ") +
        sprog +
        " " +
        prog.percent.toFixed(2) +
        "% " +
        color("NETWORK: ") +
        prog.currentKbps +
        "kbps " +
        color("TIMEMARK: ") +
        prog.timemark);
    if (prog.percent >= 99)
        process.stdout.write("\n");
};

const AudioLowestInputSchema = z.z.object({
    query: z.z.string(),
    filter: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    outputFormat: z.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function AudioLowest(input) {
    try {
        const { query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp3", } = AudioLowestInputSchema.parse(input);
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry$1(metaBody.AudioTube);
        if (metaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const ytc = fluentffmpeg();
        ytc.addInput(metaEntry.meta_dl.mediaurl);
        ytc.addInput(metaBody.metaTube.thumbnail);
        ytc.addOutputOption("-map", "1:0");
        ytc.addOutputOption("-map", "0:a:0");
        ytc.addOutputOption("-id3v2_version", "3");
        ytc.format(outputFormat);
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        switch (filter) {
            case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                metaName = `yt-dlp-(AudioLowest_bassboost)-${title}.${outputFormat}`;
                break;
            case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                metaName = `yt-dlp-(AudioLowest_echo)-${title}.${outputFormat}`;
                break;
            case "flanger":
                ytc.withAudioFilter(["flanger"]);
                metaName = `yt-dlp-(AudioLowest_flanger)-${title}.${outputFormat}`;
                break;
            case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                metaName = `yt-dlp-(AudioLowest_nightcore)-${title}.${outputFormat}`;
                break;
            case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                metaName = `yt-dlp-(AudioLowest_panning)-${title}.${outputFormat}`;
                break;
            case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                metaName = `yt-dlp-(AudioLowest_phaser)-${title}.${outputFormat}`;
                break;
            case "reverse":
                ytc.withAudioFilter(["areverse"]);
                metaName = `yt-dlp-(AudioLowest_reverse)-${title}.${outputFormat}`;
                break;
            case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                metaName = `yt-dlp-(AudioLowest_slow)-${title}.${outputFormat}`;
                break;
            case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                metaName = `yt-dlp-(AudioLowest_speed)-${title}.${outputFormat}`;
                break;
            case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                metaName = `yt-dlp-(AudioLowest_subboost)-${title}.${outputFormat}`;
                break;
            case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                metaName = `yt-dlp-(AudioLowest_superslow)-${title}.${outputFormat}`;
                break;
            case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                metaName = `yt-dlp-(AudioLowest_superspeed)-${title}.${outputFormat}`;
                break;
            case "surround":
                ytc.withAudioFilter(["surround"]);
                metaName = `yt-dlp-(AudioLowest_surround)-${title}.${outputFormat}`;
                break;
            case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                metaName = `yt-dlp-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
                break;
            case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                metaName = `yt-dlp-(AudioLowest_vibrato)-${title}.${outputFormat}`;
                break;
            default:
                ytc.withAudioFilter([]);
                metaName = `yt-dlp-(AudioLowest)-${title}.${outputFormat}`;
                break;
        }
        if (stream$1) {
            const readStream = new stream.Readable({
                read() { },
            });
            const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(null);
                    callback();
                },
            });
            ytc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ytc
                    .output(path__namespace.join(metaFold, metaName))
                    .on("error", reject)
                    .on("end", () => {
                    resolve();
                    return {
                        status: 200,
                        message: "process ended...",
                    };
                })
                    .run();
            });
            return {
                status: 200,
                message: "process ended...",
            };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

async function checkUrl(url) {
    try {
        const response = await axios.head(url);
        return response.status === 200;
    }
    catch (error) {
        return false;
    }
}
async function bigEntry(metaBody) {
    switch (true) {
        case !metaBody || metaBody.length === 0:
            console.log(colors.bold.red("ERROR:"), "❗sorry no downloadable data found");
            return null;
        default:
            const sortedByFileSize = [...metaBody].sort((a, b) => b.meta_info.filesizebytes - a.meta_info.filesizebytes);
            for (const item of sortedByFileSize) {
                const { mediaurl } = item.meta_dl;
                if (mediaurl && (await checkUrl(mediaurl)))
                    return item;
            }
            console.log(colors.bold.red("ERROR:"), "❗sorry no downloadable data found");
            return null;
    }
}

const AudioHighestInputSchema = z.z.object({
    query: z.z.string(),
    filter: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    outputFormat: z.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function AudioHighest(input) {
    try {
        const { query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp3", } = AudioHighestInputSchema.parse(input);
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry(metaBody.AudioTube);
        if (metaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const ytc = fluentffmpeg();
        ytc.addInput(metaEntry.meta_dl.mediaurl);
        ytc.addInput(metaBody.metaTube.thumbnail);
        ytc.addOutputOption("-map", "1:0");
        ytc.addOutputOption("-map", "0:a:0");
        ytc.addOutputOption("-id3v2_version", "3");
        ytc.format(outputFormat);
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        switch (filter) {
            case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                metaName = `yt-dlp-(AudioHighest_bassboost)-${title}.${outputFormat}`;
                break;
            case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                metaName = `yt-dlp-(AudioHighest_echo)-${title}.${outputFormat}`;
                break;
            case "flanger":
                ytc.withAudioFilter(["flanger"]);
                metaName = `yt-dlp-(AudioHighest_flanger)-${title}.${outputFormat}`;
                break;
            case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                metaName = `yt-dlp-(AudioHighest_nightcore)-${title}.${outputFormat}`;
                break;
            case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                metaName = `yt-dlp-(AudioHighest_panning)-${title}.${outputFormat}`;
                break;
            case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                metaName = `yt-dlp-(AudioHighest_phaser)-${title}.${outputFormat}`;
                break;
            case "reverse":
                ytc.withAudioFilter(["areverse"]);
                metaName = `yt-dlp-(AudioHighest_reverse)-${title}.${outputFormat}`;
                break;
            case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                metaName = `yt-dlp-(AudioHighest_slow)-${title}.${outputFormat}`;
                break;
            case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                metaName = `yt-dlp-(AudioHighest_speed)-${title}.${outputFormat}`;
                break;
            case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                metaName = `yt-dlp-(AudioHighest_subboost)-${title}.${outputFormat}`;
                break;
            case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                metaName = `yt-dlp-(AudioHighest_superslow)-${title}.${outputFormat}`;
                break;
            case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                metaName = `yt-dlp-(AudioHighest_superspeed)-${title}.${outputFormat}`;
                break;
            case "surround":
                ytc.withAudioFilter(["surround"]);
                metaName = `yt-dlp-(AudioHighest_surround)-${title}.${outputFormat}`;
                break;
            case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                metaName = `yt-dlp-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
                break;
            case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                metaName = `yt-dlp-(AudioHighest_vibrato)-${title}.${outputFormat}`;
                break;
            default:
                ytc.withAudioFilter([]);
                metaName = `yt-dlp-(AudioHighest)-${title}.${outputFormat}`;
                break;
        }
        if (stream$1) {
            const readStream = new stream.Readable({
                read() { },
            });
            const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(null);
                    callback();
                },
            });
            ytc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ytc
                    .output(path__namespace.join(metaFold, metaName))
                    .on("error", reject)
                    .on("end", () => {
                    resolve();
                    return {
                        status: 200,
                        message: "process ended...",
                    };
                })
                    .run();
            });
            return {
                status: 200,
                message: "process ended...",
            };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

const VideoLowestInputSchema$1 = z.z.object({
    query: z.z.string(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    filter: z.z.string().optional(),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function VideoLowest$1(input) {
    try {
        const { query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp4", } = VideoLowestInputSchema$1.parse(input);
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry$1(metaBody.VideoTube);
        if (metaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const ytc = fluentffmpeg();
        ytc.addInput(metaEntry.meta_dl.mediaurl);
        ytc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
                break;
            case "invert":
                ytc.withVideoFilter("negate");
                metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
                break;
            case "rotate90":
                ytc.withVideoFilter("rotate=PI/2");
                metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
                break;
            case "rotate180":
                ytc.withVideoFilter("rotate=PI");
                metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
                break;
            case "rotate270":
                ytc.withVideoFilter("rotate=3*PI/2");
                metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
                break;
            case "flipHorizontal":
                ytc.withVideoFilter("hflip");
                metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
                break;
            case "flipVertical":
                ytc.withVideoFilter("vflip");
                metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
                break;
            default:
                metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
        }
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        switch (stream$1) {
            case true:
                const readStream = new stream.Readable({
                    read() { },
                });
                const writeStream = new stream.Writable({
                    write(chunk, _encoding, callback) {
                        readStream.push(chunk);
                        callback();
                    },
                    final(callback) {
                        readStream.push(null);
                        callback();
                    },
                });
                ytc.pipe(writeStream, { end: true });
                return {
                    stream: readStream,
                    filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                };
            default:
                await new Promise((resolve, reject) => {
                    ytc
                        .output(path__namespace.join(metaFold, metaName))
                        .on("error", reject)
                        .on("end", () => {
                        resolve();
                    })
                        .run();
                });
                return {
                    message: "process ended...",
                    status: 200,
                };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

const VideoHighestInputSchema = z.z.object({
    query: z.z.string(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
    filter: z.z.string().optional(),
});
async function VideoHighest(input) {
    try {
        const { query, stream: stream$1, verbose, folderName, outputFormat = "mp4", filter, } = VideoHighestInputSchema.parse(input);
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        let metaName = "";
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry(metaBody.VideoTube);
        if (metaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const ytc = fluentffmpeg();
        ytc.addInput(metaEntry.meta_dl.mediaurl);
        ytc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
                break;
            case "invert":
                ytc.withVideoFilter("negate");
                metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
                break;
            case "rotate90":
                ytc.withVideoFilter("rotate=PI/2");
                metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
                break;
            case "rotate180":
                ytc.withVideoFilter("rotate=PI");
                metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
                break;
            case "rotate270":
                ytc.withVideoFilter("rotate=3*PI/2");
                metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
                break;
            case "flipHorizontal":
                ytc.withVideoFilter("hflip");
                metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
                break;
            case "flipVertical":
                ytc.withVideoFilter("vflip");
                metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
                break;
            default:
                metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
        }
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        switch (stream$1) {
            case true:
                const readStream = new stream.Readable({
                    read() { },
                });
                const writeStream = new stream.Writable({
                    write(chunk, _encoding, callback) {
                        readStream.push(chunk);
                        callback();
                    },
                    final(callback) {
                        readStream.push(null);
                        callback();
                    },
                });
                ytc.pipe(writeStream, { end: true });
                return {
                    stream: readStream,
                    filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                };
            default:
                await new Promise((resolve, reject) => {
                    ytc
                        .output(path__namespace.join(metaFold, metaName))
                        .on("error", reject)
                        .on("end", () => {
                        resolve();
                    })
                        .run();
                });
                return {
                    message: "process ended...",
                    status: 200,
                };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

const AudioVideoLowestInputSchema = z.z.object({
    query: z.z.string(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function AudioVideoLowest(input) {
    try {
        const { query, stream: stream$1, verbose, folderName, outputFormat = "mp4", } = AudioVideoLowestInputSchema.parse(input);
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const ytc = fluentffmpeg();
        const AmetaEntry = await bigEntry$1(metaBody.AudioTube);
        const VmetaEntry = await bigEntry$1(metaBody.VideoTube);
        if (AmetaEntry === null || VmetaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        ytc.addInput(VmetaEntry.meta_dl.mediaurl);
        ytc.addInput(AmetaEntry.meta_dl.mediaurl);
        ytc.format(outputFormat);
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        if (stream$1) {
            const readStream = new stream.Readable({
                read() { },
            });
            const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(null);
                    callback();
                },
            });
            ytc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ytc
                    .output(path__namespace.join(metaFold, metaName))
                    .on("error", reject)
                    .on("end", () => {
                    resolve();
                    return {
                        status: 200,
                        message: "process ended...",
                    };
                })
                    .run();
            });
            return {
                status: 200,
                message: "process ended...",
            };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

const AudioVideoHighestInputSchema = z.z.object({
    query: z.z.string(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function AudioVideoHighest(input) {
    try {
        const { query, stream: stream$1, verbose, folderName, outputFormat = "mp4", } = AudioVideoHighestInputSchema.parse(input);
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const ytc = fluentffmpeg();
        const AmetaEntry = await bigEntry(metaBody.AudioTube);
        const VmetaEntry = await bigEntry(metaBody.VideoTube);
        if (AmetaEntry === null || VmetaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        ytc.addInput(VmetaEntry.meta_dl.mediaurl);
        ytc.addInput(AmetaEntry.meta_dl.mediaurl);
        ytc.format(outputFormat);
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        if (stream$1) {
            const readStream = new stream.Readable({
                read() { },
            });
            const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(null);
                    callback();
                },
            });
            ytc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ytc
                    .output(path__namespace.join(metaFold, metaName))
                    .on("error", reject)
                    .on("end", () => {
                    resolve();
                    return {
                        status: 200,
                        message: "process ended...",
                    };
                })
                    .run();
            });
            return {
                status: 200,
                message: "process ended...",
            };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

const AudioQualityCustomInputSchema = z.z.object({
    query: z.z.string(),
    filter: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    quality: z.z.enum(["high", "medium", "low", "ultralow"]),
    outputFormat: z.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function AudioQualityCustom(input) {
    try {
        const { query, filter, stream: stream$1, verbose, quality, folderName, outputFormat = "mp3", } = AudioQualityCustomInputSchema.parse(input);
        const metaResp = await Engine({ query });
        if (!metaResp) {
            return {
                message: "The specified quality was not found...",
                status: 500,
            };
        }
        const metaBody = metaResp.AudioTube.filter((op) => op.meta_dl.formatnote === quality);
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const title = metaResp.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const ytc = fluentffmpeg();
        const metaEntry = await bigEntry(metaBody);
        if (metaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        ytc.addInput(metaEntry.meta_dl.mediaurl);
        ytc.addInput(metaResp.metaTube.thumbnail);
        ytc.addOutputOption("-map", "1:0");
        ytc.addOutputOption("-map", "0:a:0");
        ytc.addOutputOption("-id3v2_version", "3");
        ytc.withAudioBitrate(metaEntry.meta_audio.bitrate);
        ytc.withAudioChannels(metaEntry.meta_audio.channels);
        ytc.format(outputFormat);
        switch (filter) {
            case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                break;
            case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                break;
            case "flanger":
                ytc.withAudioFilter(["flanger"]);
                break;
            case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                break;
            case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                break;
            case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                break;
            case "reverse":
                ytc.withAudioFilter(["areverse"]);
                break;
            case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                break;
            case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                break;
            case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                break;
            case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                break;
            case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                break;
            case "surround":
                ytc.withAudioFilter(["surround"]);
                break;
            case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                break;
            case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                break;
            default:
                ytc.withAudioFilter([]);
                break;
        }
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        if (stream$1) {
            const readStream = new stream.Readable({
                read() { },
            });
            const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                    readStream.push(chunk);
                    callback();
                },
                final(callback) {
                    readStream.push(null);
                    callback();
                },
            });
            ytc.pipe(writeStream, { end: true });
            return {
                stream: readStream,
                filename: folderName
                    ? path__namespace.join(metaFold, `yt-dlp-(${quality})-${title}.${outputFormat}`)
                    : `yt-dlp-(${quality})-${title}.${outputFormat}`,
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ytc
                    .output(path__namespace.join(metaFold, `yt-dlp-(${quality})-${title}.${outputFormat}`))
                    .on("error", reject)
                    .on("end", () => {
                    resolve();
                })
                    .run();
            });
            return {
                message: "process ended...",
                status: 200,
            };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

const VideoLowestInputSchema = z.z.object({
    query: z.z.string(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    filter: z.z.string().optional(),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function VideoLowest(input) {
    try {
        const { query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp4", } = VideoLowestInputSchema.parse(input);
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        let metaName = "";
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const metaEntry = await bigEntry(metaBody.VideoTube);
        if (metaEntry === null) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const ytc = fluentffmpeg();
        ytc.addInput(metaEntry.meta_dl.mediaurl);
        ytc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
                break;
            case "invert":
                ytc.withVideoFilter("negate");
                metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
                break;
            case "rotate90":
                ytc.withVideoFilter("rotate=PI/2");
                metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
                break;
            case "rotate180":
                ytc.withVideoFilter("rotate=PI");
                metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
                break;
            case "rotate270":
                ytc.withVideoFilter("rotate=3*PI/2");
                metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
                break;
            case "flipHorizontal":
                ytc.withVideoFilter("hflip");
                metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
                break;
            case "flipVertical":
                ytc.withVideoFilter("vflip");
                metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
                break;
            default:
                metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
        }
        ytc.on("start", (command) => {
            if (verbose)
                console.log(command);
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("end", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("close", () => {
            progressBar({
                currentKbps: undefined,
                timemark: undefined,
                percent: undefined,
            });
        });
        ytc.on("progress", (prog) => {
            progressBar({
                currentKbps: prog.currentKbps,
                timemark: prog.timemark,
                percent: prog.percent,
            });
        });
        ytc.on("error", (error) => {
            return error;
        });
        switch (stream$1) {
            case true:
                const readStream = new stream.Readable({
                    read() { },
                });
                const writeStream = new stream.Writable({
                    write(chunk, _encoding, callback) {
                        readStream.push(chunk);
                        callback();
                    },
                    final(callback) {
                        readStream.push(null);
                        callback();
                    },
                });
                ytc.pipe(writeStream, { end: true });
                return {
                    stream: readStream,
                    filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                };
            default:
                await new Promise((resolve, reject) => {
                    ytc
                        .output(path__namespace.join(metaFold, metaName))
                        .on("error", reject)
                        .on("end", () => {
                        resolve();
                    })
                        .run();
                });
                return {
                    message: "process ended...",
                    status: 200,
                };
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors.map((err) => err.message).join(", "),
                status: 500,
            };
        }
        else if (error instanceof Error) {
            return {
                message: error.message,
                status: 500,
            };
        }
        else {
            return {
                message: "Internal server error",
                status: 500,
            };
        }
    }
}

const ListVideoLowestInputSchema = z.z.object({
    filter: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function ListVideoLowest(input) {
    try {
        const { filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListVideoLowestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const url of playlistUrls) {
            const metaList = await scrape(url);
            if (metaList === null || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const parsedMetaList = await JSON.parse(metaList);
            const uniqueVideos = parsedMetaList.Videos.filter((video) => !uniqueVideoIds.has(video.id));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.id));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await scrape(i.videoId);
            if (TubeBody === null)
                continue;
            const parseTube = await JSON.parse(TubeBody);
            const metaBody = await Engine({
                query: parseTube.Link,
            });
            if (metaBody === null)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path__namespace.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
                fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry$1(metaBody.VideoTube);
            if (metaEntry === null)
                continue;
            const ytc = fluentffmpeg();
            ytc.addInput(metaEntry.meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("end", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("close", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("progress", (prog) => {
                progressBar({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "grayscale":
                    ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
                    break;
                case "invert":
                    ytc.withVideoFilter("negate");
                    metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
                    break;
                case "rotate90":
                    ytc.withVideoFilter("rotate=PI/2");
                    metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
                    break;
                case "rotate180":
                    ytc.withVideoFilter("rotate=PI");
                    metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
                    break;
                case "rotate270":
                    ytc.withVideoFilter("rotate=3*PI/2");
                    metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
                    break;
                case "flipHorizontal":
                    ytc.withVideoFilter("hflip");
                    metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                case "flipVertical":
                    ytc.withVideoFilter("vflip");
                    metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
                    break;
                default:
                    metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
            }
            switch (true) {
                case stream$1:
                    const readStream = new stream.Readable({
                        read() { },
                    });
                    const writeStream = new stream.Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(null);
                            callback();
                        },
                    });
                    ytc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        ytc
                            .output(path__namespace.join(metaFold, metaName))
                            .on("end", () => resolve())
                            .on("error", reject)
                            .run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ListVideoHighestInputSchema = z.z.object({
    filter: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function ListVideoHighest(input) {
    try {
        const { filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListVideoHighestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const url of playlistUrls) {
            const metaList = await scrape(url);
            if (metaList === null || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const parsedMetaList = await JSON.parse(metaList);
            const uniqueVideos = parsedMetaList.Videos.filter((video) => !uniqueVideoIds.has(video.id));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.id));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await scrape(i.videoId);
            if (TubeBody === null)
                continue;
            const parseTube = await JSON.parse(TubeBody);
            const metaBody = await Engine({
                query: parseTube.Link,
            });
            if (metaBody === null)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path__namespace.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
                fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(metaBody.VideoTube);
            if (metaEntry === null)
                continue;
            const ytc = fluentffmpeg();
            ytc.addInput(metaEntry.meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("end", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("close", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("progress", (prog) => {
                progressBar({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "grayscale":
                    ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                    metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
                    break;
                case "invert":
                    ytc.withVideoFilter("negate");
                    metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
                    break;
                case "rotate90":
                    ytc.withVideoFilter("rotate=PI/2");
                    metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
                    break;
                case "rotate180":
                    ytc.withVideoFilter("rotate=PI");
                    metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
                    break;
                case "rotate270":
                    ytc.withVideoFilter("rotate=3*PI/2");
                    metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
                    break;
                case "flipHorizontal":
                    ytc.withVideoFilter("hflip");
                    metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                case "flipVertical":
                    ytc.withVideoFilter("vflip");
                    metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
                    break;
                default:
                    metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
            }
            switch (true) {
                case stream$1:
                    const readStream = new stream.Readable({
                        read() { },
                    });
                    const writeStream = new stream.Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(null);
                            callback();
                        },
                    });
                    ytc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        ytc
                            .output(path__namespace.join(metaFold, metaName))
                            .on("end", () => resolve())
                            .on("error", reject)
                            .run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ListVideoQualityCustomInputSchema = z.z.object({
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
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
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
    filter: z.z.string().optional(),
});
async function ListVideoQualityCustom(input) {
    try {
        const { filter, stream: stream$1, quality, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListVideoQualityCustomInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const url of playlistUrls) {
            const metaList = await scrape(url);
            if (metaList === null || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const parsedMetaList = await JSON.parse(metaList);
            const uniqueVideos = parsedMetaList.Videos.filter((video) => !uniqueVideoIds.has(video.id));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.id));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await scrape(i.videoId);
            if (TubeBody === null)
                continue;
            const parseTube = await JSON.parse(TubeBody);
            const metaBody = await Engine({
                query: parseTube.Link,
            });
            if (metaBody === null)
                continue;
            const newBody = metaBody.VideoTube.filter((op) => op.meta_dl.formatnote === quality);
            if (!newBody || newBody === null)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path__namespace.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
                fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(newBody);
            if (metaEntry === null)
                continue;
            const ytc = fluentffmpeg();
            ytc.addInput(metaEntry.meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("end", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("close", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("progress", (prog) => {
                progressBar({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "grayscale":
                    ytc.withVideoFilter([
                        "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
                    ]);
                    metaName = `yt-dlp_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
                    break;
                case "invert":
                    ytc.withVideoFilter(["negate"]);
                    metaName = `yt-dlp_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
                    break;
                case "rotate90":
                    ytc.withVideoFilter(["rotate=PI/2"]);
                    metaName = `yt-dlp_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
                    break;
                case "rotate180":
                    ytc.withVideoFilter(["rotate=PI"]);
                    metaName = `yt-dlp_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
                    break;
                case "rotate270":
                    ytc.withVideoFilter(["rotate=3*PI/2"]);
                    metaName = `yt-dlp_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
                    break;
                case "flipHorizontal":
                    ytc.withVideoFilter(["hflip"]);
                    metaName = `yt-dlp_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                case "flipVertical":
                    ytc.withVideoFilter(["vflip"]);
                    metaName = `yt-dlp_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
                    break;
                default:
                    ytc.withVideoFilter([]);
                    metaName = `yt-dlp_(VideoQualityCustom)_${title}.${outputFormat}`;
            }
            switch (true) {
                case stream$1:
                    const readStream = new stream.Readable({
                        read() { },
                    });
                    const writeStream = new stream.Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(null);
                            callback();
                        },
                    });
                    ytc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        ytc
                            .output(path__namespace.join(metaFold, metaName))
                            .on("end", () => resolve())
                            .on("error", reject)
                            .run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ListAudioLowestInputSchema = z.z.object({
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
    outputFormat: z.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
    filter: z.z.string().optional(),
});
async function ListAudioLowest(input) {
    try {
        const { filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp3", } = ListAudioLowestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const url of playlistUrls) {
            const metaList = await scrape(url);
            if (metaList === null || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const parsedMetaList = await JSON.parse(metaList);
            const uniqueVideos = parsedMetaList.Videos.filter((video) => !uniqueVideoIds.has(video.id));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.id));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await scrape(i.videoId);
            if (TubeBody === null)
                continue;
            const parseTube = await JSON.parse(TubeBody);
            const metaBody = await Engine({
                query: parseTube.Link,
            });
            if (metaBody === null)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path__namespace.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
                fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry$1(metaBody.AudioTube);
            if (metaEntry === null)
                continue;
            const ytc = fluentffmpeg();
            ytc.addInput(metaEntry.meta_dl.mediaurl);
            ytc.addInput(metaBody.metaTube.thumbnail);
            ytc.addOutputOption("-map", "1:0");
            ytc.addOutputOption("-map", "0:a:0");
            ytc.addOutputOption("-id3v2_version", "3");
            ytc.format(outputFormat);
            ytc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("end", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("close", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("progress", (prog) => {
                progressBar({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "bassboost":
                    ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    metaName = `yt-dlp-(AudioLowest_bassboost)-${title}.${outputFormat}`;
                    break;
                case "echo":
                    ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    metaName = `yt-dlp-(AudioLowest_echo)-${title}.${outputFormat}`;
                    break;
                case "flanger":
                    ytc.withAudioFilter(["flanger"]);
                    metaName = `yt-dlp-(AudioLowest_flanger)-${title}.${outputFormat}`;
                    break;
                case "nightcore":
                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                    metaName = `yt-dlp-(AudioLowest_nightcore)-${title}.${outputFormat}`;
                    break;
                case "panning":
                    ytc.withAudioFilter(["apulsator=hz=0.08"]);
                    metaName = `yt-dlp-(AudioLowest_panning)-${title}.${outputFormat}`;
                    break;
                case "phaser":
                    ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                    metaName = `yt-dlp-(AudioLowest_phaser)-${title}.${outputFormat}`;
                    break;
                case "reverse":
                    ytc.withAudioFilter(["areverse"]);
                    metaName = `yt-dlp-(AudioLowest_reverse)-${title}.${outputFormat}`;
                    break;
                case "slow":
                    ytc.withAudioFilter(["atempo=0.8"]);
                    metaName = `yt-dlp-(AudioLowest_slow)-${title}.${outputFormat}`;
                    break;
                case "speed":
                    ytc.withAudioFilter(["atempo=2"]);
                    metaName = `yt-dlp-(AudioLowest_speed)-${title}.${outputFormat}`;
                    break;
                case "subboost":
                    ytc.withAudioFilter(["asubboost"]);
                    metaName = `yt-dlp-(AudioLowest_subboost)-${title}.${outputFormat}`;
                    break;
                case "superslow":
                    ytc.withAudioFilter(["atempo=0.5"]);
                    metaName = `yt-dlp-(AudioLowest_superslow)-${title}.${outputFormat}`;
                    break;
                case "superspeed":
                    ytc.withAudioFilter(["atempo=3"]);
                    metaName = `yt-dlp-(AudioLowest_superspeed)-${title}.${outputFormat}`;
                    break;
                case "surround":
                    ytc.withAudioFilter(["surround"]);
                    metaName = `yt-dlp-(AudioLowest_surround)-${title}.${outputFormat}`;
                    break;
                case "vaporwave":
                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    metaName = `yt-dlp-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
                    break;
                case "vibrato":
                    ytc.withAudioFilter(["vibrato=f=6.5"]);
                    metaName = `yt-dlp-(AudioLowest_vibrato)-${title}.${outputFormat}`;
                    break;
                default:
                    ytc.withAudioFilter([]);
                    metaName = `yt-dlp-(AudioLowest)-${title}.${outputFormat}`;
                    break;
            }
            switch (true) {
                case stream$1:
                    const readStream = new stream.Readable({
                        read() { },
                    });
                    const writeStream = new stream.Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(null);
                            callback();
                        },
                    });
                    ytc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        ytc
                            .output(path__namespace.join(metaFold, metaName))
                            .on("end", () => resolve())
                            .on("error", reject)
                            .run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ListAudioHighestInputSchema = z.z.object({
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
    outputFormat: z.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
    filter: z.z.string().optional(),
});
async function ListAudioHighest(input) {
    try {
        const { filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp3", } = ListAudioHighestInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const url of playlistUrls) {
            const metaList = await scrape(url);
            if (metaList === null || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const parsedMetaList = await JSON.parse(metaList);
            const uniqueVideos = parsedMetaList.Videos.filter((video) => !uniqueVideoIds.has(video.id));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.id));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await scrape(i.videoId);
            if (TubeBody === null)
                continue;
            const parseTube = await JSON.parse(TubeBody);
            const metaBody = await Engine({
                query: parseTube.Link,
            });
            if (metaBody === null)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path__namespace.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
                fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(metaBody.AudioTube);
            if (metaEntry === null)
                continue;
            const ytc = fluentffmpeg();
            ytc.addInput(metaEntry.meta_dl.mediaurl);
            ytc.addInput(metaBody.metaTube.thumbnail);
            ytc.addOutputOption("-map", "1:0");
            ytc.addOutputOption("-map", "0:a:0");
            ytc.addOutputOption("-id3v2_version", "3");
            ytc.format(outputFormat);
            ytc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("end", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("close", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("progress", (prog) => {
                progressBar({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "bassboost":
                    ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    metaName = `yt-dlp-(AudioHighest_bassboost)-${title}.${outputFormat}`;
                    break;
                case "echo":
                    ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    metaName = `yt-dlp-(AudioHighest_echo)-${title}.${outputFormat}`;
                    break;
                case "flanger":
                    ytc.withAudioFilter(["flanger"]);
                    metaName = `yt-dlp-(AudioHighest_flanger)-${title}.${outputFormat}`;
                    break;
                case "nightcore":
                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                    metaName = `yt-dlp-(AudioHighest_nightcore)-${title}.${outputFormat}`;
                    break;
                case "panning":
                    ytc.withAudioFilter(["apulsator=hz=0.08"]);
                    metaName = `yt-dlp-(AudioHighest_panning)-${title}.${outputFormat}`;
                    break;
                case "phaser":
                    ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                    metaName = `yt-dlp-(AudioHighest_phaser)-${title}.${outputFormat}`;
                    break;
                case "reverse":
                    ytc.withAudioFilter(["areverse"]);
                    metaName = `yt-dlp-(AudioHighest_reverse)-${title}.${outputFormat}`;
                    break;
                case "slow":
                    ytc.withAudioFilter(["atempo=0.8"]);
                    metaName = `yt-dlp-(AudioHighest_slow)-${title}.${outputFormat}`;
                    break;
                case "speed":
                    ytc.withAudioFilter(["atempo=2"]);
                    metaName = `yt-dlp-(AudioHighest_speed)-${title}.${outputFormat}`;
                    break;
                case "subboost":
                    ytc.withAudioFilter(["asubboost"]);
                    metaName = `yt-dlp-(AudioHighest_subboost)-${title}.${outputFormat}`;
                    break;
                case "superslow":
                    ytc.withAudioFilter(["atempo=0.5"]);
                    metaName = `yt-dlp-(AudioHighest_superslow)-${title}.${outputFormat}`;
                    break;
                case "superspeed":
                    ytc.withAudioFilter(["atempo=3"]);
                    metaName = `yt-dlp-(AudioHighest_superspeed)-${title}.${outputFormat}`;
                    break;
                case "surround":
                    ytc.withAudioFilter(["surround"]);
                    metaName = `yt-dlp-(AudioHighest_surround)-${title}.${outputFormat}`;
                    break;
                case "vaporwave":
                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    metaName = `yt-dlp-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
                    break;
                case "vibrato":
                    ytc.withAudioFilter(["vibrato=f=6.5"]);
                    metaName = `yt-dlp-(AudioHighest_vibrato)-${title}.${outputFormat}`;
                    break;
                default:
                    ytc.withAudioFilter([]);
                    metaName = `yt-dlp-(AudioHighest)-${title}.${outputFormat}`;
                    break;
            }
            switch (true) {
                case stream$1:
                    const readStream = new stream.Readable({
                        read() { },
                    });
                    const writeStream = new stream.Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(null);
                            callback();
                        },
                    });
                    ytc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        ytc
                            .output(path__namespace.join(metaFold, metaName))
                            .on("end", () => resolve())
                            .on("error", reject)
                            .run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ListAudioQualityCustomInputSchema = z.z.object({
    filter: z.z.string().optional(),
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
    quality: z.z.enum(["high", "medium", "low", "ultralow"]),
    outputFormat: z.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
async function ListAudioQualityCustom(input) {
    try {
        const { filter, stream: stream$1, quality, verbose, folderName, playlistUrls, outputFormat = "mp3", } = ListAudioQualityCustomInputSchema.parse(input);
        let parseList = [];
        let metaName = "";
        let results = [];
        const uniqueVideoIds = new Set();
        for (const url of playlistUrls) {
            const metaList = await scrape(url);
            if (metaList === null || !metaList) {
                return {
                    message: "Unable to get response from YouTube...",
                    status: 500,
                };
            }
            const parsedMetaList = await JSON.parse(metaList);
            const uniqueVideos = parsedMetaList.Videos.filter((video) => !uniqueVideoIds.has(video.id));
            parseList.push(...uniqueVideos);
            uniqueVideos.forEach((video) => uniqueVideoIds.add(video.id));
        }
        console.log(colors.bold.green("INFO:"), "🎁Total Unique Videos:", parseList.length);
        for (const i of parseList) {
            const TubeBody = await scrape(i.videoId);
            if (TubeBody === null)
                continue;
            const parseTube = await JSON.parse(TubeBody);
            const metaBody = await Engine({
                query: parseTube.Link,
            });
            if (metaBody === null)
                continue;
            const newBody = metaBody.AudioTube.filter((op) => op.meta_dl.formatnote === quality);
            if (!newBody || newBody === null)
                continue;
            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const metaFold = folderName
                ? path__namespace.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
                fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = await bigEntry(newBody);
            if (metaEntry === null)
                continue;
            const ytc = fluentffmpeg();
            ytc.addInput(metaEntry.meta_dl.mediaurl);
            ytc.addInput(metaBody.metaTube.thumbnail);
            ytc.addOutputOption("-map", "1:0");
            ytc.addOutputOption("-map", "0:a:0");
            ytc.addOutputOption("-id3v2_version", "3");
            ytc.format(outputFormat);
            ytc.on("start", (command) => {
                if (verbose)
                    console.log(command);
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("end", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("close", () => {
                progressBar({
                    currentKbps: undefined,
                    timemark: undefined,
                    percent: undefined,
                });
            });
            ytc.on("progress", (prog) => {
                progressBar({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent,
                });
            });
            switch (filter) {
                case "bassboost":
                    ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
                    break;
                case "echo":
                    ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    metaName = `yt-dlp-(AudioQualityCustom_echo)-${title}.${outputFormat}`;
                    break;
                case "flanger":
                    ytc.withAudioFilter(["flanger"]);
                    metaName = `yt-dlp-(AudioQualityCustom_flanger)-${title}.${outputFormat}`;
                    break;
                case "nightcore":
                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                    metaName = `yt-dlp-(AudioQualityCustom_nightcore)-${title}.${outputFormat}`;
                    break;
                case "panning":
                    ytc.withAudioFilter(["apulsator=hz=0.08"]);
                    metaName = `yt-dlp-(AudioQualityCustom_panning)-${title}.${outputFormat}`;
                    break;
                case "phaser":
                    ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                    metaName = `yt-dlp-(AudioQualityCustom_phaser)-${title}.${outputFormat}`;
                    break;
                case "reverse":
                    ytc.withAudioFilter(["areverse"]);
                    metaName = `yt-dlp-(AudioQualityCustom_reverse)-${title}.${outputFormat}`;
                    break;
                case "slow":
                    ytc.withAudioFilter(["atempo=0.8"]);
                    metaName = `yt-dlp-(AudioQualityCustom_slow)-${title}.${outputFormat}`;
                    break;
                case "speed":
                    ytc.withAudioFilter(["atempo=2"]);
                    metaName = `yt-dlp-(AudioQualityCustom_speed)-${title}.${outputFormat}`;
                    break;
                case "subboost":
                    ytc.withAudioFilter(["asubboost"]);
                    metaName = `yt-dlp-(AudioQualityCustom_subboost)-${title}.${outputFormat}`;
                    break;
                case "superslow":
                    ytc.withAudioFilter(["atempo=0.5"]);
                    metaName = `yt-dlp-(AudioQualityCustom_superslow)-${title}.${outputFormat}`;
                    break;
                case "superspeed":
                    ytc.withAudioFilter(["atempo=3"]);
                    metaName = `yt-dlp-(AudioQualityCustom_superspeed)-${title}.${outputFormat}`;
                    break;
                case "surround":
                    ytc.withAudioFilter(["surround"]);
                    metaName = `yt-dlp-(AudioQualityCustom_surround)-${title}.${outputFormat}`;
                    break;
                case "vaporwave":
                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    metaName = `yt-dlp-(AudioQualityCustom_vaporwave)-${title}.${outputFormat}`;
                    break;
                case "vibrato":
                    ytc.withAudioFilter(["vibrato=f=6.5"]);
                    metaName = `yt-dlp-(AudioQualityCustom_vibrato)-${title}.${outputFormat}`;
                    break;
                default:
                    ytc.withAudioFilter([]);
                    metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
                    break;
            }
            switch (true) {
                case stream$1:
                    const readStream = new stream.Readable({
                        read() { },
                    });
                    const writeStream = new stream.Writable({
                        write(chunk, _encoding, callback) {
                            readStream.push(chunk);
                            callback();
                        },
                        final(callback) {
                            readStream.push(null);
                            callback();
                        },
                    });
                    ytc.pipe(writeStream, { end: true });
                    results.push({
                        stream: readStream,
                        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
                    });
                    break;
                default:
                    await new Promise((resolve, reject) => {
                        ytc
                            .output(path__namespace.join(metaFold, metaName))
                            .on("end", () => resolve())
                            .on("error", reject)
                            .run();
                    });
                    break;
            }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ListAudioVideoLowestInputSchema = z.z.object({
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function ListAudioVideoLowest(input) {
    try {
        const { stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListAudioVideoLowestInputSchema.parse(input);
        switch (true) {
            case playlistUrls.length === 0:
                return [
                    {
                        message: "playlistUrls parameter cannot be empty",
                        status: 500,
                    },
                ];
            case !Array.isArray(playlistUrls):
                return [
                    {
                        message: "playlistUrls parameter must be an array",
                        status: 500,
                    },
                ];
            case !playlistUrls.every((url) => typeof url === "string" && url.trim().length > 0):
                return [
                    {
                        message: "Invalid playlistUrls[] parameter. Expecting a non-empty array of strings.",
                        status: 500,
                    },
                ];
            default:
                const videos = await get_playlist({
                    playlistUrls,
                });
                if (!videos) {
                    return [
                        {
                            message: "Unable to get response from YouTube...",
                            status: 500,
                        },
                    ];
                }
                else {
                    const results = [];
                    await async.eachSeries(videos, async (video) => {
                        try {
                            const metaBody = await Engine({ query: video.url });
                            if (!metaBody) {
                                throw new Error("Unable to get response from YouTube...");
                            }
                            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                            let metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
                            const metaFold = folderName
                                ? path__namespace.join(process.cwd(), folderName)
                                : process.cwd();
                            if (!fs__namespace.existsSync(metaFold))
                                fs__namespace.mkdirSync(metaFold, { recursive: true });
                            const ytc = fluentffmpeg();
                            const AmetaEntry = await bigEntry$1(metaBody.AudioTube);
                            const VmetaEntry = await bigEntry$1(metaBody.VideoTube);
                            if (AmetaEntry === null || VmetaEntry === null)
                                return;
                            ytc.addInput(VmetaEntry.meta_dl.mediaurl);
                            ytc.addInput(AmetaEntry.meta_dl.mediaurl);
                            ytc.format(outputFormat);
                            ytc.on("start", (command) => {
                                if (verbose)
                                    console.log(command);
                                progressBar({
                                    currentKbps: undefined,
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            ytc.on("end", () => {
                                progressBar({
                                    currentKbps: undefined,
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            ytc.on("close", () => {
                                progressBar({
                                    currentKbps: undefined,
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            ytc.on("progress", (prog) => {
                                progressBar({
                                    currentKbps: prog.currentKbps,
                                    timemark: prog.timemark,
                                    percent: prog.percent,
                                });
                            });
                            if (stream$1) {
                                const readStream = new stream.Readable({
                                    read() { },
                                });
                                const writeStream = new stream.Writable({
                                    write(chunk, _encoding, callback) {
                                        readStream.push(chunk);
                                        callback();
                                    },
                                    final(callback) {
                                        readStream.push(null);
                                        callback();
                                    },
                                });
                                ytc.pipe(writeStream, { end: true });
                                results.push({
                                    stream: readStream,
                                    filename: folderName
                                        ? path__namespace.join(metaFold, metaName)
                                        : metaName,
                                });
                            }
                            else {
                                await new Promise((resolve, reject) => {
                                    ytc
                                        .output(path__namespace.join(metaFold, metaName))
                                        .on("end", () => resolve())
                                        .on("error", reject)
                                        .run();
                                });
                            }
                        }
                        catch (error) {
                            results.push({
                                status: 500,
                                message: colors.bold.red("ERROR: ") + video.title,
                            });
                        }
                    });
                    return results;
                }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ListAudioVideoHighestInputSchema = z.z.object({
    stream: z.z.boolean().optional(),
    verbose: z.z.boolean().optional(),
    folderName: z.z.string().optional(),
    playlistUrls: z.z.array(z.z.string()),
    outputFormat: z.z.enum(["mp4", "avi", "mov"]).optional(),
});
async function ListAudioVideoHighest(input) {
    try {
        const { stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", } = ListAudioVideoHighestInputSchema.parse(input);
        switch (true) {
            case playlistUrls.length === 0:
                return [
                    {
                        message: "playlistUrls parameter cannot be empty",
                        status: 500,
                    },
                ];
            case !Array.isArray(playlistUrls):
                return [
                    {
                        message: "playlistUrls parameter must be an array",
                        status: 500,
                    },
                ];
            case !playlistUrls.every((url) => typeof url === "string" && url.trim().length > 0):
                return [
                    {
                        message: "Invalid playlistUrls[] parameter. Expecting a non-empty array of strings.",
                        status: 500,
                    },
                ];
            default:
                const videos = await get_playlist({
                    playlistUrls,
                });
                if (!videos) {
                    return [
                        {
                            message: "Unable to get response from YouTube...",
                            status: 500,
                        },
                    ];
                }
                else {
                    const results = [];
                    await async.eachSeries(videos, async (video) => {
                        try {
                            const metaBody = await Engine({ query: video.url });
                            if (!metaBody) {
                                throw new Error("Unable to get response from YouTube...");
                            }
                            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                            let metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
                            const metaFold = folderName
                                ? path__namespace.join(process.cwd(), folderName)
                                : process.cwd();
                            if (!fs__namespace.existsSync(metaFold))
                                fs__namespace.mkdirSync(metaFold, { recursive: true });
                            const ytc = fluentffmpeg();
                            const AmetaEntry = await bigEntry(metaBody.AudioTube);
                            const VmetaEntry = await bigEntry(metaBody.VideoTube);
                            if (AmetaEntry === null || VmetaEntry === null)
                                return;
                            ytc.addInput(VmetaEntry.meta_dl.mediaurl);
                            ytc.addInput(AmetaEntry.meta_dl.mediaurl);
                            ytc.format(outputFormat);
                            ytc.on("start", (command) => {
                                if (verbose)
                                    console.log(command);
                                progressBar({
                                    currentKbps: undefined,
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            ytc.on("end", () => {
                                progressBar({
                                    currentKbps: undefined,
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            ytc.on("close", () => {
                                progressBar({
                                    currentKbps: undefined,
                                    timemark: undefined,
                                    percent: undefined,
                                });
                            });
                            ytc.on("progress", (prog) => {
                                progressBar({
                                    currentKbps: prog.currentKbps,
                                    timemark: prog.timemark,
                                    percent: prog.percent,
                                });
                            });
                            if (stream$1) {
                                const readStream = new stream.Readable({
                                    read() { },
                                });
                                const writeStream = new stream.Writable({
                                    write(chunk, _encoding, callback) {
                                        readStream.push(chunk);
                                        callback();
                                    },
                                    final(callback) {
                                        readStream.push(null);
                                        callback();
                                    },
                                });
                                ytc.pipe(writeStream, { end: true });
                                results.push({
                                    stream: readStream,
                                    filename: folderName
                                        ? path__namespace.join(metaFold, metaName)
                                        : metaName,
                                });
                            }
                            else {
                                await new Promise((resolve, reject) => {
                                    ytc
                                        .output(path__namespace.join(metaFold, metaName))
                                        .on("end", () => resolve())
                                        .on("error", reject)
                                        .run();
                                });
                            }
                        }
                        catch (error) {
                            results.push({
                                status: 500,
                                message: colors.bold.red("ERROR: ") + video.title,
                            });
                        }
                    });
                    return results;
                }
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return [
                {
                    message: "Validation error: " +
                        error.errors.map((e) => e.message).join(", "),
                    status: 500,
                },
            ];
        }
        else if (error instanceof Error) {
            return [
                {
                    message: error.message,
                    status: 500,
                },
            ];
        }
        else {
            return [
                {
                    message: "Internal server error",
                    status: 500,
                },
            ];
        }
    }
}

const ytdlp = {
    info: {
        help,
        search,
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

module.exports = ytdlp;
/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands out as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
