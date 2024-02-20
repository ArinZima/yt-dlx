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
var axios = require('axios');
var z = require('zod');
var YouTubeID = require('@shovit/ytid');
var search$1 = require('yt-search');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var fluentffmpeg = require('fluent-ffmpeg');
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
┃               ┃   bun add yt-core                                                                           ┃
┃               ┃   yarn add yt-core                                                                          ┃
┃               ┃   npm install yt-core                                                                       ┃
┃               ┃   pnpm install yt-core                                                                      ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ GLOBALLY: ❞                                                                               ┃
┃               ┃   yarn global add yt-core                                                   (use cli)       ┃
┃               ┃   npm install --global yt-core                                              (use cli)       ┃
┃               ┃   pnpm install --global yt-core                                             (use cli)       ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃    FILTERS    ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   bassboost                  echo                                                           ┃
┃               ┃   flanger                    nightcore                                                      ┃
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
┃               ┃   yt-core version                                                             (alias: v)    ┃
┃               ┃   yt-core help                                                                (alias: h)    ┃
┃               ┃   yt-core extract --query="video/url"                                         (alias: e)    ┃
┃               ┃   yt-core search-yt --query="video/url"                                       (alias: s)    ┃
┃               ┃   yt-core list-formats --query="video/url"                                    (alias: f)    ┃ 
┃               ┃   yt-core get-video-data --query="video/url"                                  (alias: gvd)  ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   yt-core audio-lowest --query="video/url"                                    (alias: al)   ┃
┃               ┃   yt-core audio-highest --query="video/url"                                   (alias: ah)   ┃
┃               ┃   yt-core audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)  ┃
┃               ┃       ──────────────────────────────────────────────────────────────                        ┃
┃               ┃   yt-core audio-lowest --query="video/url" --filter="valid-filter"            (filter)      ┃
┃               ┃   yt-core audio-highest --query="video/url" --filter="valid-filter"           (filter)      ┃
┃               ┃   yt-core audio-quality-custom --query="video/url" --format="valid-format"    ........      ┃
┃               ┃                                                   --filter="valid-filter"    (filter)       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   yt-core video-lowest --query="video/url"                                    (alias: vl)   ┃
┃               ┃   yt-core video-highest --query="video/url"                                   (alias: vh)   ┃
┃               ┃   yt-core video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)  ┃
┃               ┃       ──────────────────────────────────────────────────────────────                        ┃
┃               ┃   yt-core video-lowest --query="video/url" --filter="valid-filter"            (filter)      ┃
┃               ┃   yt-core video-highest --query="video/url" --filter="valid-filter"           (filter)      ┃
┃               ┃   yt-core video-quality-custom --query="video/url" --format="valid-format"    ........      ┃
┃               ┃                                                   --filter="valid-filter"    (filter)       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                      ┃
┃               ┃   yt-core audio-video-lowest --query="video/url"                              (alias: avl)  ┃
┃               ┃   yt-core audio-video-highest --query="video/url"                             (alias: avh)  ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃   IMPORTING   ┃   import ytdlp from "yt-core";                                            TypeScript (ts)   ┃
┃               ┃   import ytdlp from "yt-core";                                            ECMAScript (esm)  ┃
┃               ┃   const ytdlp = require("yt-core");                                       CommonJS   (cjs)  ┃
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

async function scrape(query) {
    try {
        const host = "https://ill-blue-bass-wear.cyclic.app/scrape";
        const response = await axios.get(host + "?query=" + encodeURIComponent(query));
        if (response.data !== null)
            return decodeURIComponent(response.data);
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

async function ytCore$1(query) {
    const host = "https://ill-blue-bass-wear.cyclic.app/core";
    try {
        const response = await axios.get(host + "?query=" + encodeURIComponent(query));
        if (response.data !== null)
            return decodeURIComponent(response.data);
        else
            return null;
    }
    catch (error) {
        return null;
    }
}

var version = "4.2.0";

async function Engine({ query, }) {
    let videoId, TubeCore, TubeBody;
    console.log(colors.bold.green("INFO: ") +
        "⭕ using yt-core version <(" +
        version +
        ")>" +
        colors.reset(""));
    if (!query || query.trim() === "") {
        console.log(colors.bold.red("ERROR: ") +
            "❌ 'query' is required..." +
            colors.reset(""));
        return;
    }
    if (/https/i.test(query) && /list/i.test(query)) {
        console.log(colors.bold.red("ERROR: ") +
            "❌ use extract_playlist_videos() for playlists..." +
            colors.reset(""));
        return;
    }
    if (/https/i.test(query) && !/list/i.test(query)) {
        console.log(colors.bold.green("INFO: ") +
            "⭕ fetching metadata for: <(" +
            query +
            ")>" +
            colors.reset(""));
        videoId = await YouTubeID(query);
    }
    else {
        function isYouTubeID(input) {
            const regex = /^[a-zA-Z0-9_-]{11}$/;
            const match = input.match(regex);
            if (match)
                return match[0];
            else
                return null;
        }
        videoId = isYouTubeID(query);
    }
    if (videoId) {
        TubeBody = await scrape(videoId);
        if (TubeBody === null) {
            console.log(colors.bold.red("ERROR: ") +
                "❌ no data returned from server..." +
                colors.reset(""));
            return;
        }
        else {
            TubeBody = JSON.parse(TubeBody);
            console.log(colors.bold.green("INFO: ") +
                "📡 preparing payload for <(" +
                TubeBody.Title +
                "Author:" +
                TubeBody.Uploader +
                ")>" +
                colors.reset(""));
            TubeCore = await ytCore$1(TubeBody.Link);
        }
    }
    else {
        TubeBody = await scrape(query);
        if (TubeBody === null) {
            console.log(colors.bold.red("ERROR: ") +
                "❌ no data returned from server..." +
                colors.reset(""));
            return;
        }
        else {
            TubeBody = JSON.parse(TubeBody);
            console.log(colors.bold.green("INFO: ") +
                "📡 preparing payload for <(" +
                TubeBody.Title +
                "Author:" +
                TubeBody.Uploader +
                ")>" +
                colors.reset(""));
            TubeCore = await ytCore$1(TubeBody.Link);
        }
    }
    if (TubeCore === null) {
        console.log(colors.bold.red("ERROR: ") +
            "❌ please try again later..." +
            colors.reset(""));
        return Promise.resolve(null);
    }
    else {
        console.log(colors.bold.green("INFO: ") +
            "❣️ Thank you for using yt-core! If you enjoy the project, consider Staring the GitHub repo https://github.com/shovitdutta/mixly/yt-core." +
            colors.reset(""));
        return Promise.resolve(JSON.parse(TubeCore));
    }
}

function extract({ query }) {
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
            }
            const payload = {
                audio_data: EnResp.AudioTube,
                video_data: EnResp.VideoTube,
                hdrvideo_data: EnResp.HDRVideoTube,
                meta_data: {
                    id: EnResp.metaTube.id,
                    original_url: EnResp.metaTube.original_url,
                    webpage_url: EnResp.metaTube.webpage_url,
                    title: EnResp.metaTube.title,
                    view_count: EnResp.metaTube.view_count,
                    like_count: EnResp.metaTube.like_count,
                    view_count_formatted: viewCountFormatted,
                    like_count_formatted: likeCountFormatted,
                    full_title: EnResp.metaTube.Fulltitle,
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
                },
            };
            resolve(payload);
        }
        catch (error) {
            reject(error instanceof z__namespace.ZodError ? error.errors : error);
        }
    });
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

