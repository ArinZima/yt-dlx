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
import { z } from "zod";
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import web from "../../../web";
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import YouTubeID from "../../../web/YouTubeId";
import formatTime from "../../../base/formatTime";
import calculateETA from "../../../base/calculateETA";
var qconf = z.object({
    output: z.string().optional(),
    verbose: z.boolean().optional(),
    onionTor: z.boolean().optional(),
    query: z
        .array(z
        .string()
        .min(1)
        .refine(function (input) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, resultLink, resultId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = true;
                    switch (_a) {
                        case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input): return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, YouTubeID(input)];
                case 2:
                    resultLink = _b.sent();
                    if (resultLink !== undefined)
                        return [2 /*return*/, true];
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, YouTubeID("https://www.youtube.com/playlist?list=".concat(input))];
                case 4:
                    resultId = _b.sent();
                    if (resultId !== undefined)
                        return [2 /*return*/, true];
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, false];
            }
        });
    }); }, {
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
export default function ListAudioHighest(input) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, _a, query, output, verbose, filter, onionTor, vDATA, query_1, query_1_1, pURL, pDATA, _b, _c, _d, _e, video, error_1, e_1_1, _loop_1, vDATA_1, vDATA_1_1, video, e_2_1;
        var e_1, _f, _g, e_3, _h, e_2, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, qconf.parseAsync(input)];
                case 1:
                    _a = _k.sent(), query = _a.query, output = _a.output, verbose = _a.verbose, filter = _a.filter, onionTor = _a.onionTor;
                    vDATA = new Set();
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 10, 11, 12]);
                    query_1 = __values(query), query_1_1 = query_1.next();
                    _k.label = 3;
                case 3:
                    if (!!query_1_1.done) return [3 /*break*/, 9];
                    pURL = query_1_1.value;
                    _k.label = 4;
                case 4:
                    _k.trys.push([4, 7, , 8]);
                    _c = (_b = web.browserLess).playlistVideos;
                    _g = {};
                    return [4 /*yield*/, YouTubeID(pURL)];
                case 5: return [4 /*yield*/, _c.apply(_b, [(_g.playlistId = (_k.sent()),
                            _g)])];
                case 6:
                    pDATA = _k.sent();
                    if (pDATA === undefined) {
                        console.log(colors.red("@error:"), "Unable to get response for", pURL);
                        return [3 /*break*/, 8];
                    }
                    try {
                        for (_d = (e_3 = void 0, __values(pDATA.playlistVideos)), _e = _d.next(); !_e.done; _e = _d.next()) {
                            video = _e.value;
                            vDATA.add(video);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_h = _d.return)) _h.call(_d);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _k.sent();
                    console.log(colors.red("@error:"), error_1);
                    return [3 /*break*/, 8];
                case 8:
                    query_1_1 = query_1.next();
                    return [3 /*break*/, 3];
                case 9: return [3 /*break*/, 12];
                case 10:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 11:
                    try {
                        if (query_1_1 && !query_1_1.done && (_f = query_1.return)) _f.call(query_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 12:
                    console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
                    _loop_1 = function (video) {
                        var engineData, title, folder_1, filename_1, ff_1, error_2;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    _l.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, ytdlx({
                                            query: video.videoLink,
                                            onionTor: onionTor,
                                            verbose: verbose,
                                        })];
                                case 1:
                                    engineData = _l.sent();
                                    if (engineData === undefined) {
                                        console.log(colors.red("@error:"), "Unable to get response for", video.videoLink);
                                        return [2 /*return*/, "continue"];
                                    }
                                    title = engineData.metaData.title.replace(/[^a-zA-Z0-9_]+/g, "_");
                                    folder_1 = output ? path.join(process.cwd(), output) : process.cwd();
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
                                    return [4 /*yield*/, new Promise(function (resolve, _reject) {
                                            ff_1.output(path.join(folder_1, filename_1.replace("_)_", ")_")));
                                            ff_1.on("end", function () { return resolve(); });
                                            ff_1.on("error", function (error) {
                                                throw new Error(colors.red("@error: ") + error.message);
                                            });
                                            ff_1.run();
                                        })];
                                case 2:
                                    _l.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _l.sent();
                                    console.log(colors.red("@error:"), error_2);
                                    return [2 /*return*/, "continue"];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _k.label = 13;
                case 13:
                    _k.trys.push([13, 18, 19, 20]);
                    vDATA_1 = __values(vDATA), vDATA_1_1 = vDATA_1.next();
                    _k.label = 14;
                case 14:
                    if (!!vDATA_1_1.done) return [3 /*break*/, 17];
                    video = vDATA_1_1.value;
                    return [5 /*yield**/, _loop_1(video)];
                case 15:
                    _k.sent();
                    _k.label = 16;
                case 16:
                    vDATA_1_1 = vDATA_1.next();
                    return [3 /*break*/, 14];
                case 17: return [3 /*break*/, 20];
                case 18:
                    e_2_1 = _k.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 20];
                case 19:
                    try {
                        if (vDATA_1_1 && !vDATA_1_1.done && (_j = vDATA_1.return)) _j.call(vDATA_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 20:
                    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
                    return [2 /*return*/];
            }
        });
    });
}
