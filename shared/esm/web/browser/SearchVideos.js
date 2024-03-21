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
import { z } from "zod";
import colors from "colors";
import { load } from "cheerio";
import closers from "../closers";
import YouTubeId from "../YouTubeId";
import crawler, { browser, page } from "../crawler";
export default function SearchVideos(input) {
    return __awaiter(this, void 0, void 0, function () {
        var QuerySchema, _a, query, screenshot, verbose, onionTor, url, $, content, metaTube, videoElements, playlistMeta, TubeResp, _b, i, i, playlistElements;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    QuerySchema = z.object({
                        query: z
                            .string()
                            .min(1)
                            .refine(function (query) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, YouTubeId(query)];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, result === undefined];
                                }
                            });
                        }); }, {
                            message: "Query must not be a YouTube video/Playlist link",
                        }),
                        verbose: z.boolean().optional(),
                        onionTor: z.boolean().optional(),
                        screenshot: z.boolean().optional(),
                    });
                    return [4 /*yield*/, QuerySchema.parseAsync(input)];
                case 1:
                    _a = _c.sent(), query = _a.query, screenshot = _a.screenshot, verbose = _a.verbose, onionTor = _a.onionTor;
                    return [4 /*yield*/, crawler(verbose, onionTor)];
                case 2:
                    _c.sent();
                    metaTube = [];
                    playlistMeta = [];
                    _b = input.type;
                    switch (_b) {
                        case "video": return [3 /*break*/, 3];
                        case "playlist": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 21];
                case 3:
                    url =
                        "https://www.youtube.com/results?search_query=" +
                            encodeURIComponent(query) +
                            "&sp=EgIQAQ%253D%253D";
                    return [4 /*yield*/, page.goto(url)];
                case 4:
                    _c.sent();
                    i = 0;
                    _c.label = 5;
                case 5:
                    if (!(i < 40)) return [3 /*break*/, 8];
                    return [4 /*yield*/, page.evaluate(function () { return window.scrollBy(0, window.innerHeight); })];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    if (!screenshot) return [3 /*break*/, 10];
                    return [4 /*yield*/, page.screenshot({
                            path: "TypeVideo.png",
                        })];
                case 9:
                    _c.sent();
                    console.log(colors.yellow("@scrape:"), "took snapshot...");
                    _c.label = 10;
                case 10: return [4 /*yield*/, page.content()];
                case 11:
                    content = _c.sent();
                    $ = load(content);
                    videoElements = $("ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])");
                    videoElements.each(function (_, vide) { return __awaiter(_this, void 0, void 0, function () {
                        var videoId, authorContainer, uploadedOnElement;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, YouTubeId("https://www.youtube.com" + $(vide).find("a").attr("href"))];
                                case 1:
                                    videoId = _a.sent();
                                    authorContainer = $(vide).find(".ytd-channel-name a");
                                    uploadedOnElement = $(vide).find(".inline-metadata-item.style-scope.ytd-video-meta-block");
                                    metaTube.push({
                                        title: $(vide).find("#video-title").text().trim() || undefined,
                                        views: $(vide)
                                            .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
                                            .filter(function (_, vide) { return $(vide).text().includes("views"); })
                                            .text()
                                            .trim()
                                            .replace(/ views/g, "") || undefined,
                                        author: authorContainer.text().trim() || undefined,
                                        videoId: videoId,
                                        uploadOn: uploadedOnElement.length >= 2
                                            ? $(uploadedOnElement[1]).text().trim()
                                            : undefined,
                                        authorUrl: "https://www.youtube.com" + authorContainer.attr("href") ||
                                            undefined,
                                        videoLink: "https://www.youtube.com/watch?v=" + videoId,
                                        thumbnailUrls: [
                                            "https://img.youtube.com/vi/".concat(videoId, "/maxresdefault.jpg"),
                                            "https://img.youtube.com/vi/".concat(videoId, "/sddefault.jpg"),
                                            "https://img.youtube.com/vi/".concat(videoId, "/mqdefault.jpg"),
                                            "https://img.youtube.com/vi/".concat(videoId, "/hqdefault.jpg"),
                                            "https://img.youtube.com/vi/".concat(videoId, "/default.jpg"),
                                        ],
                                        description: $(vide).find(".metadata-snippet-text").text().trim() || undefined,
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
                    TubeResp = metaTube;
                    return [3 /*break*/, 22];
                case 12:
                    url =
                        "https://www.youtube.com/results?search_query=" +
                            encodeURIComponent(query) +
                            "&sp=EgIQAw%253D%253D";
                    return [4 /*yield*/, page.goto(url)];
                case 13:
                    _c.sent();
                    i = 0;
                    _c.label = 14;
                case 14:
                    if (!(i < 80)) return [3 /*break*/, 17];
                    return [4 /*yield*/, page.evaluate(function () { return window.scrollBy(0, window.innerHeight); })];
                case 15:
                    _c.sent();
                    _c.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 14];
                case 17:
                    if (!screenshot) return [3 /*break*/, 19];
                    return [4 /*yield*/, page.screenshot({
                            path: "TypePlaylist.png",
                        })];
                case 18:
                    _c.sent();
                    console.log(colors.yellow("@scrape:"), "took snapshot...");
                    _c.label = 19;
                case 19: return [4 /*yield*/, page.content()];
                case 20:
                    content = _c.sent();
                    $ = load(content);
                    playlistElements = $("ytd-playlist-renderer");
                    playlistElements.each(function (_index, element) {
                        var playlistLink = $(element)
                            .find(".style-scope.ytd-playlist-renderer #view-more a")
                            .attr("href");
                        var vCount = $(element).text().trim();
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
                    console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
                    TubeResp = playlistMeta;
                    return [3 /*break*/, 22];
                case 21:
                    console.log(colors.red("@error:"), colors.white("wrong filter type provided."));
                    TubeResp = undefined;
                    return [3 /*break*/, 22];
                case 22: return [4 /*yield*/, closers(browser)];
                case 23:
                    _c.sent();
                    return [2 /*return*/, TubeResp];
            }
        });
    });
}
process.on("SIGINT", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, closers(browser)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
process.on("SIGTERM", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, closers(browser)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
process.on("uncaughtException", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, closers(browser)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
process.on("unhandledRejection", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, closers(browser)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
