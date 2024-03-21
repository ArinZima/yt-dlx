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
const zod_1 = require("zod");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const Agent_1 = __importDefault(require("../../../base/Agent"));
const formatTime_1 = __importDefault(require("../../../base/formatTime"));
const calculateETA_1 = __importDefault(require("../../../base/calculateETA"));
const ZodSchema = zod_1.z.object({
    query: zod_1.z.string().min(2),
    output: zod_1.z.string().optional(),
    stream: zod_1.z.boolean().optional(),
    verbose: zod_1.z.boolean().optional(),
    onionTor: zod_1.z.boolean().optional(),
    resolution: zod_1.z.enum([
        "144p",
        "240p",
        "360p",
        "480p",
        "720p",
        "1080p",
        "1440p",
        "2160p",
        "3072p",
        "4320p",
        "6480p",
        "8640p",
        "12000p",
    ]),
    filter: zod_1.z
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
function VideoCustom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, resolution, stream, verbose, output, filter, onionTor, }) {
        try {
            ZodSchema.parse({
                query,
                resolution,
                stream,
                verbose,
                output,
                filter,
                onionTor,
            });
            let startTime;
            const engineData = yield (0, Agent_1.default)({ query, verbose, onionTor });
            if (engineData === undefined) {
                throw new Error(colors_1.default.red("@error: ") + "Unable to get response!");
            }
            else {
                const title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                const folder = output ? path.join(process.cwd(), output) : process.cwd();
                if (!fs.existsSync(folder))
                    fs.mkdirSync(folder, { recursive: true });
                let filename = `yt-dlx_(VideoCustom_${resolution}_`;
                const ff = (0, fluent_ffmpeg_1.default)();
                const vdata = engineData.ManifestHigh.find((i) => i.format.includes(resolution.replace("p", "").toString()));
                ff.addInput(engineData.AudioHighF.url);
                if (vdata)
                    ff.addInput(vdata.url.toString());
                else
                    throw new Error(colors_1.default.red("@error: ") +
                        "no video data found. use list_formats() maybe?");
                ff.outputOptions("-c copy");
                ff.withOutputFormat("matroska");
                ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
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
                if (stream) {
                    return {
                        ffmpeg: ff,
                        filename: output
                            ? path.join(folder, filename)
                            : filename.replace("_)_", ")_"),
                    };
                }
                else {
                    yield new Promise((resolve, reject) => {
                        ff.output(path.join(folder, filename.replace("_)_", ")_")));
                        ff.on("end", () => resolve());
                        ff.on("error", (error) => {
                            reject(new Error(colors_1.default.red("@error: ") + error.message));
                        });
                        ff.run();
                    });
                }
            }
        }
        catch (error) {
            switch (true) {
                case error instanceof zod_1.ZodError:
                    console.error(colors_1.default.red("@zod-error:"), error.errors);
                    break;
                default:
                    console.error(colors_1.default.red("@error:"), error.message);
                    break;
            }
        }
        finally {
            console.log(colors_1.default.green("@info:"), "❣️ Thank you for using", colors_1.default.green("yt-dlx."), "Consider", colors_1.default.green("🌟starring"), "the GitHub repo", colors_1.default.green("https://github.com/yt-dlx\n"));
        }
    });
}
exports.default = VideoCustom;
