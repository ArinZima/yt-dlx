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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const colors_1 = __importDefault(require("colors"));
const zod_1 = require("zod");
const YouTubeId_1 = __importDefault(require("../YouTubeId"));
const closers_1 = __importDefault(require("../closers"));
const crawler_1 = __importStar(require("../crawler"));
async function PlaylistInfo(input) {
    let query = "";
    const QuerySchema = zod_1.z.object({
        query: zod_1.z
            .string()
            .min(1)
            .refine(async (input) => {
            switch (true) {
                case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                    const resultLink = await (0, YouTubeId_1.default)(input);
                    if (resultLink !== undefined) {
                        query = input;
                        return true;
                    }
                    break;
                default:
                    const resultId = await (0, YouTubeId_1.default)(`https://www.youtube.com/playlist?list=${input}`);
                    if (resultId !== undefined) {
                        query = `https://www.youtube.com/playlist?list=${input}`;
                        return true;
                    }
                    break;
            }
            return false;
        }, {
            message: "Query must be a valid YouTube Playlist Link or ID.",
        }),
        verbose: zod_1.z.boolean().optional(),
        onionTor: zod_1.z.boolean().optional(),
        screenshot: zod_1.z.boolean().optional(),
    });
    const { screenshot, verbose, onionTor } = await QuerySchema.parseAsync(input);
    let metaTube = [];
    await (0, crawler_1.default)(verbose, onionTor);
    await crawler_1.page.goto(query);
    for (let i = 0; i < 40; i++) {
        await crawler_1.page.evaluate(() => window.scrollBy(0, window.innerHeight));
    }
    if (screenshot) {
        await crawler_1.page.screenshot({
            path: "FilterVideo.png",
        });
        console.log(colors_1.default.yellow("@scrape:"), "took snapshot...");
    }
    const content = await crawler_1.page.content();
    const $ = (0, cheerio_1.load)(content);
    const playlistTitle = $("yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string")
        .text()
        .trim();
    const viewsText = $("yt-formatted-string.byline-item").eq(1).text();
    const playlistViews = parseInt(viewsText.replace(/,/g, "").match(/\d+/)[0]);
    let playlistDescription = $("span#plain-snippet-text").text();
    // Iterate over each playlist video element
    const videoElements = $("ytd-playlist-video-renderer");
    const videoIdPromises = [];
    videoElements.each((_index, element) => {
        const title = $(element).find("h3").text().trim();
        const videoLink = "https://www.youtube.com" + $(element).find("a").attr("href");
        const videoIdPromise = (0, YouTubeId_1.default)(videoLink);
        videoIdPromises.push(videoIdPromise);
        videoIdPromise
            .then((videoId) => {
            const newLink = "https://www.youtube.com/watch?v=" + videoId;
            const author = $(element)
                .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                .text();
            const authorUrl = "https://www.youtube.com" +
                $(element)
                    .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
                    .attr("href");
            const views = $(element)
                .find(".style-scope.ytd-video-meta-block span:first-child")
                .text();
            const ago = $(element)
                .find(".style-scope.ytd-video-meta-block span:last-child")
                .text();
            const thumbnailUrls = [
                `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/default.jpg`,
            ];
            metaTube.push({
                ago,
                author,
                videoId,
                authorUrl,
                thumbnailUrls,
                videoLink: newLink,
                title: title.trim(),
                views: views.replace(/ views/g, ""),
            });
        })
            .catch((error) => {
            console.error("Error fetching videoId:", error);
        });
    });
    // Wait for all videoIdPromises to resolve
    await Promise.all(videoIdPromises);
    console.log(colors_1.default.green("@info:"), colors_1.default.white("scrapping done for"), colors_1.default.green(query));
    await (0, closers_1.default)(crawler_1.browser);
    return {
        playlistVideos: metaTube,
        playlistDescription: playlistDescription.trim(),
        playlistVideoCount: metaTube.length,
        playlistViews,
        playlistTitle,
    };
}
exports.default = PlaylistInfo;
process.on("SIGINT", async () => await (0, closers_1.default)(crawler_1.browser));
process.on("SIGTERM", async () => await (0, closers_1.default)(crawler_1.browser));
process.on("uncaughtException", async () => await (0, closers_1.default)(crawler_1.browser));
process.on("unhandledRejection", async () => await (0, closers_1.default)(crawler_1.browser));
//# sourceMappingURL=PlaylistInfo.js.map