var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import retry from "async-retry";
import { promisify } from "util";
import { exec } from "child_process";
export var sizeFormat = function (filesize) {
    if (isNaN(filesize) || filesize < 0)
        return filesize;
    var bytesPerMegabyte = 1024 * 1024;
    var bytesPerGigabyte = bytesPerMegabyte * 1024;
    var bytesPerTerabyte = bytesPerGigabyte * 1024;
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
export default function Engine(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function propfilter(formats) {
            return formats.filter(function (i) {
                return !i.format_note.includes("DRC") && !i.format_note.includes("HDR");
            });
        }
        var AudioLow, AudioHigh, VideoLow, VideoHigh, ManifestLow, ManifestHigh, AudioLowDRC, AudioHighDRC, VideoLowHDR, VideoHighHDR, AudioLowF, AudioHighF, VideoLowF, VideoHighF, dirC, pLoc, maxT, enginePath, config, metaCore, i, payLoad;
        var _this = this;
        var query = _b.query, ipAddress = _b.ipAddress, onionTor = _b.onionTor;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    AudioLow = {};
                    AudioHigh = {};
                    VideoLow = {};
                    VideoHigh = {};
                    ManifestLow = {};
                    ManifestHigh = {};
                    AudioLowDRC = {};
                    AudioHighDRC = {};
                    VideoLowHDR = {};
                    VideoHighHDR = {};
                    AudioLowF = null;
                    AudioHighF = null;
                    VideoLowF = null;
                    VideoHighF = null;
                    dirC = __dirname || process.cwd();
                    pLoc = "";
                    maxT = 8;
                    while (maxT > 0) {
                        enginePath = path.join(dirC, "util", "engine");
                        if (fs.existsSync(enginePath)) {
                            pLoc = enginePath;
                            break;
                        }
                        else {
                            dirC = path.join(dirC, "..");
                            maxT--;
                        }
                    }
                    if (pLoc === "") {
                        throw new Error(colors.red("@error: ") +
                            "Could not find engine file. maybe re-install yt-dlx?");
                    }
                    config = {
                        factor: 2,
                        retries: 3,
                        minTimeout: 1000,
                        maxTimeout: 3000,
                    };
                    return [4 /*yield*/, retry(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (onionTor)
                                            pLoc += " --proxy \"socks5://127.0.0.1:9050\"";
                                        pLoc += " --dump-single-json \"".concat(query, "\"");
                                        pLoc += " --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass";
                                        pLoc += " --user-agent \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36\"";
                                        return [4 /*yield*/, promisify(exec)(pLoc)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }, config)];
                case 1:
                    metaCore = _c.sent();
                    i = JSON.parse(metaCore.stdout.toString());
                    i.formats.forEach(function (tube) {
                        var rm = new Set(["storyboard", "Default"]);
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
                        var prevLowVideo = VideoLow[tube.format_note];
                        var prevHighVideo = VideoHigh[tube.format_note];
                        var prevLowAudio = AudioLow[tube.format_note];
                        var prevHighAudio = AudioHigh[tube.format_note];
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
                    Object.values(AudioLow).forEach(function (audio) {
                        if (audio.filesize !== null) {
                            switch (true) {
                                case !AudioLowF || audio.filesize < AudioLowF.filesize:
                                    AudioLowF = audio;
                                    break;
                                case !AudioHighF || audio.filesize > AudioHighF.filesize:
                                    AudioHighF = audio;
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    Object.values(VideoLow).forEach(function (video) {
                        if (video.filesize !== null) {
                            switch (true) {
                                case !VideoLowF || video.filesize < VideoLowF.filesize:
                                    VideoLowF = video;
                                    break;
                                case !VideoHighF || video.filesize > VideoHighF.filesize:
                                    VideoHighF = video;
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                    payLoad = {
                        ipAddress: ipAddress,
                        AudioLowF: (function () {
                            var i = AudioLowF || {};
                            return nAudio(i);
                        })(),
                        AudioHighF: (function () {
                            var i = AudioHighF || {};
                            return nAudio(i);
                        })(),
                        VideoLowF: (function () {
                            var i = VideoLowF || {};
                            return nVideo(i);
                        })(),
                        VideoHighF: (function () {
                            var i = VideoHighF || {};
                            return nVideo(i);
                        })(),
                        AudioLowDRC: Object.values(AudioLowDRC).map(function (i) { return pAudio(i); }),
                        AudioHighDRC: Object.values(AudioHighDRC).map(function (i) { return pAudio(i); }),
                        AudioLow: propfilter(Object.values(AudioLow)).map(function (i) { return pAudio(i); }),
                        AudioHigh: propfilter(Object.values(AudioHigh)).map(function (i) { return pAudio(i); }),
                        VideoLowHDR: Object.values(VideoLowHDR).map(function (i) { return pVideo(i); }),
                        VideoHighHDR: Object.values(VideoHighHDR).map(function (i) { return pVideo(i); }),
                        VideoLow: propfilter(Object.values(VideoLow)).map(function (i) { return pVideo(i); }),
                        VideoHigh: propfilter(Object.values(VideoHigh)).map(function (i) { return pVideo(i); }),
                        ManifestLow: Object.values(ManifestLow).map(function (i) { return pManifest(i); }),
                        ManifestHigh: Object.values(ManifestHigh).map(function (i) { return pManifest(i); }),
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
                    return [2 /*return*/, payLoad];
            }
        });
    });
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
