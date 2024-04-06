"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = exports.browser = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function crawler(verbose, onionTor) {
    exports.browser = await puppeteer_1.default.launch({
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
    exports.page = await exports.browser.newPage();
    await exports.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36");
}
exports.default = crawler;
//# sourceMappingURL=crawler.js.map