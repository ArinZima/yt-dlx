"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const colors_1 = __importDefault(require("colors"));
const path = __importStar(require("path"));
const web_1 = __importDefault(require("../../../web"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const Agent_1 = __importDefault(require("../../../base/Agent"));
const YouTubeId_1 = __importDefault(require("../../../web/YouTubeId"));
const formatTime_1 = __importDefault(require("../../../base/formatTime"));
const calculateETA_1 = __importDefault(require("../../../base/calculateETA"));
function ListAudioVideoLowest(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, verbose, output, filter, onionTor, }) {
        var _b;
        let startTime;
        const vDATA = new Set();
        for (const pURL of query) {
            try {
                const pDATA = yield web_1.default.browserLess.playlistVideos({
                    playlistId: (yield (0, YouTubeId_1.default)(pURL)),
                });
                if (pDATA === undefined) {
                    console.log(colors_1.default.red("@error:"), "Unable to get response for", pURL);
                    continue;
                }
                for (const video of pDATA.playlistVideos)
                    vDATA.add(video);
            }
            catch (error) {
                console.log(colors_1.default.red("@error:"), error);
                continue;
            }
        }
        console.log(colors_1.default.green("@info:"), "total number of uncommon videos:", colors_1.default.yellow(vDATA.size.toString()));
        for (const video of vDATA) {
            try {
                const engineData = yield (0, Agent_1.default)({
                    query: video.videoLink,
                    onionTor,
                    verbose,
                });
                if (engineData === undefined) {
                    console.log(colors_1.default.red("@error:"), "Unable to get response!");
                    continue;
                }
                const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output ? path.join(process.cwd(), output) : process.cwd();
                if (!fs.existsSync(folder))
                    fs.mkdirSync(folder, { recursive: true });
                let filename = "yt-dlx_(AudioVideoLowest_";
                const ff = (0, fluent_ffmpeg_1.default)();
                const vdata = Array.isArray(engineData.ManifestLow) &&
                    engineData.ManifestLow.length > 0
                    ? (_b = engineData.ManifestLow[0]) === null || _b === void 0 ? void 0 : _b.url
                    : undefined;
                ff.addInput(engineData.AudioLowF.url);
                if (vdata)
                    ff.addInput(vdata.toString());
                else
                    throw new Error(colors_1.default.red("@error: ") + "no video data found.");
                ff.outputOptions("-c copy");
                ff.withOutputFormat("matroska");
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
                        console.info(colors_1.default.green("@comd:"), comd);
                });
                ff.on("end", () => process.stdout.write("\n"));
                ff.on("progress", ({ percent, timemark }) => {
                    let color = colors_1.default.green;
                    if (isNaN(percent))
                        percent = 0;
                    if (percent > 98)
                        percent = 100;
                    if (percent < 25)
                        color = colors_1.default.red;
                    else if (percent < 50)
                        color = colors_1.default.yellow;
                    const width = Math.floor(process.stdout.columns / 4);
                    const scomp = Math.round((width * percent) / 100);
                    const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
                    process.stdout.write(`\r${color("@prog:")} ${progb}` +
                        ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
                        ` ${color("| @timemark:")} ${timemark}` +
                        ` ${color("| @eta:")} ${(0, formatTime_1.default)((0, calculateETA_1.default)(startTime, percent))}`);
                });
                yield new Promise((resolve, _reject) => {
                    ff.output(path.join(folder, filename.replace("_)_", ")_")));
                    ff.on("end", () => resolve());
                    ff.on("error", (error) => {
                        throw new Error(colors_1.default.red("@error: ") + error.message);
                    });
                    ff.run();
                });
            }
            catch (error) {
                console.log(colors_1.default.red("@error:"), error);
                continue;
            }
        }
        console.log(colors_1.default.green("@info:"), "❣️ Thank you for using", colors_1.default.green("yt-dlx."), "Consider", colors_1.default.green("🌟starring"), "the github repo", colors_1.default.green("https://github.com/yt-dlx\n"));
    });
}
exports.default = ListAudioVideoLowest;
