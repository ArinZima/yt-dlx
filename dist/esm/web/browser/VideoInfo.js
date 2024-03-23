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
export default function VideoInfo(input) {
    return __awaiter(this, void 0, void 0, function () {
        var query, QuerySchema, _a, screenshot, verbose, onionTor, i, videoId, htmlContent, $, title, author, viewsElement, views, uploadOnElement, uploadOn, thumbnailUrls, TubeResp;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "";
                    QuerySchema = z.object({
                        query: z
                            .string()
                            .min(1)
                            .refine(function (input) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, resultLink, resultId;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        query = input;
                                        _a = true;
                                        switch (_a) {
                                            case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(input): return [3 /*break*/, 1];
                                        }
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, YouTubeId(input)];
                                    case 2:
                                        resultLink = _b.sent();
                                        if (resultLink !== undefined)
                                            return [2 /*return*/, true];
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, YouTubeId("https://www.youtube.com/watch?v=".concat(input))];
                                    case 4:
                                        resultId = _b.sent();
                                        if (resultId !== undefined)
                                            return [2 /*return*/, true];
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/, false];
                                }
                            });
                        }); }, {
                            message: "Query must be a valid YouTube video Link or ID.",
                        }),
                        verbose: z.boolean().optional(),
                        onionTor: z.boolean().optional(),
                        screenshot: z.boolean().optional(),
                    });
                    return [4 /*yield*/, QuerySchema.parseAsync(input)];
                case 1:
                    _a = _b.sent(), screenshot = _a.screenshot, verbose = _a.verbose, onionTor = _a.onionTor;
                    return [4 /*yield*/, crawler(verbose, onionTor)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, page.goto(query)];
                case 3:
                    _b.sent();
                    i = 0;
                    _b.label = 4;
                case 4:
                    if (!(i < 40)) return [3 /*break*/, 7];
                    return [4 /*yield*/, page.evaluate(function () { return window.scrollBy(0, window.innerHeight); })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    if (!screenshot) return [3 /*break*/, 9];
                    return [4 /*yield*/, page.screenshot({ path: "FilterVideo.png" })];
                case 8:
                    _b.sent();
                    console.log(colors.yellow("@scrape:"), "took snapshot...");
                    _b.label = 9;
                case 9: return [4 /*yield*/, YouTubeId(query)];
                case 10:
                    videoId = (_b.sent());
                    return [4 /*yield*/, page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-metadata", { timeout: 10000 })];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, page.waitForSelector("a.yt-simple-endpoint.style-scope.yt-formatted-string", { timeout: 10000 })];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-info-text", { timeout: 10000 })];
                case 13:
                    _b.sent();
                    setTimeout(function () { }, 1000);
                    return [4 /*yield*/, page.content()];
                case 14:
                    htmlContent = _b.sent();
                    $ = load(htmlContent);
                    title = $("yt-formatted-string.style-scope.ytd-watch-metadata")
                        .text()
                        .trim();
                    author = $("a.yt-simple-endpoint.style-scope.yt-formatted-string")
                        .text()
                        .trim();
                    viewsElement = $("yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('views')").first();
                    views = viewsElement.text().trim().replace(" views", "");
                    uploadOnElement = $("yt-formatted-string.style-scope.ytd-watch-info-text span.bold.style-scope.yt-formatted-string:contains('ago')").first();
                    uploadOn = uploadOnElement.text().trim();
                    thumbnailUrls = [
                        "https://img.youtube.com/vi/".concat(videoId, "/maxresdefault.jpg"),
                        "https://img.youtube.com/vi/".concat(videoId, "/sddefault.jpg"),
                        "https://img.youtube.com/vi/".concat(videoId, "/mqdefault.jpg"),
                        "https://img.youtube.com/vi/".concat(videoId, "/hqdefault.jpg"),
                        "https://img.youtube.com/vi/".concat(videoId, "/default.jpg"),
                    ];
                    TubeResp = {
                        views: views,
                        author: author,
                        videoId: videoId,
                        uploadOn: uploadOn,
                        thumbnailUrls: thumbnailUrls,
                        title: title.trim(),
                        videoLink: "https://www.youtube.com/watch?v=" + videoId,
                    };
                    console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
                    return [4 /*yield*/, closers(browser)];
                case 15:
                    _b.sent();
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
