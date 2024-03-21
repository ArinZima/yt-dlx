"use strict";
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
const colors_1 = __importDefault(require("colors"));
const child_process_1 = require("child_process");
function checkSudo() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const check = (0, child_process_1.spawn)("sudo", ["-n", "true"]);
            check.on("close", (code) => {
                resolve(code === 0);
            });
        });
    });
}
function niptor(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const sudoAvailable = yield checkSudo();
        const command = sudoAvailable ? ["sudo", ...args] : args;
        const prox = (0, child_process_1.spawn)("sh", ["-c", command.join(" ")]);
        const [stdoutData, stderrData] = yield Promise.all([
            new Promise((resolve, reject) => {
                const stdoutData = [];
                prox.stdout.on("data", (data) => stdoutData.push(data));
                prox.on("close", (code) => {
                    if (code === 0)
                        resolve(Buffer.concat(stdoutData).toString());
                    else
                        reject(new Error(colors_1.default.red("@error: ") +
                            `not able to connect to the server. if using ${colors_1.default.yellow("onionTor")}, maybe try running ${colors_1.default.yellow("npx yt-dlx install:socks5")}. make sure yt-dlx is always running with ${colors_1.default.yellow("sudo privileges")}!`));
                });
            }),
            new Promise((resolve, reject) => {
                const stderrData = [];
                prox.stderr.on("data", (data) => stderrData.push(data));
                prox.on("close", (code) => {
                    if (code === 0)
                        resolve(Buffer.concat(stderrData).toString());
                    else
                        reject(new Error(colors_1.default.red("@error: ") +
                            `not able to connect to the server. if using ${colors_1.default.yellow("onionTor")}, maybe try running ${colors_1.default.yellow("npx yt-dlx install:socks5")}. make sure yt-dlx is always running with ${colors_1.default.yellow("sudo privileges")}!`));
                });
            }),
        ]);
        return { stdout: stdoutData, stderr: stderrData };
    });
}
exports.default = niptor;
