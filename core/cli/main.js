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
import * as fs from "fs";
import { ytdlx } from "..";
import colors from "colors";
import * as path from "path";
import minimist from "minimist";
import { spawn } from "child_process";
const proTube = minimist(process.argv.slice(2), {
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
let uLoc = "";
let maxTries = 6;
let currentDir = __dirname;
const program = () => __awaiter(void 0, void 0, void 0, function* () {
    const command = proTube._[0];
    switch (command) {
        case "install:deps":
            while (maxTries > 0) {
                const enginePath = path.join(currentDir, "util");
                if (fs.existsSync(enginePath)) {
                    uLoc = enginePath;
                    break;
                }
                else {
                    currentDir = path.join(currentDir, "..");
                    maxTries--;
                }
            }
            const rox = spawn("sh", [
                "-c",
                `chmod +x ${uLoc}/deps.sh && ${uLoc}/deps.sh`,
            ]);
            yield Promise.all([
                new Promise((resolve, reject) => {
                    rox.stdout.on("data", (stdout) => {
                        console.log(colors.green("@stdout:"), stdout.toString().trim());
                    });
                    rox.on("close", (code) => {
                        if (code === 0)
                            resolve();
                        else
                            reject(new Error(`@closed with code ${code}`));
                    });
                }),
                new Promise((resolve, reject) => {
                    rox.stderr.on("data", (stderr) => {
                        console.log(colors.yellow("@stderr:"), stderr.toString().trim());
                    });
                    rox.on("close", (code) => {
                        if (code === 0)
                            resolve();
                        else
                            reject(new Error(`@closed with code ${code}`));
                    });
                }),
            ]);
            break;
        case "install:socks5":
            while (maxTries > 0) {
                const enginePath = path.join(currentDir, "util");
                if (fs.existsSync(enginePath)) {
                    uLoc = enginePath;
                    break;
                }
                else {
                    currentDir = path.join(currentDir, "..");
                    maxTries--;
                }
            }
            const xrox = spawn("sh", [
                "-c",
                `chmod +x ${uLoc}/socks5.sh && ${uLoc}/socks5.sh`,
            ]);
            yield Promise.all([
                new Promise((resolve, reject) => {
                    xrox.stdout.on("data", (stdout) => {
                        console.log(colors.green("@stdout:"), stdout.toString().trim());
                    });
                    xrox.on("close", (code) => {
                        if (code === 0)
                            resolve();
                        else
                            reject(new Error(`@closed with code ${code}`));
                    });
                }),
                new Promise((resolve, reject) => {
                    xrox.stderr.on("data", (stderr) => {
                        console.log(colors.yellow("@stderr:"), stderr.toString().trim());
                    });
                    xrox.on("close", (code) => {
                        if (code === 0)
                            resolve();
                        else
                            reject(new Error(`@closed with code ${code}`));
                    });
                }),
            ]);
            break;
        case "help":
        case "h":
            const hdata = ytdlx.info.help();
            console.log(hdata);
            process.exit();
            break;
        case "extract":
        case "e":
            if (!proTube || !proTube.query || proTube.query.length === 0) {
                console.error(colors.red("error: no query"));
            }
            else
                yield ytdlx.info
                    .extract({
                    query: proTube.query,
                })
                    .then((data) => {
                    console.log(data);
                    process.exit();
                })
                    .catch((error) => {
                    console.error(colors.red(error));
                    process.exit();
                });
            break;
        // case "list-formats":
        // case "f":
        // if (!proTube || !proTube.query || proTube.query.length === 0) {
        // console.error(colors.red("error: no query"));
        // } else
        // await ytdlx.info
        // .list_formats({
        // query: proTube.query,
        // })
        // .then((data: any) => {
        // console.log(data);
        // process.exit();
        // })
        // .catch((error: string) => {
        // console.error(colors.red(error));
        // process.exit();
        // });
        // break;
        case "audio-highest":
        case "ah":
            if (!proTube || !proTube.query || proTube.query.length === 0) {
                console.error(colors.red("error: no query"));
            }
            else
                yield ytdlx.AudioOnly.Single.Highest({
                    query: proTube.query,
                })
                    .then((data) => {
                    console.log(data);
                    process.exit();
                })
                    .catch((error) => {
                    console.error(colors.red(error));
                    process.exit();
                });
            break;
        case "audio-lowest":
        case "al":
            if (!proTube || !proTube.query || proTube.query.length === 0) {
                console.error(colors.red("error: no query"));
            }
            else
                yield ytdlx.AudioOnly.Single.Lowest({
                    query: proTube.query,
                })
                    .then((data) => {
                    console.log(data);
                    process.exit();
                })
                    .catch((error) => {
                    console.error(colors.red(error));
                    process.exit();
                });
            break;
        case "video_highest":
        case "vh":
            if (!proTube || !proTube.query || proTube.query.length === 0) {
                console.error(colors.red("error: no query"));
            }
            else
                yield ytdlx.VideoOnly.Single.Highest({
                    query: proTube.query,
                })
                    .then((data) => {
                    console.log(data);
                    process.exit();
                })
                    .catch((error) => {
                    console.error(colors.red(error));
                    process.exit();
                });
            break;
        case "video-lowest":
        case "vl":
            if (!proTube || !proTube.query || proTube.query.length === 0) {
                console.error(colors.red("error: no query"));
            }
            else
                yield ytdlx.VideoOnly.Single.Lowest({
                    query: proTube.query,
                })
                    .then((data) => {
                    console.log(data);
                    process.exit();
                })
                    .catch((error) => {
                    console.error(colors.red(error));
                    process.exit();
                });
            break;
        default:
            const data = ytdlx.info.help();
            console.log(data);
            process.exit();
            break;
    }
});
if (!proTube._[0]) {
    const data = ytdlx.info.help();
    console.log(data);
    process.exit();
}
else
    program();