function lowEntry(out) {
    if (!out || out.length === 0)
        return null;
    return out.reduce((prev, curr) => prev.meta_info.filesizebytes < curr.meta_info.filesizebytes ? prev : curr, out[0]);
}

const termwidth = process.stdout.columns;
const progressBar = (percent, _metaSpin) => {
    if (percent === undefined)
        return;
    const width = Math.floor(termwidth / 2);
    const scomp = Math.round((width * percent) / 100);
    let color = colors.green;
    if (percent < 20)
        color = colors.red;
    else if (percent < 80)
        color = colors.yellow;
    const sprog = color("▇").repeat(scomp) + color("━").repeat(width - scomp);
    const sbar = color("PROG: ") + `${sprog} ${percent.toFixed(2)}%`;
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(sbar);
    // if (percent >= 100) process.stdout.write("\n");
};

const metaSpin$f = crypto.randomUUID().toString();
async function AudioLowest({ query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp3", }) {
    try {
        if (!query || typeof query !== "string") {
            return {
                message: "Invalid query parameter",
                status: 500,
            };
        }
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
        const metaEntry = lowEntry(metaBody.AudioTube);
        const ytc = fluentffmpeg();
        ytc.input(metaEntry.meta_dl.mediaurl);
        ytc.input(metaBody.metaTube.thumbnail);
        ytc.addOutputOption("-map", "1:0");
        ytc.addOutputOption("-map", "0:a:0");
        ytc.addOutputOption("-id3v2_version", "3");
        ytc.format(outputFormat);
        ytc.on("start", (cmd) => {
            if (verbose)
                console.log(cmd);
            progressBar(0, metaSpin$f);
        });
        ytc.on("end", () => progressBar(100, metaSpin$f));
        ytc.on("close", () => progressBar(100, metaSpin$f));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$f));
        ytc.on("error", (error) => {
            return error;
        });
        switch (filter) {
            case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                metaName = `yt-core-(AudioLowest_bassboost)-${title}.${outputFormat}`;
                break;
            case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                metaName = `yt-core-(AudioLowest_echo)-${title}.${outputFormat}`;
                break;
            case "flanger":
                ytc.withAudioFilter(["flanger"]);
                metaName = `yt-core-(AudioLowest_flanger)-${title}.${outputFormat}`;
                break;
            case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                metaName = `yt-core-(AudioLowest_nightcore)-${title}.${outputFormat}`;
                break;
            case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                metaName = `yt-core-(AudioLowest_panning)-${title}.${outputFormat}`;
                break;
            case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                metaName = `yt-core-(AudioLowest_phaser)-${title}.${outputFormat}`;
                break;
            case "reverse":
                ytc.withAudioFilter(["areverse"]);
                metaName = `yt-core-(AudioLowest_reverse)-${title}.${outputFormat}`;
                break;
            case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                metaName = `yt-core-(AudioLowest_slow)-${title}.${outputFormat}`;
                break;
            case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                metaName = `yt-core-(AudioLowest_speed)-${title}.${outputFormat}`;
                break;
            case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                metaName = `yt-core-(AudioLowest_subboost)-${title}.${outputFormat}`;
                break;
            case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                metaName = `yt-core-(AudioLowest_superslow)-${title}.${outputFormat}`;
                break;
            case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                metaName = `yt-core-(AudioLowest_superspeed)-${title}.${outputFormat}`;
                break;
            case "surround":
                ytc.withAudioFilter(["surround"]);
                metaName = `yt-core-(AudioLowest_surround)-${title}.${outputFormat}`;
                break;
            case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                metaName = `yt-core-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
                break;
            case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                metaName = `yt-core-(AudioLowest_vibrato)-${title}.${outputFormat}`;
                break;
            default:
                ytc.withAudioFilter([]);
                metaName = `yt-core-(AudioLowest)-${title}.${outputFormat}`;
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

function bigEntry(out) {
    if (!out || out.length === 0)
        return null;
    return out.reduce((prev, curr) => prev.meta_info.filesizebytes > curr.meta_info.filesizebytes ? prev : curr, out[0]);
}

const metaSpin$e = crypto.randomUUID().toString();
async function AudioHighest({ query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp3", }) {
    try {
        if (!query || typeof query !== "string") {
            return {
                message: "Invalid query parameter",
                status: 500,
            };
        }
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
        const metaEntry = bigEntry(metaBody.AudioTube);
        const ytc = fluentffmpeg();
        ytc.input(metaEntry.meta_dl.mediaurl);
        ytc.input(metaBody.metaTube.thumbnail);
        ytc.addOutputOption("-map", "1:0");
        ytc.addOutputOption("-map", "0:a:0");
        ytc.addOutputOption("-id3v2_version", "3");
        ytc.format(outputFormat);
        ytc.on("start", (cmd) => {
            if (verbose)
                console.log(cmd);
            progressBar(0, metaSpin$e);
        });
        ytc.on("end", () => progressBar(100, metaSpin$e));
        ytc.on("close", () => progressBar(100, metaSpin$e));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$e));
        ytc.on("error", (error) => {
            return error;
        });
        switch (filter) {
            case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                metaName = `yt-core-(AudioHighest_bassboost)-${title}.${outputFormat}`;
                break;
            case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                metaName = `yt-core-(AudioHighest_echo)-${title}.${outputFormat}`;
                break;
            case "flanger":
                ytc.withAudioFilter(["flanger"]);
                metaName = `yt-core-(AudioHighest_flanger)-${title}.${outputFormat}`;
                break;
            case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                metaName = `yt-core-(AudioHighest_nightcore)-${title}.${outputFormat}`;
                break;
            case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                metaName = `yt-core-(AudioHighest_panning)-${title}.${outputFormat}`;
                break;
            case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                metaName = `yt-core-(AudioHighest_phaser)-${title}.${outputFormat}`;
                break;
            case "reverse":
                ytc.withAudioFilter(["areverse"]);
                metaName = `yt-core-(AudioHighest_reverse)-${title}.${outputFormat}`;
                break;
            case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                metaName = `yt-core-(AudioHighest_slow)-${title}.${outputFormat}`;
                break;
            case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                metaName = `yt-core-(AudioHighest_speed)-${title}.${outputFormat}`;
                break;
            case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                metaName = `yt-core-(AudioHighest_subboost)-${title}.${outputFormat}`;
                break;
            case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                metaName = `yt-core-(AudioHighest_superslow)-${title}.${outputFormat}`;
                break;
            case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                metaName = `yt-core-(AudioHighest_superspeed)-${title}.${outputFormat}`;
                break;
            case "surround":
                ytc.withAudioFilter(["surround"]);
                metaName = `yt-core-(AudioHighest_surround)-${title}.${outputFormat}`;
                break;
            case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                metaName = `yt-core-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
                break;
            case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                metaName = `yt-core-(AudioHighest_vibrato)-${title}.${outputFormat}`;
                break;
            default:
                ytc.withAudioFilter([]);
                metaName = `yt-core-(AudioHighest)-${title}.${outputFormat}`;
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

const metaSpin$d = crypto.randomUUID().toString();
async function VideoLowest({ query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp4", }) {
    try {
        if (!query || typeof query !== "string") {
            return {
                message: "Invalid query parameter",
                status: 500,
            };
        }
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
        const metaEntry = lowEntry(metaBody.VideoTube);
        const ytc = fluentffmpeg();
        ytc.input(metaEntry.meta_dl.mediaurl);
        ytc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                ytc.videoFilters("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                metaName = `yt-core_(VideoLowest-grayscale)_${title}.${outputFormat}`;
                break;
            case "invert":
                ytc.videoFilters("negate");
                metaName = `yt-core_(VideoLowest-invert)_${title}.${outputFormat}`;
                break;
            case "rotate90":
                ytc.videoFilters("rotate=PI/2");
                metaName = `yt-core_(VideoLowest-rotate90)_${title}.${outputFormat}`;
                break;
            case "rotate180":
                ytc.videoFilters("rotate=PI");
                metaName = `yt-core_(VideoLowest-rotate180)_${title}.${outputFormat}`;
                break;
            case "rotate270":
                ytc.videoFilters("rotate=3*PI/2");
                metaName = `yt-core_(VideoLowest-rotate270)_${title}.${outputFormat}`;
                break;
            case "flipHorizontal":
                ytc.videoFilters("hflip");
                metaName = `yt-core_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
                break;
            case "flipVertical":
                ytc.videoFilters("vflip");
                metaName = `yt-core_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
                break;
            default:
                metaName = `yt-core_(VideoLowest)_${title}.${outputFormat}`;
        }
        ytc.on("start", (cmd) => {
            if (verbose)
                console.log(cmd);
            progressBar(0, metaSpin$d);
        });
        ytc.on("end", () => progressBar(100, metaSpin$d));
        ytc.on("close", () => progressBar(100, metaSpin$d));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$d));
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

const metaSpin$c = crypto.randomUUID().toString();
async function VideoHighest({ query, filter, stream: stream$1, verbose, folderName, outputFormat = "mp4", }) {
    try {
        if (!query || typeof query !== "string") {
            return {
                message: "Invalid query parameter",
                status: 500,
            };
        }
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
        const metaEntry = bigEntry(metaBody.VideoTube);
        const ytc = fluentffmpeg();
        ytc.input(metaEntry.meta_dl.mediaurl);
        ytc.format(outputFormat);
        switch (filter) {
            case "grayscale":
                ytc.videoFilters("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                metaName = `yt-core_(VideoHighest-grayscale)_${title}.${outputFormat}`;
                break;
            case "invert":
                ytc.videoFilters("negate");
                metaName = `yt-core_(VideoHighest-invert)_${title}.${outputFormat}`;
                break;
            case "rotate90":
                ytc.videoFilters("rotate=PI/2");
                metaName = `yt-core_(VideoHighest-rotate90)_${title}.${outputFormat}`;
                break;
            case "rotate180":
                ytc.videoFilters("rotate=PI");
                metaName = `yt-core_(VideoHighest-rotate180)_${title}.${outputFormat}`;
                break;
            case "rotate270":
                ytc.videoFilters("rotate=3*PI/2");
                metaName = `yt-core_(VideoHighest-rotate270)_${title}.${outputFormat}`;
                break;
            case "flipHorizontal":
                ytc.videoFilters("hflip");
                metaName = `yt-core_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
                break;
            case "flipVertical":
                ytc.videoFilters("vflip");
                metaName = `yt-core_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
                break;
            default:
                metaName = `yt-core_(VideoHighest)_${title}.${outputFormat}`;
        }
        ytc.on("start", (cmd) => {
            if (verbose)
                console.log(cmd);
            progressBar(0, metaSpin$c);
        });
        ytc.on("end", () => progressBar(100, metaSpin$c));
        ytc.on("close", () => progressBar(100, metaSpin$c));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$c));
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

const metaSpin$b = crypto.randomUUID().toString();
async function AudioVideoLowest({ query, stream: stream$1, verbose, folderName, outputFormat = "mp4", }) {
    try {
        if (!query || typeof query !== "string") {
            return {
                message: "Invalid query parameter",
                status: 500,
            };
        }
        const metaBody = await Engine({ query });
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        let metaName = `yt-core_(AudioVideoLowest)_${title}.${outputFormat}`;
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const ytc = fluentffmpeg();
        ytc.addInput(lowEntry(metaBody.VideoTube).meta_dl.mediaurl);
        ytc.addInput(lowEntry(metaBody.AudioTube).meta_dl.mediaurl);
        ytc.format(outputFormat);
        ytc.on("start", (cmd) => {
            if (verbose)
                console.log(cmd);
            progressBar(0, metaSpin$b);
        });
        ytc.on("end", () => progressBar(100, metaSpin$b));
        ytc.on("close", () => progressBar(100, metaSpin$b));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$b));
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

const metaSpin$a = crypto.randomUUID().toString();
async function AudioVideoHighest({ query, stream: stream$1, verbose, folderName, outputFormat = "mp4", }) {
    try {
        if (!query || typeof query !== "string") {
            return {
                message: "Invalid query parameter",
                status: 500,
            };
        }
        const metaBody = await Engine({ query });
        console.log(metaBody);
        if (!metaBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
        let metaName = `yt-core_(AudioVideoHighest)_${title}.${outputFormat}`;
        const metaFold = folderName
            ? path__namespace.join(process.cwd(), folderName)
            : process.cwd();
        if (!fs__namespace.existsSync(metaFold))
            fs__namespace.mkdirSync(metaFold, { recursive: true });
        const ytc = fluentffmpeg();
        ytc.addInput(bigEntry(metaBody.VideoTube).meta_dl.mediaurl);
        ytc.addInput(bigEntry(metaBody.AudioTube).meta_dl.mediaurl);
        ytc.format(outputFormat);
        ytc.on("start", (cmd) => {
            if (verbose)
                console.log(cmd);
            progressBar(0, metaSpin$a);
        });
        ytc.on("end", () => progressBar(100, metaSpin$a));
        ytc.on("close", () => progressBar(100, metaSpin$a));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$a));
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

const metaSpin$9 = crypto.randomUUID().toString();
async function AudioQualityCustom({ query, filter, quality, stream: stream$1, folderName, outputFormat = "mp3", }) {
    try {
        if (!query ||
            typeof query !== "string" ||
            !quality ||
            typeof quality !== "string") {
            return {
                message: "Invalid query or quality parameter",
                status: 500,
            };
        }
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
        const metaEntry = bigEntry(metaBody);
        ytc.input(metaEntry.meta_dl.mediaurl);
        ytc.input(metaResp.metaTube.thumbnail);
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
        ytc.on("start", () => progressBar(0, metaSpin$9));
        ytc.on("end", () => progressBar(100, metaSpin$9));
        ytc.on("close", () => progressBar(100, metaSpin$9));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$9));
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
                    ? path__namespace.join(metaFold, `yt-core-(${quality})-${title}.${outputFormat}`)
                    : `yt-core-(${quality})-${title}.${outputFormat}`,
            };
        }
        else {
            await new Promise((resolve, reject) => {
                ytc
                    .output(path__namespace.join(metaFold, `yt-core-(${quality})-${title}.${outputFormat}`))
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

const metaSpin$8 = crypto.randomUUID().toString();
async function VideoQualityCustom({ query, filter, quality, stream: stream$1, folderName, outputFormat = "mp4", }) {
    try {
        if (!query ||
            typeof query !== "string" ||
            !quality ||
            typeof quality !== "string") {
            return {
                message: "Invalid query or quality parameter",
                status: 500,
            };
        }
        const EnResp = await Engine({ query });
        if (!EnResp) {
            return {
                message: "The specified quality was not found...",
                status: 500,
            };
        }
        const YSBody = EnResp.VideoTube.filter((op) => op.meta_dl.formatnote === quality);
        if (!YSBody) {
            return {
                message: "Unable to get response from YouTube...",
                status: 500,
            };
        }
        else {
            let ipop = "";
            const title = EnResp.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
            const opfol = folderName
                ? path__namespace.join(process.cwd(), folderName)
                : process.cwd();
            if (!fs__namespace.existsSync(opfol))
                fs__namespace.mkdirSync(opfol, { recursive: true });
            const ytc = fluentffmpeg();
            const metaEntry = bigEntry(YSBody);
            ytc.input(metaEntry.meta_dl.mediaurl);
            ytc.format(outputFormat);
            switch (filter) {
                case "grayscale":
                    ytc.withVideoFilter([
                        "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
                    ]);
                    ipop = `yt-core_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
                    break;
                case "invert":
                    ytc.withVideoFilter(["negate"]);
                    ipop = `yt-core_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
                    break;
                case "rotate90":
                    ytc.withVideoFilter(["rotate=PI/2"]);
                    ipop = `yt-core_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
                    break;
                case "rotate180":
                    ytc.withVideoFilter(["rotate=PI"]);
                    ipop = `yt-core_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
                    break;
                case "rotate270":
                    ytc.withVideoFilter(["rotate=3*PI/2"]);
                    ipop = `yt-core_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
                    break;
                case "flipHorizontal":
                    ytc.withVideoFilter(["hflip"]);
                    ipop = `yt-core_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                case "flipVertical":
                    ytc.withVideoFilter(["vflip"]);
                    ipop = `yt-core_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
                    break;
                default:
                    ytc.withVideoFilter([]);
                    ipop = `yt-core_(VideoQualityCustom)_${title}.${outputFormat}`;
            }
            ytc.on("start", () => {
                progressBar(0, metaSpin$8);
            });
            ytc.on("end", () => progressBar(100, metaSpin$8));
            ytc.on("close", () => progressBar(100, metaSpin$8));
            ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$8));
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
                    filename: folderName ? path__namespace.join(opfol, ipop) : ipop,
                };
            }
            else {
                await new Promise((resolve, reject) => {
                    ytc
                        .output(path__namespace.join(opfol, ipop))
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

const metaSpin$7 = crypto.randomUUID().toString();
async function ListVideoLowest({ filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaName = "";
                    const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                    const metaFold = folderName
                        ? path__namespace.join(process.cwd(), folderName)
                        : process.cwd();
                    if (!fs__namespace.existsSync(metaFold))
                        fs__namespace.mkdirSync(metaFold, { recursive: true });
                    const metaEntry = lowEntry(metaBody.VideoTube);
                    const ytc = fluentffmpeg();
                    ytc.input(metaEntry.meta_dl.mediaurl);
                    ytc.format(outputFormat);
                    ytc.on("start", (cmd) => {
                        if (verbose)
                            console.log(cmd);
                        progressBar(0, metaSpin$7);
                    });
                    ytc.on("end", () => progressBar(100, metaSpin$7));
                    ytc.on("close", () => progressBar(100, metaSpin$7));
                    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$7));
                    switch (filter) {
                        case "grayscale":
                            ytc.videoFilters("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                            metaName = `yt-core_(VideoLowest-grayscale)_${title}.${outputFormat}`;
                            break;
                        case "invert":
                            ytc.videoFilters("negate");
                            metaName = `yt-core_(VideoLowest-invert)_${title}.${outputFormat}`;
                            break;
                        case "rotate90":
                            ytc.videoFilters("rotate=PI/2");
                            metaName = `yt-core_(VideoLowest-rotate90)_${title}.${outputFormat}`;
                            break;
                        case "rotate180":
                            ytc.videoFilters("rotate=PI");
                            metaName = `yt-core_(VideoLowest-rotate180)_${title}.${outputFormat}`;
                            break;
                        case "rotate270":
                            ytc.videoFilters("rotate=3*PI/2");
                            metaName = `yt-core_(VideoLowest-rotate270)_${title}.${outputFormat}`;
                            break;
                        case "flipHorizontal":
                            ytc.videoFilters("hflip");
                            metaName = `yt-core_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
                            break;
                        case "flipVertical":
                            ytc.videoFilters("vflip");
                            metaName = `yt-core_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
                            break;
                        default:
                            metaName = `yt-core_(VideoLowest)_${title}.${outputFormat}`;
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
                        results.push({
                            stream: readStream,
                            filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const metaSpin$6 = crypto.randomUUID().toString();
async function ListVideoHighest({ filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaName = "";
                    const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                    const metaFold = folderName
                        ? path__namespace.join(process.cwd(), folderName)
                        : process.cwd();
                    if (!fs__namespace.existsSync(metaFold))
                        fs__namespace.mkdirSync(metaFold, { recursive: true });
                    const metaEntry = bigEntry(metaBody.VideoTube);
                    const ytc = fluentffmpeg();
                    ytc.input(metaEntry.meta_dl.mediaurl);
                    ytc.format(outputFormat);
                    ytc.on("start", (cmd) => {
                        if (verbose)
                            console.log(cmd);
                        progressBar(0, metaSpin$6);
                    });
                    ytc.on("end", () => progressBar(100, metaSpin$6));
                    ytc.on("close", () => progressBar(100, metaSpin$6));
                    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$6));
                    switch (filter) {
                        case "grayscale":
                            ytc.videoFilters("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                            metaName = `yt-core_(VideoHighest-grayscale)_${title}.${outputFormat}`;
                            break;
                        case "invert":
                            ytc.videoFilters("negate");
                            metaName = `yt-core_(VideoHighest-invert)_${title}.${outputFormat}`;
                            break;
                        case "rotate90":
                            ytc.videoFilters("rotate=PI/2");
                            metaName = `yt-core_(VideoHighest-rotate90)_${title}.${outputFormat}`;
                            break;
                        case "rotate180":
                            ytc.videoFilters("rotate=PI");
                            metaName = `yt-core_(VideoHighest-rotate180)_${title}.${outputFormat}`;
                            break;
                        case "rotate270":
                            ytc.videoFilters("rotate=3*PI/2");
                            metaName = `yt-core_(VideoHighest-rotate270)_${title}.${outputFormat}`;
                            break;
                        case "flipHorizontal":
                            ytc.videoFilters("hflip");
                            metaName = `yt-core_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
                            break;
                        case "flipVertical":
                            ytc.videoFilters("vflip");
                            metaName = `yt-core_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
                            break;
                        default:
                            metaName = `yt-core_(VideoHighest)_${title}.${outputFormat}`;
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
                        results.push({
                            stream: readStream,
                            filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const metaSpin$5 = crypto.randomUUID().toString();
async function ListVideoQualityCustom({ filter, stream: stream$1, quality, verbose, folderName, playlistUrls, outputFormat = "mp4", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaBody;
                    metaBody = await Engine({ query: video.url });
                    if (!metaBody) {
                        results.push({
                            message: "Unable to get response from YouTube...",
                            status: 500,
                        });
                    }
                    else {
                        metaBody = metaBody.VideoTube.filter((op) => op.meta_dl.formatnote === quality);
                        if (!metaBody) {
                            results.push({
                                message: "Unable to get response from YouTube...",
                                status: 500,
                            });
                        }
                        else {
                            let metaName = "";
                            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                            const metaFold = folderName
                                ? path__namespace.join(process.cwd(), folderName)
                                : process.cwd();
                            if (!fs__namespace.existsSync(metaFold))
                                fs__namespace.mkdirSync(metaFold, { recursive: true });
                            const metaEntry = bigEntry(metaBody.VideoTube);
                            const ytc = fluentffmpeg();
                            ytc.input(metaEntry.meta_dl.mediaurl);
                            ytc.format(outputFormat);
                            ytc.on("start", (cmd) => {
                                if (verbose)
                                    console.log(cmd);
                                progressBar(0, metaSpin$5);
                            });
                            ytc.on("end", () => progressBar(100, metaSpin$5));
                            ytc.on("close", () => progressBar(100, metaSpin$5));
                            ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$5));
                            switch (filter) {
                                case "grayscale":
                                    ytc.withVideoFilter([
                                        "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
                                    ]);
                                    metaName = `yt-core_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
                                    break;
                                case "invert":
                                    ytc.withVideoFilter(["negate"]);
                                    metaName = `yt-core_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
                                    break;
                                case "rotate90":
                                    ytc.withVideoFilter(["rotate=PI/2"]);
                                    metaName = `yt-core_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
                                    break;
                                case "rotate180":
                                    ytc.withVideoFilter(["rotate=PI"]);
                                    metaName = `yt-core_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
                                    break;
                                case "rotate270":
                                    ytc.withVideoFilter(["rotate=3*PI/2"]);
                                    metaName = `yt-core_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
                                    break;
                                case "flipHorizontal":
                                    ytc.withVideoFilter(["hflip"]);
                                    metaName = `yt-core_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
                                    break;
                                case "flipVertical":
                                    ytc.withVideoFilter(["vflip"]);
                                    metaName = `yt-core_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
                                    break;
                                default:
                                    ytc.withVideoFilter([]);
                                    metaName = `yt-core_(VideoQualityCustom)_${title}.${outputFormat}`;
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const metaSpin$4 = crypto.randomUUID().toString();
async function ListAudioLowest({ filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp3", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaName = "";
                    const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                    const metaFold = folderName
                        ? path__namespace.join(process.cwd(), folderName)
                        : process.cwd();
                    if (!fs__namespace.existsSync(metaFold))
                        fs__namespace.mkdirSync(metaFold, { recursive: true });
                    const metaEntry = lowEntry(metaBody.AudioTube);
                    const ytc = fluentffmpeg();
                    ytc.input(metaEntry.meta_dl.mediaurl);
                    ytc.input(metaBody.metaTube.thumbnail);
                    ytc.addOutputOption("-map", "1:0");
                    ytc.addOutputOption("-map", "0:a:0");
                    ytc.addOutputOption("-id3v2_version", "3");
                    ytc.format(outputFormat);
                    ytc.on("start", (cmd) => {
                        if (verbose)
                            console.log(cmd);
                        progressBar(0, metaSpin$4);
                    });
                    ytc.on("end", () => progressBar(100, metaSpin$4));
                    ytc.on("close", () => progressBar(100, metaSpin$4));
                    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$4));
                    switch (filter) {
                        case "bassboost":
                            ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                            metaName = `yt-core-(AudioLowest_bassboost)-${title}.${outputFormat}`;
                            break;
                        case "echo":
                            ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                            metaName = `yt-core-(AudioLowest_echo)-${title}.${outputFormat}`;
                            break;
                        case "flanger":
                            ytc.withAudioFilter(["flanger"]);
                            metaName = `yt-core-(AudioLowest_flanger)-${title}.${outputFormat}`;
                            break;
                        case "nightcore":
                            ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                            metaName = `yt-core-(AudioLowest_nightcore)-${title}.${outputFormat}`;
                            break;
                        case "panning":
                            ytc.withAudioFilter(["apulsator=hz=0.08"]);
                            metaName = `yt-core-(AudioLowest_panning)-${title}.${outputFormat}`;
                            break;
                        case "phaser":
                            ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                            metaName = `yt-core-(AudioLowest_phaser)-${title}.${outputFormat}`;
                            break;
                        case "reverse":
                            ytc.withAudioFilter(["areverse"]);
                            metaName = `yt-core-(AudioLowest_reverse)-${title}.${outputFormat}`;
                            break;
                        case "slow":
                            ytc.withAudioFilter(["atempo=0.8"]);
                            metaName = `yt-core-(AudioLowest_slow)-${title}.${outputFormat}`;
                            break;
                        case "speed":
                            ytc.withAudioFilter(["atempo=2"]);
                            metaName = `yt-core-(AudioLowest_speed)-${title}.${outputFormat}`;
                            break;
                        case "subboost":
                            ytc.withAudioFilter(["asubboost"]);
                            metaName = `yt-core-(AudioLowest_subboost)-${title}.${outputFormat}`;
                            break;
                        case "superslow":
                            ytc.withAudioFilter(["atempo=0.5"]);
                            metaName = `yt-core-(AudioLowest_superslow)-${title}.${outputFormat}`;
                            break;
                        case "superspeed":
                            ytc.withAudioFilter(["atempo=3"]);
                            metaName = `yt-core-(AudioLowest_superspeed)-${title}.${outputFormat}`;
                            break;
                        case "surround":
                            ytc.withAudioFilter(["surround"]);
                            metaName = `yt-core-(AudioLowest_surround)-${title}.${outputFormat}`;
                            break;
                        case "vaporwave":
                            ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                            metaName = `yt-core-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
                            break;
                        case "vibrato":
                            ytc.withAudioFilter(["vibrato=f=6.5"]);
                            metaName = `yt-core-(AudioLowest_vibrato)-${title}.${outputFormat}`;
                            break;
                        default:
                            ytc.withAudioFilter([]);
                            metaName = `yt-core-(AudioLowest)-${title}.${outputFormat}`;
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
                        results.push({
                            stream: readStream,
                            filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const metaSpin$3 = crypto.randomUUID().toString();
async function ListAudioHighest({ filter, stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp3", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaName = "";
                    const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                    const metaFold = folderName
                        ? path__namespace.join(process.cwd(), folderName)
                        : process.cwd();
                    if (!fs__namespace.existsSync(metaFold))
                        fs__namespace.mkdirSync(metaFold, { recursive: true });
                    const metaEntry = bigEntry(metaBody.AudioTube);
                    const ytc = fluentffmpeg();
                    ytc.input(metaEntry.meta_dl.mediaurl);
                    ytc.input(metaBody.metaTube.thumbnail);
                    ytc.addOutputOption("-map", "1:0");
                    ytc.addOutputOption("-map", "0:a:0");
                    ytc.addOutputOption("-id3v2_version", "3");
                    ytc.format(outputFormat);
                    ytc.on("start", (cmd) => {
                        if (verbose)
                            console.log(cmd);
                        progressBar(0, metaSpin$3);
                    });
                    ytc.on("end", () => progressBar(100, metaSpin$3));
                    ytc.on("close", () => progressBar(100, metaSpin$3));
                    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$3));
                    switch (filter) {
                        case "bassboost":
                            ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                            metaName = `yt-core-(AudioHighest_bassboost)-${title}.${outputFormat}`;
                            break;
                        case "echo":
                            ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                            metaName = `yt-core-(AudioHighest_echo)-${title}.${outputFormat}`;
                            break;
                        case "flanger":
                            ytc.withAudioFilter(["flanger"]);
                            metaName = `yt-core-(AudioHighest_flanger)-${title}.${outputFormat}`;
                            break;
                        case "nightcore":
                            ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                            metaName = `yt-core-(AudioHighest_nightcore)-${title}.${outputFormat}`;
                            break;
                        case "panning":
                            ytc.withAudioFilter(["apulsator=hz=0.08"]);
                            metaName = `yt-core-(AudioHighest_panning)-${title}.${outputFormat}`;
                            break;
                        case "phaser":
                            ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                            metaName = `yt-core-(AudioHighest_phaser)-${title}.${outputFormat}`;
                            break;
                        case "reverse":
                            ytc.withAudioFilter(["areverse"]);
                            metaName = `yt-core-(AudioHighest_reverse)-${title}.${outputFormat}`;
                            break;
                        case "slow":
                            ytc.withAudioFilter(["atempo=0.8"]);
                            metaName = `yt-core-(AudioHighest_slow)-${title}.${outputFormat}`;
                            break;
                        case "speed":
                            ytc.withAudioFilter(["atempo=2"]);
                            metaName = `yt-core-(AudioHighest_speed)-${title}.${outputFormat}`;
                            break;
                        case "subboost":
                            ytc.withAudioFilter(["asubboost"]);
                            metaName = `yt-core-(AudioHighest_subboost)-${title}.${outputFormat}`;
                            break;
                        case "superslow":
                            ytc.withAudioFilter(["atempo=0.5"]);
                            metaName = `yt-core-(AudioHighest_superslow)-${title}.${outputFormat}`;
                            break;
                        case "superspeed":
                            ytc.withAudioFilter(["atempo=3"]);
                            metaName = `yt-core-(AudioHighest_superspeed)-${title}.${outputFormat}`;
                            break;
                        case "surround":
                            ytc.withAudioFilter(["surround"]);
                            metaName = `yt-core-(AudioHighest_surround)-${title}.${outputFormat}`;
                            break;
                        case "vaporwave":
                            ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                            metaName = `yt-core-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
                            break;
                        case "vibrato":
                            ytc.withAudioFilter(["vibrato=f=6.5"]);
                            metaName = `yt-core-(AudioHighest_vibrato)-${title}.${outputFormat}`;
                            break;
                        default:
                            ytc.withAudioFilter([]);
                            metaName = `yt-core-(AudioHighest)-${title}.${outputFormat}`;
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
                        results.push({
                            stream: readStream,
                            filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const metaSpin$2 = crypto.randomUUID().toString();
async function ListAudioQualityCustom({ filter, stream: stream$1, quality, verbose, folderName, playlistUrls, outputFormat = "mp3", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaBody;
                    metaBody = await Engine({ query: video.url });
                    if (!metaBody) {
                        results.push({
                            message: "Unable to get response from YouTube...",
                            status: 500,
                        });
                    }
                    else {
                        metaBody = metaBody.AudioTube.filter((op) => op.meta_dl.formatnote === quality);
                        if (!metaBody) {
                            results.push({
                                message: "Unable to get response from YouTube...",
                                status: 500,
                            });
                        }
                        else {
                            let metaName = "";
                            const title = metaBody.metaTube.title.replace(/[^a-zA-Z0-9_]+/g, "-");
                            const metaFold = folderName
                                ? path__namespace.join(process.cwd(), folderName)
                                : process.cwd();
                            if (!fs__namespace.existsSync(metaFold))
                                fs__namespace.mkdirSync(metaFold, { recursive: true });
                            const metaEntry = bigEntry(metaBody.AudioTube);
                            const ytc = fluentffmpeg();
                            ytc.input(metaEntry.meta_dl.mediaurl);
                            ytc.input(metaBody.metaTube.thumbnail);
                            ytc.addOutputOption("-map", "1:0");
                            ytc.addOutputOption("-map", "0:a:0");
                            ytc.addOutputOption("-id3v2_version", "3");
                            ytc.format(outputFormat);
                            ytc.on("start", (cmd) => {
                                if (verbose)
                                    console.log(cmd);
                                progressBar(0, metaSpin$2);
                            });
                            ytc.on("end", () => progressBar(100, metaSpin$2));
                            ytc.on("close", () => progressBar(100, metaSpin$2));
                            ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$2));
                            switch (filter) {
                                case "bassboost":
                                    ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                                    metaName = `yt-core-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
                                    break;
                                case "echo":
                                    ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                                    metaName = `yt-core-(AudioQualityCustom_echo)-${title}.${outputFormat}`;
                                    break;
                                case "flanger":
                                    ytc.withAudioFilter(["flanger"]);
                                    metaName = `yt-core-(AudioQualityCustom_flanger)-${title}.${outputFormat}`;
                                    break;
                                case "nightcore":
                                    ytc.withAudioFilter([
                                        "aresample=48000,asetrate=48000*1.25",
                                    ]);
                                    metaName = `yt-core-(AudioQualityCustom_nightcore)-${title}.${outputFormat}`;
                                    break;
                                case "panning":
                                    ytc.withAudioFilter(["apulsator=hz=0.08"]);
                                    metaName = `yt-core-(AudioQualityCustom_panning)-${title}.${outputFormat}`;
                                    break;
                                case "phaser":
                                    ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                                    metaName = `yt-core-(AudioQualityCustom_phaser)-${title}.${outputFormat}`;
                                    break;
                                case "reverse":
                                    ytc.withAudioFilter(["areverse"]);
                                    metaName = `yt-core-(AudioQualityCustom_reverse)-${title}.${outputFormat}`;
                                    break;
                                case "slow":
                                    ytc.withAudioFilter(["atempo=0.8"]);
                                    metaName = `yt-core-(AudioQualityCustom_slow)-${title}.${outputFormat}`;
                                    break;
                                case "speed":
                                    ytc.withAudioFilter(["atempo=2"]);
                                    metaName = `yt-core-(AudioQualityCustom_speed)-${title}.${outputFormat}`;
                                    break;
                                case "subboost":
                                    ytc.withAudioFilter(["asubboost"]);
                                    metaName = `yt-core-(AudioQualityCustom_subboost)-${title}.${outputFormat}`;
                                    break;
                                case "superslow":
                                    ytc.withAudioFilter(["atempo=0.5"]);
                                    metaName = `yt-core-(AudioQualityCustom_superslow)-${title}.${outputFormat}`;
                                    break;
                                case "superspeed":
                                    ytc.withAudioFilter(["atempo=3"]);
                                    metaName = `yt-core-(AudioQualityCustom_superspeed)-${title}.${outputFormat}`;
                                    break;
                                case "surround":
                                    ytc.withAudioFilter(["surround"]);
                                    metaName = `yt-core-(AudioQualityCustom_surround)-${title}.${outputFormat}`;
                                    break;
                                case "vaporwave":
                                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                                    metaName = `yt-core-(AudioQualityCustom_vaporwave)-${title}.${outputFormat}`;
                                    break;
                                case "vibrato":
                                    ytc.withAudioFilter(["vibrato=f=6.5"]);
                                    metaName = `yt-core-(AudioQualityCustom_vibrato)-${title}.${outputFormat}`;
                                    break;
                                default:
                                    ytc.withAudioFilter([]);
                                    metaName = `yt-core-(AudioQualityCustom)-${title}.${outputFormat}`;
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const metaSpin$1 = crypto.randomUUID().toString();
async function ListAudioVideoLowest({ stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaName = `yt-core_(AudioVideoLowest)_${title}.${outputFormat}`;
                    const metaFold = folderName
                        ? path__namespace.join(process.cwd(), folderName)
                        : process.cwd();
                    if (!fs__namespace.existsSync(metaFold))
                        fs__namespace.mkdirSync(metaFold, { recursive: true });
                    const ytc = fluentffmpeg();
                    ytc.addInput(lowEntry(metaBody.VideoTube).meta_dl.mediaurl);
                    ytc.addInput(lowEntry(metaBody.AudioTube).meta_dl.mediaurl);
                    ytc.format(outputFormat);
                    ytc.on("start", (cmd) => {
                        if (verbose)
                            console.log(cmd);
                        progressBar(0, metaSpin$1);
                    });
                    ytc.on("end", () => progressBar(100, metaSpin$1));
                    ytc.on("close", () => progressBar(100, metaSpin$1));
                    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin$1));
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
                            filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const metaSpin = crypto.randomUUID().toString();
async function ListAudioVideoHighest({ stream: stream$1, verbose, folderName, playlistUrls, outputFormat = "mp4", }) {
    try {
        if (!Array.isArray(playlistUrls) ||
            !playlistUrls.every((url) => typeof url === "string")) {
            return [
                {
                    message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
                    status: 500,
                },
            ];
        }
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
                    let metaName = `yt-core_(AudioVideoHighest)_${title}.${outputFormat}`;
                    const metaFold = folderName
                        ? path__namespace.join(process.cwd(), folderName)
                        : process.cwd();
                    if (!fs__namespace.existsSync(metaFold))
                        fs__namespace.mkdirSync(metaFold, { recursive: true });
                    const ytc = fluentffmpeg();
                    ytc.addInput(bigEntry(metaBody.VideoTube).meta_dl.mediaurl);
                    ytc.addInput(bigEntry(metaBody.AudioTube).meta_dl.mediaurl);
                    ytc.format(outputFormat);
                    ytc.on("start", (cmd) => {
                        if (verbose)
                            console.log(cmd);
                        progressBar(0, metaSpin);
                    });
                    ytc.on("end", () => progressBar(100, metaSpin));
                    ytc.on("close", () => progressBar(100, metaSpin));
                    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin));
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
                            filename: folderName ? path__namespace.join(metaFold, metaName) : metaName,
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
    catch (error) {
        switch (true) {
            case error instanceof Error:
                return [
                    {
                        message: error.message,
                        status: 500,
                    },
                ];
            default:
                return [
                    {
                        message: "Internal server error",
                        status: 500,
                    },
                ];
        }
    }
}

const ytCore = {
    info: {
        help,
        extract,
        search,
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
            lowest: VideoLowest,
            highest: VideoHighest,
            custom: VideoQualityCustom,
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

module.exports = ytCore;
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
