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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import web from "../../../web";
import { z, ZodError } from "zod";
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import YouTubeID from "../../../web/YouTubeId";
import formatTime from "../../../base/formatTime";
import calculateETA from "../../../base/calculateETA";
var ZodSchema = z.object({
    output: z.string().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    query: z.array(z.string().min(2)),
    resolution: z.enum([
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
export default function ListAudioVideoCustom(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var startTime_1, vDATA, query_1, query_1_1, pURL, playlistId, pDATA, _c, _d, video, error_1, e_1_1, _loop_1, vDATA_1, vDATA_1_1, video, e_2_1, error_2;
        var e_1, _e, e_3, _f, e_2, _g;
        var query = _b.query, resolution = _b.resolution, verbose = _b.verbose, output = _b.output, filter = _b.filter, onionTor = _b.onionTor;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 22, 23, 24]);
                    ZodSchema.parse({
                        query: query,
                        resolution: resolution,
                        verbose: verbose,
                        output: output,
                        filter: filter,
                        onionTor: onionTor,
                    });
                    vDATA = new Set();
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 11, 12, 13]);
                    query_1 = __values(query), query_1_1 = query_1.next();
                    _h.label = 2;
                case 2:
                    if (!!query_1_1.done) return [3 /*break*/, 10];
                    pURL = query_1_1.value;
                    _h.label = 3;
                case 3:
                    _h.trys.push([3, 8, , 9]);
                    return [4 /*yield*/, YouTubeID(pURL)];
                case 4:
                    playlistId = _h.sent();
                    if (!!playlistId) return [3 /*break*/, 5];
                    console.log(colors.red("@error: "), "@error: invalid playlist", pURL);
                    return [3 /*break*/, 9];
                case 5: return [4 /*yield*/, web.browserLess.playlistVideos({
                        playlistId: playlistId,
                    })];
                case 6:
                    pDATA = _h.sent();
                    if (pDATA === undefined) {
                        console.log(colors.red("@error:"), "unable to get response for", pURL);
                        return [3 /*break*/, 9];
                    }
                    try {
                        for (_c = (e_3 = void 0, __values(pDATA.playlistVideos)), _d = _c.next(); !_d.done; _d = _c.next()) {
                            video = _d.value;
                            vDATA.add(video);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    _h.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _h.sent();
                    console.log(colors.red("@error:"), error_1.message);
                    return [3 /*break*/, 9];
                case 9:
                    query_1_1 = query_1.next();
                    return [3 /*break*/, 2];
                case 10: return [3 /*break*/, 13];
                case 11:
                    e_1_1 = _h.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 12:
                    try {
                        if (query_1_1 && !query_1_1.done && (_e = query_1.return)) _e.call(query_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 13:
                    console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
                    _loop_1 = function (video) {
                        var engineData, title, folder_1, filename_1, ff_1, vdata, error_3;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    _j.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, ytdlx({
                                            query: video.videoLink,
                                            onionTor: onionTor,
                                            verbose: verbose,
                                        })];
                                case 1:
                                    engineData = _j.sent();
                                    if (engineData === undefined) {
                                        console.log(colors.red("@error:"), "unable to get response!");
                                        return [2 /*return*/, "continue"];
                                    }
                                    title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                                    folder_1 = output ? path.join(__dirname, output) : __dirname;
                                    if (!fs.existsSync(folder_1))
                                        fs.mkdirSync(folder_1, { recursive: true });
                                    filename_1 = "yt-dlx_(AudioVideoCustom_".concat(resolution, "_");
                                    ff_1 = ffmpeg();
                                    vdata = engineData.ManifestHigh.find(function (i) {
                                        return i.format.includes(resolution.replace("p", "").toString());
                                    });
                                    ff_1.addInput(engineData.AudioHighF.url);
                                    if (vdata)
                                        ff_1.addInput(vdata.url.toString());
                                    else
                                        throw new Error(colors.red("@error: ") +
                                            "no video data found. use list_formats() maybe?");
                                    ff_1.outputOptions("-c copy");
                                    ff_1.withOutputFormat("matroska");
                                    ff_1.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
                                    ff_1.withOutputFormat("matroska");
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
                                    return [4 /*yield*/, new Promise(function (resolve, _reject) {
                                            ff_1.output(path.join(folder_1, filename_1.replace("_)_", ")_")));
                                            ff_1.on("end", function () { return resolve(); });
                                            ff_1.on("error", function (error) {
                                                throw new Error(colors.red("@error: ") + error.message);
                                            });
                                            ff_1.run();
                                        })];
                                case 2:
                                    _j.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_3 = _j.sent();
                                    console.log(colors.red("@error:"), error_3);
                                    return [2 /*return*/, "continue"];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _h.label = 14;
                case 14:
                    _h.trys.push([14, 19, 20, 21]);
                    vDATA_1 = __values(vDATA), vDATA_1_1 = vDATA_1.next();
                    _h.label = 15;
                case 15:
                    if (!!vDATA_1_1.done) return [3 /*break*/, 18];
                    video = vDATA_1_1.value;
                    return [5 /*yield**/, _loop_1(video)];
                case 16:
                    _h.sent();
                    _h.label = 17;
                case 17:
                    vDATA_1_1 = vDATA_1.next();
                    return [3 /*break*/, 15];
                case 18: return [3 /*break*/, 21];
                case 19:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 21];
                case 20:
                    try {
                        if (vDATA_1_1 && !vDATA_1_1.done && (_g = vDATA_1.return)) _g.call(vDATA_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 21: return [3 /*break*/, 24];
                case 22:
                    error_2 = _h.sent();
                    switch (true) {
                        case error_2 instanceof ZodError:
                            console.error(colors.red("@zod-error:"), error_2.errors);
                            break;
                        default:
                            console.error(colors.red("@error:"), error_2.message);
                            break;
                    }
                    return [3 /*break*/, 24];
                case 23:
                    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the GitHub repo", colors.green("https://github.com/yt-dlx\n"));
                    return [7 /*endfinally*/];
                case 24: return [2 /*return*/];
            }
        });
    });
}
