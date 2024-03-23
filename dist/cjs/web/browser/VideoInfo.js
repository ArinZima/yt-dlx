"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const zod_1 = require("zod");
const colors_1 = __importDefault(require("colors"));
const cheerio_1 = require("cheerio");
const closers_1 = __importDefault(require("../closers"));
const YouTubeId_1 = __importDefault(require("../YouTubeId"));
const crawler_1 = __importStar(require("../crawler"));
function VideoInfo(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = "";
        const QuerySchema = zod_1.z.object({
            query: zod_1.z
                .string()
                .min(1)
                .refine((input) => __awaiter(this, void 0, void 0, function* () {
                query = input;
                switch (true) {
                    case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(input):
                        const resultLink = yield (0, YouTubeId_1.default)(input);
                        if (resultLink !== undefined)
                            return true;
                        break;
                    default:
                        const resultId = yield (0, YouTubeId_1.default)(`https://www.youtube.com/watch?v=${input}`);
                        if (resultId !== undefined)
                            return true;
                        break;
                }
                return false;
            }), {
                message: "Query must be a valid YouTube video Link or ID.",
            }),
            verbose: zod_1.z.boolean().optional(),
            onionTor: zod_1.z.boolean().optional(),
            screenshot: zod_1.z.boolean().optional(),
        });
        const { screenshot, verbose, onionTor } = yield QuerySchema.parseAsync(input);
        yield (0, crawler_1.default)(verbose, onionTor);
        yield crawler_1.page.goto(query);
        for (let i = 0; i < 40; i++) {
            yield crawler_1.page.evaluate(() => window.scrollBy(0, window.innerHeight));
        }
        if (screenshot) {
            yield crawler_1.page.screenshot({ path: "FilterVideo.png" });
            console.log(colors_1.default.yellow("@scrape:"), "took snapshot...");
        }
        const videoId = (yield (0, YouTubeId_1.default)(query));
        yield crawler_1.page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-metadata", { timeout: 10000 });
        yield crawler_1.page.waitForSelector("a.yt-simple-endpoint.style-scope.yt-formatted-string", { timeout: 10000 });
        yield crawler_1.page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-info-text", { timeout: 10000 });
        setTimeout(() => { }, 1000);
        const htmlContent = yield crawler_1.page.content();
        const $ = (0, cheerio_1.load)(htmlContent);
        const title = $("yt-formatted-string.style-scope.ytd-watch-metadata")
            .text()
            .trim();
        const author = $("a.yt-simple-endpoint.style-scope.yt-formatted-string")
            .text()
            .trim();
        const viewsElement = $("yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('views')").first();
        const views = viewsElement.text().trim().replace(" views", "");
        const uploadOnElement = $("yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('ago')").first();
        const uploadOn = uploadOnElement.text().trim();
        const thumbnailUrls = [
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/default.jpg`,
        ];
        const TubeResp = {
            views,
            author,
            videoId,
            uploadOn,
            thumbnailUrls,
            title: title.trim(),
            videoLink: "https://www.youtube.com/watch?v=" + videoId,
        };
        console.log(colors_1.default.green("@info:"), colors_1.default.white("scrapping done for"), colors_1.default.green(query));
        yield (0, closers_1.default)(crawler_1.browser);
        return TubeResp;
    });
}
exports.default = VideoInfo;
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
process.on("uncaughtException", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
process.on("unhandledRejection", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
