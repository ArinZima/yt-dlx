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
function SearchVideos(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const QuerySchema = zod_1.z.object({
            query: zod_1.z
                .string()
                .min(1)
                .refine((query) => __awaiter(this, void 0, void 0, function* () {
                const result = yield (0, YouTubeId_1.default)(query);
                return result === undefined;
            }), {
                message: "Query must not be a YouTube video/Playlist link",
            }),
            verbose: zod_1.z.boolean().optional(),
            onionTor: zod_1.z.boolean().optional(),
            screenshot: zod_1.z.boolean().optional(),
        });
        const { query, screenshot, verbose, onionTor } = yield QuerySchema.parseAsync(input);
        yield (0, crawler_1.default)(verbose, onionTor);
        let $;
        let url;
        let content;
        let videoElements;
        let metaTube = [];
        let playlistMeta = [];
        let TubeResp;
        switch (input.type) {
            case "video":
                url =
                    "https://www.youtube.com/results?search_query=" +
                        encodeURIComponent(query) +
                        "&sp=EgIQAQ%253D%253D";
                yield crawler_1.page.goto(url);
                for (let i = 0; i < 40; i++) {
                    yield crawler_1.page.evaluate(() => window.scrollBy(0, window.innerHeight));
                }
                if (screenshot) {
                    yield crawler_1.page.screenshot({
                        path: "TypeVideo.png",
                    });
                    console.log(colors_1.default.yellow("@scrape:"), "took snapshot...");
                }
                content = yield crawler_1.page.content();
                $ = (0, cheerio_1.load)(content);
                videoElements = $("ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])");
                videoElements.each((_, vide) => __awaiter(this, void 0, void 0, function* () {
                    const videoId = yield (0, YouTubeId_1.default)("https://www.youtube.com" + $(vide).find("a").attr("href"));
                    const authorContainer = $(vide).find(".ytd-channel-name a");
                    const uploadedOnElement = $(vide).find(".inline-metadata-item.style-scope.ytd-video-meta-block");
                    metaTube.push({
                        title: $(vide).find("#video-title").text().trim() || undefined,
                        views: $(vide)
                            .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
                            .filter((_, vide) => $(vide).text().includes("views"))
                            .text()
                            .trim()
                            .replace(/ views/g, "") || undefined,
                        author: authorContainer.text().trim() || undefined,
                        videoId,
                        uploadOn: uploadedOnElement.length >= 2
                            ? $(uploadedOnElement[1]).text().trim()
                            : undefined,
                        authorUrl: "https://www.youtube.com" + authorContainer.attr("href") ||
                            undefined,
                        videoLink: "https://www.youtube.com/watch?v=" + videoId,
                        thumbnailUrls: [
                            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                            `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                            `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                            `https://img.youtube.com/vi/${videoId}/default.jpg`,
                        ],
                        description: $(vide).find(".metadata-snippet-text").text().trim() || undefined,
                    });
                }));
                console.log(colors_1.default.green("@info:"), colors_1.default.white("scrapping done for"), colors_1.default.green(query));
                TubeResp = metaTube;
                break;
            case "playlist":
                url =
                    "https://www.youtube.com/results?search_query=" +
                        encodeURIComponent(query) +
                        "&sp=EgIQAw%253D%253D";
                yield crawler_1.page.goto(url);
                for (let i = 0; i < 80; i++) {
                    yield crawler_1.page.evaluate(() => window.scrollBy(0, window.innerHeight));
                }
                if (screenshot) {
                    yield crawler_1.page.screenshot({
                        path: "TypePlaylist.png",
                    });
                    console.log(colors_1.default.yellow("@scrape:"), "took snapshot...");
                }
                content = yield crawler_1.page.content();
                $ = (0, cheerio_1.load)(content);
                const playlistElements = $("ytd-playlist-renderer");
                playlistElements.each((_index, element) => {
                    const playlistLink = $(element)
                        .find(".style-scope.ytd-playlist-renderer #view-more a")
                        .attr("href");
                    const vCount = $(element).text().trim();
                    playlistMeta.push({
                        title: $(element)
                            .find(".style-scope.ytd-playlist-renderer #video-title")
                            .text()
                            .replace(/\s+/g, " ")
                            .trim() || undefined,
                        author: $(element)
                            .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                            .text()
                            .replace(/\s+/g, " ")
                            .trim() || undefined,
                        playlistId: playlistLink.split("list=")[1],
                        playlistLink: "https://www.youtube.com" + playlistLink,
                        authorUrl: $(element)
                            .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                            .attr("href")
                            ? "https://www.youtube.com" +
                                $(element)
                                    .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                                    .attr("href")
                            : undefined,
                        videoCount: parseInt(vCount.replace(/ videos\nNOW PLAYING/g, "")) || undefined,
                    });
                });
                console.log(colors_1.default.green("@info:"), colors_1.default.white("scrapping done for"), colors_1.default.green(query));
                TubeResp = playlistMeta;
                break;
            default:
                console.log(colors_1.default.red("@error:"), colors_1.default.white("wrong filter type provided."));
                TubeResp = undefined;
                break;
        }
        yield (0, closers_1.default)(crawler_1.browser);
        return TubeResp;
    });
}
exports.default = SearchVideos;
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
process.on("uncaughtException", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
process.on("unhandledRejection", () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, closers_1.default)(crawler_1.browser); }));
