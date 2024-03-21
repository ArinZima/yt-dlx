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
exports.page = exports.browser = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
function crawler(verbose, onionTor) {
    return __awaiter(this, void 0, void 0, function* () {
        if (onionTor) {
            exports.browser = yield puppeteer_1.default.launch({
                headless: verbose ? false : true,
                ignoreHTTPSErrors: true,
                args: [
                    "--no-zygote",
                    "--incognito",
                    "--no-sandbox",
                    "--lang=en-US",
                    "--enable-automation",
                    "--disable-dev-shm-usage",
                    "--ignore-certificate-errors",
                    "--allow-running-insecure-content",
                    "--proxy-server=socks5://127.0.0.1:9050",
                ],
            });
        }
        else {
            exports.browser = yield puppeteer_1.default.launch({
                headless: verbose ? false : true,
                ignoreHTTPSErrors: true,
                args: [
                    "--no-zygote",
                    "--incognito",
                    "--no-sandbox",
                    "--lang=en-US",
                    "--enable-automation",
                    "--disable-dev-shm-usage",
                    "--ignore-certificate-errors",
                    "--allow-running-insecure-content",
                ],
            });
        }
        exports.page = yield exports.browser.newPage();
        yield exports.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
    });
}
exports.default = crawler;
