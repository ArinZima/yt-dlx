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
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import YouTubeID from "../../../web/YouTubeId";
import formatTime from "../../../base/formatTime";
import calculateETA from "../../../base/calculateETA";
export default function ListAudioHighest(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var startTime, vDATA, query_1, query_1_1, pURL, pDATA, _c, _d, _e, _f, video, error_1, e_1_1, _loop_1, vDATA_1, vDATA_1_1, video, e_2_1;
        var e_1, _g, _h, e_3, _j, e_2, _k;
        var query = _b.query, output = _b.output, verbose = _b.verbose, filter = _b.filter, onionTor = _b.onionTor;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    vDATA = new Set();
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 9, 10, 11]);
                    query_1 = __values(query), query_1_1 = query_1.next();
                    _l.label = 2;
                case 2:
                    if (!!query_1_1.done) return [3 /*break*/, 8];
                    pURL = query_1_1.value;
                    _l.label = 3;
                case 3:
                    _l.trys.push([3, 6, , 7]);
                    _d = (_c = web.browserLess).playlistVideos;
                    _h = {};
                    return [4 /*yield*/, YouTubeID(pURL)];
                case 4: return [4 /*yield*/, _d.apply(_c, [(_h.playlistId = (_l.sent()),
                            _h)])];
                case 5:
                    pDATA = _l.sent();
                    if (pDATA === undefined) {
                        console.log(colors.red("@error:"), "Unable to get response for", pURL);
                        return [3 /*break*/, 7];
                    }
                    try {
                        for (_e = (e_3 = void 0, __values(pDATA.playlistVideos)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            video = _f.value;
                            vDATA.add(video);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_j = _e.return)) _j.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _l.sent();
                    console.log(colors.red("@error:"), error_1);
                    return [3 /*break*/, 7];
                case 7:
                    query_1_1 = query_1.next();
                    return [3 /*break*/, 2];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_1_1 = _l.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (query_1_1 && !query_1_1.done && (_g = query_1.return)) _g.call(query_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 11:
                    console.log(colors.green("@info:"), "total number of uncommon videos:", colors.yellow(vDATA.size.toString()));
                    _loop_1 = function (video) {
                        var engineData, title, folder_1, filename_1, ff_1, error_2;
                        return __generator(this, function (_m) {
                            switch (_m.label) {
                                case 0:
                                    _m.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, ytdlx({
                                            query: video.videoLink,
                                            onionTor: onionTor,
                                            verbose: verbose,
                                        })];
                                case 1:
                                    engineData = _m.sent();
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
                                    _m.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _m.sent();
                                    console.log(colors.red("@error:"), error_2);
                                    return [2 /*return*/, "continue"];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _l.label = 12;
                case 12:
                    _l.trys.push([12, 17, 18, 19]);
                    vDATA_1 = __values(vDATA), vDATA_1_1 = vDATA_1.next();
                    _l.label = 13;
                case 13:
                    if (!!vDATA_1_1.done) return [3 /*break*/, 16];
                    video = vDATA_1_1.value;
                    return [5 /*yield**/, _loop_1(video)];
                case 14:
                    _l.sent();
                    _l.label = 15;
                case 15:
                    vDATA_1_1 = vDATA_1.next();
                    return [3 /*break*/, 13];
                case 16: return [3 /*break*/, 19];
                case 17:
                    e_2_1 = _l.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 19];
                case 18:
                    try {
                        if (vDATA_1_1 && !vDATA_1_1.done && (_k = vDATA_1.return)) _k.call(vDATA_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 19:
                    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
                    return [2 /*return*/];
            }
        });
    });
}
