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
import { z, ZodError } from "zod";
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import formatTime from "../../../base/formatTime";
import calculateETA from "../../../base/calculateETA";
var ZodSchema = z.object({
    query: z.string().min(2),
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
/**
 * Downloads and processes the highest quality audio from a single YouTube video.
 *
 * @param query - The YouTube video URL or ID.
 * @param output - (optional) The output directory for the processed file.
 * @param stream - (optional) Whether to stream the processed video or not.
 * @param verbose - (optional) Whether to log verbose output or not.
 * @param filter - (optional) The audio filter to apply. Available options: "echo", "slow", "speed", "phaser", "flanger", "panning", "reverse", "vibrato", "subboost", "surround", "bassboost", "nightcore", "superslow", "vaporwave", "superspeed".
 * @param onionTor - (optional) Whether to use Tor for the download or not.
 * @returns A Promise that resolves with either `void` (if `stream` is false) or an object containing the `ffmpeg` instance and the output filename (if `stream` is true).
 */
export default function AudioHighest(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var startTime_1, engineData, title, folder_1, filename_1, ff_1, error_1;
        var query = _b.query, output = _b.output, stream = _b.stream, verbose = _b.verbose, filter = _b.filter, onionTor = _b.onionTor;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, 7, 8]);
                    ZodSchema.parse({ query: query, output: output, stream: stream, verbose: verbose, filter: filter, onionTor: onionTor });
                    return [4 /*yield*/, ytdlx({ query: query, verbose: verbose, onionTor: onionTor })];
                case 1:
                    engineData = _c.sent();
                    if (!(engineData === undefined)) return [3 /*break*/, 2];
                    throw new Error("".concat(colors.red("@error:"), " unable to get response!"));
                case 2:
                    title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                    folder_1 = output ? path.join(__dirname, output) : __dirname;
                    if (!fs.existsSync(folder_1))
                        fs.mkdirSync(folder_1, { recursive: true });
                    filename_1 = "yt-dlx_(AudioHighest_";
                    ff_1 = ffmpeg();
                    ff_1.addInput(engineData.AudioHighF.url);
                    ff_1.addInput(engineData.metaData.thumbnail);
                    ff_1.outputOptions("-c copy");
                    ff_1.withOutputFormat("avi");
                    ff_1.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
                    switch (filter) {
                        case "bassboost":
                            ff_1.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                            filename_1 += "bassboost)_".concat(title, ".avi");
                            break;
                        case "echo":
                            ff_1.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                            filename_1 += "echo)_".concat(title, ".avi");
                            break;
                        case "flanger":
                            ff_1.withAudioFilter(["flanger"]);
                            filename_1 += "flanger)_".concat(title, ".avi");
                            break;
                        case "nightcore":
                            ff_1.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                            filename_1 += "nightcore)_".concat(title, ".avi");
                            break;
                        case "panning":
                            ff_1.withAudioFilter(["apulsator=hz=0.08"]);
                            filename_1 += "panning)_".concat(title, ".avi");
                            break;
                        case "phaser":
                            ff_1.withAudioFilter(["aphaser=in_gain=0.4"]);
                            filename_1 += "phaser)_".concat(title, ".avi");
                            break;
                        case "reverse":
                            ff_1.withAudioFilter(["areverse"]);
                            filename_1 += "reverse)_".concat(title, ".avi");
                            break;
                        case "slow":
                            ff_1.withAudioFilter(["atempo=0.8"]);
                            filename_1 += "slow)_".concat(title, ".avi");
                            break;
                        case "speed":
                            ff_1.withAudioFilter(["atempo=2"]);
                            filename_1 += "speed)_".concat(title, ".avi");
                            break;
                        case "subboost":
                            ff_1.withAudioFilter(["asubboost"]);
                            filename_1 += "subboost)_".concat(title, ".avi");
                            break;
                        case "superslow":
                            ff_1.withAudioFilter(["atempo=0.5"]);
                            filename_1 += "superslow)_".concat(title, ".avi");
                            break;
                        case "superspeed":
                            ff_1.withAudioFilter(["atempo=3"]);
                            filename_1 += "superspeed)_".concat(title, ".avi");
                            break;
                        case "surround":
                            ff_1.withAudioFilter(["surround"]);
                            filename_1 += "surround)_".concat(title, ".avi");
                            break;
                        case "vaporwave":
                            ff_1.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                            filename_1 += "vaporwave)_".concat(title, ".avi");
                            break;
                        case "vibrato":
                            ff_1.withAudioFilter(["vibrato=f=6.5"]);
                            filename_1 += "vibrato)_".concat(title, ".avi");
                            break;
                        default:
                            filename_1 += ")_".concat(title, ".avi");
                            break;
                    }
                    ff_1.on("error", function (error) {
                        throw new Error(error.message);
                    });
                    ff_1.on("start", function (comd) {
                        startTime_1 = new Date();
                        if (verbose)
                            console.info(colors.green("@comd:"), comd);
                    });
                    ff_1.on("end", function () { return process.stdout.write("\n"); });
                    ff_1.on("progress", function (_a) {
                        var percent = _a.percent, timemark = _a.timemark;
                        var color = colors.green;
                        if (isNaN(percent))
                            percent = 0;
                        if (percent > 98)
                            percent = 100;
                        if (percent < 25)
                            color = colors.red;
                        else if (percent < 50)
                            color = colors.yellow;
                        var width = Math.floor(process.stdout.columns / 4);
                        var scomp = Math.round((width * percent) / 100);
                        var progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
                        process.stdout.write("\r".concat(color("@prog:"), " ").concat(progb) +
                            " ".concat(color("| @percent:"), " ").concat(percent.toFixed(2), "%") +
                            " ".concat(color("| @timemark:"), " ").concat(timemark) +
                            " ".concat(color("| @eta:"), " ").concat(formatTime(calculateETA(startTime_1, percent))));
                    });
                    if (!stream) return [3 /*break*/, 3];
                    return [2 /*return*/, {
                            ffmpeg: ff_1,
                            filename: output
                                ? path.join(folder_1, filename_1)
                                : filename_1.replace("_)_", ")_"),
                        }];
                case 3: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        ff_1.output(path.join(folder_1, filename_1.replace("_)_", ")_")));
                        ff_1.on("end", function () { return resolve(); });
                        ff_1.on("error", function (error) {
                            reject(new Error(colors.red("@error: ") + error.message));
                        });
                        ff_1.run();
                    })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _c.sent();
                    switch (true) {
                        case error_1 instanceof ZodError:
                            console.error(colors.red("@zod-error:"), error_1.errors);
                            break;
                        default:
                            console.error(colors.red("@error:"), error_1.message);
                            break;
                    }
                    return [3 /*break*/, 8];
                case 7:
                    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the GitHub repo", colors.green("https://github.com/yt-dlx\n"));
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
