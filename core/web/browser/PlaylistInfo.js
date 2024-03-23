var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { z } from "zod";
import colors from "colors";
import { load } from "cheerio";
import closers from "../closers";
import YouTubeId from "../YouTubeId";
import crawler, { browser, page } from "../crawler";
export default function PlaylistInfo(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = "";
        const QuerySchema = z.object({
            query: z
                .string()
                .min(1)
                .refine((input) => __awaiter(this, void 0, void 0, function* () {
                switch (true) {
                    case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(input):
                        const resultLink = yield YouTubeId(input);
                        if (resultLink !== undefined) {
                            query = input;
                            return true;
                        }
                        break;
                    default:
                        const resultId = yield YouTubeId(`https://www.youtube.com/playlist?list=${input}`);
                        if (resultId !== undefined) {
                            query = `https://www.youtube.com/playlist?list=${input}`;
                            return true;
                        }
                        break;
                }
                return false;
            }), {
                message: "Query must be a valid YouTube Playlist Link or ID.",
            }),
            verbose: z.boolean().optional(),
            onionTor: z.boolean().optional(),
            screenshot: z.boolean().optional(),
        });
        const { screenshot, verbose, onionTor } = yield QuerySchema.parseAsync(input);
        let metaTube = [];
        yield crawler(verbose, onionTor);
        yield page.goto(query);
        for (let i = 0; i < 40; i++) {
            yield page.evaluate(() => window.scrollBy(0, window.innerHeight));
        }
        if (screenshot) {
            yield page.screenshot({
                path: "FilterVideo.png",
            });
            console.log(colors.yellow("@scrape:"), "took snapshot...");
        }
        const content = yield page.content();
        const $ = load(content);
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
            const videoIdPromise = YouTubeId(videoLink);
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
        yield Promise.all(videoIdPromises);
        console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
        yield closers(browser);
        return {
            playlistVideos: metaTube,
            playlistDescription: playlistDescription.trim(),
            playlistVideoCount: metaTube.length,
            playlistViews,
            playlistTitle,
        };
    });
}
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
process.on("uncaughtException", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
process.on("unhandledRejection", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
