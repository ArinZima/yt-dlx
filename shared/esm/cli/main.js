#!/usr/bin/env node
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
import ytdlx from "../main";
import colors from "colors";
import * as path from "path";
import minimist from "minimist";
import { spawn } from "child_process";
// import { version } from "../../package.json";
var proTube = minimist(process.argv.slice(2), {
    string: ["query", "format"],
    alias: {
        h: "help",
        e: "extract",
        vl: "video-lowest",
        al: "audio-lowest",
        vh: "video_highest",
        ah: "audio-highest",
    },
});
var uLoc = "";
var maxTries = 6;
var currentDir = __dirname;
var program = function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, _a, enginePath, rox_1, enginePath, xrox_1, hdata, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                command = proTube._[0];
                _a = command;
                switch (_a) {
                    case "install:deps": return [3 /*break*/, 1];
                    case "install:socks5": return [3 /*break*/, 3];
                    case "help": return [3 /*break*/, 5];
                    case "h": return [3 /*break*/, 5];
                    case "extract": return [3 /*break*/, 6];
                    case "e": return [3 /*break*/, 6];
                    case "audio-highest": return [3 /*break*/, 10];
                    case "ah": return [3 /*break*/, 10];
                    case "audio-lowest": return [3 /*break*/, 14];
                    case "al": return [3 /*break*/, 14];
                    case "video_highest": return [3 /*break*/, 18];
                    case "vh": return [3 /*break*/, 18];
                    case "video-lowest": return [3 /*break*/, 22];
                    case "vl": return [3 /*break*/, 22];
                }
                return [3 /*break*/, 26];
            case 1:
                while (maxTries > 0) {
                    enginePath = path.join(currentDir, "util");
                    if (fs.existsSync(enginePath)) {
                        uLoc = enginePath;
                        break;
                    }
                    else {
                        currentDir = path.join(currentDir, "..");
                        maxTries--;
                    }
                }
                rox_1 = spawn("sh", [
                    "-c",
                    "chmod +x ".concat(uLoc, "/deps.sh && ").concat(uLoc, "/deps.sh"),
                ]);
                return [4 /*yield*/, Promise.all([
                        new Promise(function (resolve, reject) {
                            rox_1.stdout.on("data", function (stdout) {
                                console.log(colors.green("@stdout:"), stdout.toString().trim());
                            });
                            rox_1.on("close", function (code) {
                                if (code === 0)
                                    resolve();
                                else
                                    reject(new Error("@closed with code ".concat(code)));
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            rox_1.stderr.on("data", function (stderr) {
                                console.log(colors.yellow("@stderr:"), stderr.toString().trim());
                            });
                            rox_1.on("close", function (code) {
                                if (code === 0)
                                    resolve();
                                else
                                    reject(new Error("@closed with code ".concat(code)));
                            });
                        }),
                    ])];
            case 2:
                _b.sent();
                return [3 /*break*/, 27];
            case 3:
                while (maxTries > 0) {
                    enginePath = path.join(currentDir, "util");
                    if (fs.existsSync(enginePath)) {
                        uLoc = enginePath;
                        break;
                    }
                    else {
                        currentDir = path.join(currentDir, "..");
                        maxTries--;
                    }
                }
                xrox_1 = spawn("sh", [
                    "-c",
                    "chmod +x ".concat(uLoc, "/socks5.sh && ").concat(uLoc, "/socks5.sh"),
                ]);
                return [4 /*yield*/, Promise.all([
                        new Promise(function (resolve, reject) {
                            xrox_1.stdout.on("data", function (stdout) {
                                console.log(colors.green("@stdout:"), stdout.toString().trim());
                            });
                            xrox_1.on("close", function (code) {
                                if (code === 0)
                                    resolve();
                                else
                                    reject(new Error("@closed with code ".concat(code)));
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            xrox_1.stderr.on("data", function (stderr) {
                                console.log(colors.yellow("@stderr:"), stderr.toString().trim());
                            });
                            xrox_1.on("close", function (code) {
                                if (code === 0)
                                    resolve();
                                else
                                    reject(new Error("@closed with code ".concat(code)));
                            });
                        }),
                    ])];
            case 4:
                _b.sent();
                return [3 /*break*/, 27];
            case 5:
                hdata = ytdlx.info.help();
                console.log(hdata);
                process.exit();
                return [3 /*break*/, 27];
            case 6:
                if (!(!proTube || !proTube.query || proTube.query.length === 0)) return [3 /*break*/, 7];
                console.error(colors.red("error: no query"));
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, ytdlx.info
                    .extract({
                    query: proTube.query,
                })
                    .then(function (data) {
                    console.log(data);
                    process.exit();
                })
                    .catch(function (error) {
                    console.error(colors.red(error));
                    process.exit();
                })];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9: return [3 /*break*/, 27];
            case 10:
                if (!(!proTube || !proTube.query || proTube.query.length === 0)) return [3 /*break*/, 11];
                console.error(colors.red("error: no query"));
                return [3 /*break*/, 13];
            case 11: return [4 /*yield*/, ytdlx.AudioOnly.Single.Highest({
                    query: proTube.query,
                })
                    .then(function (data) {
                    console.log(data);
                    process.exit();
                })
                    .catch(function (error) {
                    console.error(colors.red(error));
                    process.exit();
                })];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13: return [3 /*break*/, 27];
            case 14:
                if (!(!proTube || !proTube.query || proTube.query.length === 0)) return [3 /*break*/, 15];
                console.error(colors.red("error: no query"));
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, ytdlx.AudioOnly.Single.Lowest({
                    query: proTube.query,
                })
                    .then(function (data) {
                    console.log(data);
                    process.exit();
                })
                    .catch(function (error) {
                    console.error(colors.red(error));
                    process.exit();
                })];
            case 16:
                _b.sent();
                _b.label = 17;
            case 17: return [3 /*break*/, 27];
            case 18:
                if (!(!proTube || !proTube.query || proTube.query.length === 0)) return [3 /*break*/, 19];
                console.error(colors.red("error: no query"));
                return [3 /*break*/, 21];
            case 19: return [4 /*yield*/, ytdlx.VideoOnly.Single.Highest({
                    query: proTube.query,
                })
                    .then(function (data) {
                    console.log(data);
                    process.exit();
                })
                    .catch(function (error) {
                    console.error(colors.red(error));
                    process.exit();
                })];
            case 20:
                _b.sent();
                _b.label = 21;
            case 21: return [3 /*break*/, 27];
            case 22:
                if (!(!proTube || !proTube.query || proTube.query.length === 0)) return [3 /*break*/, 23];
                console.error(colors.red("error: no query"));
                return [3 /*break*/, 25];
            case 23: return [4 /*yield*/, ytdlx.VideoOnly.Single.Lowest({
                    query: proTube.query,
                })
                    .then(function (data) {
                    console.log(data);
                    process.exit();
                })
                    .catch(function (error) {
                    console.error(colors.red(error));
                    process.exit();
                })];
            case 24:
                _b.sent();
                _b.label = 25;
            case 25: return [3 /*break*/, 27];
            case 26:
                data = ytdlx.info.help();
                console.log(data);
                process.exit();
                return [3 /*break*/, 27];
            case 27: return [2 /*return*/];
        }
    });
}); };
if (!proTube._[0]) {
    var data = ytdlx.info.help();
    console.log(data);
    process.exit();
}
else
    program();
