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
import { z } from "zod";
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import formatTime from "../../../base/formatTime";
import calculateETA from "../../../base/calculateETA";
/**
 * VideoHighest function is designed for fetching highest video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
var qconf = z.object({
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
export default function VideoHighest(input) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, _a, query, stream, verbose, output, filter, onionTor, engineData, title, folder_1, ff_1, vdata, filename_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, qconf.parseAsync(input)];
                case 1:
                    _a = _c.sent(), query = _a.query, stream = _a.stream, verbose = _a.verbose, output = _a.output, filter = _a.filter, onionTor = _a.onionTor;
                    return [4 /*yield*/, ytdlx({ query: query, verbose: verbose, onionTor: onionTor })];
                case 2:
                    engineData = _c.sent();
                    if (!(engineData === undefined)) return [3 /*break*/, 3];
                    throw new Error(colors.red("@error: ") + "unable to get response from youtube.");
                case 3:
                    title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                    folder_1 = output ? path.join(process.cwd(), output) : process.cwd();
                    if (!fs.existsSync(folder_1))
                        fs.mkdirSync(folder_1, { recursive: true });
                    ff_1 = ffmpeg();
                    vdata = Array.isArray(engineData.ManifestHigh) &&
                        engineData.ManifestHigh.length > 0
                        ? (_b = engineData.ManifestHigh[engineData.ManifestHigh.length - 1]) === null || _b === void 0 ? void 0 : _b.url
                        : undefined;
                    if (vdata)
                        ff_1.addInput(vdata.toString());
                    else
                        throw new Error(colors.red("@error: ") + "no video data found.");
                    ff_1.outputOptions(["-c", "copy"]);
                    ff_1.withOutputFormat("matroska");
                    ff_1.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
                    filename_1 = "yt-dlx_(VideoHighest_";
                    switch (filter) {
                        case "grayscale":
                            ff_1.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
                            filename_1 += "grayscale)_".concat(title, ".mkv");
                            break;
                        case "invert":
                            ff_1.withVideoFilter("negate");
                            filename_1 += "invert)_".concat(title, ".mkv");
                            break;
                        case "rotate90":
                            ff_1.withVideoFilter("rotate=PI/2");
                            filename_1 += "rotate90)_".concat(title, ".mkv");
                            break;
                        case "rotate180":
                            ff_1.withVideoFilter("rotate=PI");
                            filename_1 += "rotate180)_".concat(title, ".mkv");
                            break;
                        case "rotate270":
                            ff_1.withVideoFilter("rotate=3*PI/2");
                            filename_1 += "rotate270)_".concat(title, ".mkv");
                            break;
                        case "flipHorizontal":
                            ff_1.withVideoFilter("hflip");
                            filename_1 += "flipHorizontal)_".concat(title, ".mkv");
                            break;
                        case "flipVertical":
                            ff_1.withVideoFilter("vflip");
                            filename_1 += "flipVertical)_".concat(title, ".mkv");
                            break;
                        default:
                            filename_1 += ")_".concat(title, ".mkv");
                            break;
                    }
                    ff_1.on("error", function (error) {
                        throw new Error(error.message);
                    });
                    ff_1.on("start", function (comd) {
                        startTime = new Date();
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
                            " ".concat(color("| @eta:"), " ").concat(formatTime(calculateETA(startTime, percent))));
                    });
                    if (!stream) return [3 /*break*/, 4];
                    return [2 /*return*/, {
                            ffmpeg: ff_1,
                            filename: output
                                ? path.join(folder_1, filename_1)
                                : filename_1.replace("_)_", ")_"),
                        }];
                case 4: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        ff_1.output(path.join(folder_1, filename_1.replace("_)_", ")_")));
                        ff_1.on("end", function () { return resolve(); });
                        ff_1.on("error", function (error) {
                            reject(new Error(colors.red("@error: ") + error.message));
                        });
                        ff_1.run();
                    })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
                    _c.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
