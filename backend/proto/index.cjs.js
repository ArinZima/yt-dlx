/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
'use strict';

var cors = require('cors');
var colors = require('colors');
var helmet = require('helmet');
var morgan = require('morgan');
var express = require('express');
var search = require('yt-search');
var path = require('path');
var util = require('util');
var child_process = require('child_process');
var ngrok = require('@ngrok/ngrok');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

async function exAsync({ query, proxy, retries, }) {
    for (let i = 0; i < retries; i++) {
        try {
            let proLoc = path.join(__dirname, "..", "util", "Engine");
            if (proxy)
                proLoc += ` --proxy '${proxy}' --dump-json '${query}'`;
            else
                proLoc += ` --dump-json '${query}'`;
            const result = await util.promisify(child_process.exec)(proLoc);
            if (result.stderr)
                console.error(result.stderr.toString());
            return result.stdout.toString() || null;
        }
        catch (error) {
            console.error(error);
        }
    }
    return null;
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

function YouTubeID(url) {
    return new Promise((resolve, _) => {
        if (/youtu\.?be/.test(url)) {
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
                if (patterns[i].test(url)) {
                    if (i === patterns.length - 1) {
                        const match = patterns[i].exec(url);
                        const playlistParams = new URLSearchParams(match[0]);
                        const videoId = playlistParams.get("v");
                        return resolve(videoId);
                    }
                    else
                        return resolve(patterns[i].exec(url)[1]);
                }
            }
        }
        resolve(null);
    });
}

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/core", async (req, res) => {
    try {
        let pushTube = [];
        let proTube;
        if (!req.query.query)
            return res.status(200).json(null);
        const query = decodeURIComponent(req.query.query);
        if (req.query.proxy) {
            const proxy = decodeURIComponent(req.query.proxy);
            console.log(colors.bold.green("with-proxy @addr:"), proxy);
            proTube = await exAsync({
                retries: 4,
                proxy,
                query,
            });
        }
        else {
            proTube = await exAsync({
                retries: 4,
                query,
            });
        }
        if (proTube === null)
            return res.status(200).json(null);
        const metaTube = await JSON.parse(proTube);
        await metaTube.formats.forEach((ipop) => {
            const rmval = new Set(["storyboard", "Default"]);
            if (!rmval.has(ipop.format_note) && ipop.filesize !== null) {
                const reTube = {
                    meta_audio: {
                        samplerate: ipop.asr,
                        channels: ipop.audio_channels,
                        codec: ipop.acodec,
                        extension: ipop.audio_ext,
                        bitrate: ipop.abr,
                    },
                    meta_video: {
                        height: ipop.height,
                        width: ipop.width,
                        codec: ipop.vcodec,
                        resolution: ipop.resolution,
                        aspectratio: ipop.aspect_ratio,
                        extension: ipop.video_ext,
                        bitrate: ipop.vbr,
                    },
                    meta_dl: {
                        formatid: ipop.format_id,
                        formatnote: ipop.format_note,
                        originalformat: ipop.format
                            .replace(/[-\s]+/g, "_")
                            .replace(/_/g, "_"),
                        mediaurl: ipop.url,
                    },
                    meta_info: {
                        filesizebytes: ipop.filesize,
                        filesizeformatted: sizeFormat(ipop.filesize),
                        framespersecond: ipop.fps,
                        totalbitrate: ipop.tbr,
                        qriginalextension: ipop.ext,
                        dynamicrange: ipop.dynamic_range,
                        extensionconatainer: ipop.container,
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
                        Description: metaTube.Description,
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
                            pushTube.push({ Tube: "AudioTube", reTube });
                            break;
                        case reTube.meta_dl.formatnote.includes("HDR"):
                            pushTube.push({ Tube: "HDRVideoTube", reTube });
                            break;
                        default:
                            pushTube.push({ Tube: "VideoTube", reTube });
                            break;
                    }
                }
            }
        });
        return res.status(200).json({
            AudioTube: pushTube
                .filter((item) => item.Tube === "AudioTube")
                .map((item) => item.reTube) || null,
            VideoTube: pushTube
                .filter((item) => item.Tube === "VideoTube")
                .map((item) => item.reTube) || null,
            HDRVideoTube: pushTube
                .filter((item) => item.Tube === "HDRVideoTube")
                .map((item) => item.reTube) || null,
            metaTube: pushTube
                .filter((item) => item.Tube === "metaTube")
                .map((item) => item.reTube)[0] || null,
        });
    }
    catch (error) {
        console.log(colors.bold.red("@error:"), error);
        return res.status(200).json(null);
    }
});
app.get("/scrape", async (req, res) => {
    try {
        let meta;
        let videoId;
        let metaTube = [];
        const query = decodeURIComponent(req.query.query);
        const PlaylistRegex = /(https?:\/\/(www\.)?youtube\.com(\/playlist\?list=[a-zA-Z0-9_-]+)|(\/channel\/[\w_\-]{2,}\/playlists))/;
        const VideoRegex = /(https?:\/\/(www\.)?youtube\.com\/watch\?(?!.*v=)[a-zA-Z0-9]+|https:\/\/youtu\.be\/[a-zA-Z0-9\-_])/;
        switch (true) {
            case !req.query.query:
                return res.status(200).json(null);
            case PlaylistRegex.test(query):
                const playlistId = await YouTubeID(query);
                if (playlistId) {
                    meta = await search({ listId: playlistId });
                    return res.status(200).json({
                        Link: meta.url,
                        Title: meta.title,
                        UploadDate: meta.date,
                        PlaylistSize: meta.size,
                        PlayListId: meta.listId,
                        Uploader: meta.author.name,
                        ChannelLink: meta.author.url,
                        ViewCount: formatCount(meta.views),
                        ThumbnailLink: meta.image || meta.thumbnail,
                        Videos: meta.videos.map((meta) => ({
                            videoId: meta.videoId,
                            Title: meta.title,
                        })),
                    });
                }
                else
                    return res.status(200).json(null);
            case /^PL?[a-zA-Z0-9_-]+$/.test(query):
                meta = await search({ listId: query });
                if (meta) {
                    return res.status(200).json({
                        Link: meta.url,
                        Title: meta.title,
                        UploadDate: meta.date,
                        PlaylistSize: meta.size,
                        PlayListId: meta.listId,
                        Uploader: meta.author.name,
                        ChannelLink: meta.author.url,
                        ViewCount: formatCount(meta.views),
                        ThumbnailLink: meta.image || meta.thumbnail,
                        Videos: meta.videos.map((meta) => ({
                            videoId: meta.videoId,
                            Title: meta.title,
                        })),
                    });
                }
                else
                    return res.status(200).json(null);
            case VideoRegex.test(query):
                videoId = await YouTubeID(query);
                if (videoId) {
                    meta = await search({ videoId });
                    return res.status(200).json({
                        Link: meta.url,
                        Title: meta.title,
                        UploadDate: meta.ago,
                        videoId: meta.videoId,
                        Length: meta.timestamp,
                        Uploader: meta.author.name,
                        ChannelLink: meta.author.url,
                        Description: meta.description,
                        ViewCount: formatCount(meta.views),
                        ThumbnailLink: meta.image || meta.thumbnail,
                    });
                }
                else
                    return res.status(200).json(null);
            case /^[a-zA-Z0-9_-]{11}$/.test(query):
                meta = await search({ videoId: query });
                if (meta) {
                    return res.status(200).json({
                        Link: meta.url,
                        Title: meta.title,
                        UploadDate: meta.ago,
                        videoId: meta.videoId,
                        Length: meta.timestamp,
                        Uploader: meta.author.name,
                        ChannelLink: meta.author.url,
                        Description: meta.description,
                        ViewCount: formatCount(meta.views),
                        ThumbnailLink: meta.image || meta.thumbnail,
                    });
                }
                else
                    return res.status(200).json(null);
            default:
                meta = await search(query);
                if (meta) {
                    for (let i = 0; i < meta.videos.length; i++) {
                        metaTube.push({
                            Link: meta.videos[i].url,
                            Title: meta.videos[i].title,
                            UploadDate: meta.videos[i].ago,
                            videoId: meta.videos[i].videoId,
                            Length: meta.videos[i].timestamp,
                            Uploader: meta.videos[i].author.name,
                            ChannelLink: meta.videos[i].author.url,
                            Description: meta.videos[i].description,
                            ViewCount: formatCount(meta.videos[i].views),
                            ThumbnailLink: meta.videos[i].image || meta.videos[i].thumbnail,
                        });
                    }
                    return res.status(200).json(metaTube);
                }
                else
                    return res.status(200).json(null);
        }
    }
    catch (error) {
        console.log(colors.bold.red("@error:"), error);
        return res.status(200).json(null);
    }
});
const port = process.env.PORT || 8080;
const server = app.listen(port, async () => {
    console.log(colors.bold.green("@express:"), port);
    const ng = await ngrok.connect({
        addr: port,
        domain: "possible-willingly-yeti.ngrok-free.app",
        authtoken: "2ckx63TtY6U2VWZ9hPLLF3Uw2zJ_7vA1a9mHRFKDEvQAT8YNg",
    });
    console.log(colors.bold.green("@ingress:"), ng.url());
});
async function handleSIGINT() {
    await new Promise((resolve) => {
        server.close(resolve);
        ngrok.disconnect();
    });
    console.log(colors.bold.blue("@info:"), "received SIGINT...");
    console.log(colors.bold.blue("@info:"), "server & ingress stopped...");
    process.exit(0);
}
process.on("SIGINT", handleSIGINT);
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
