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
export default function VideoInfo(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = "";
        const QuerySchema = z.object({
            query: z
                .string()
                .min(1)
                .refine((input) => __awaiter(this, void 0, void 0, function* () {
                query = input;
                switch (true) {
                    case /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?(.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(input):
                        const resultLink = yield YouTubeId(input);
                        if (resultLink !== undefined)
                            return true;
                        break;
                    default:
                        const resultId = yield YouTubeId(`https://www.youtube.com/watch?v=${input}`);
                        if (resultId !== undefined)
                            return true;
                        break;
                }
                return false;
            }), {
                message: "Query must be a valid YouTube video Link or ID.",
            }),
            verbose: z.boolean().optional(),
            onionTor: z.boolean().optional(),
            screenshot: z.boolean().optional(),
        });
        const { screenshot, verbose, onionTor } = yield QuerySchema.parseAsync(input);
        yield crawler(verbose, onionTor);
        yield page.goto(query);
        for (let i = 0; i < 40; i++) {
            yield page.evaluate(() => window.scrollBy(0, window.innerHeight));
        }
        if (screenshot) {
            yield page.screenshot({ path: "FilterVideo.png" });
            console.log(colors.yellow("@scrape:"), "took snapshot...");
        }
        const videoId = (yield YouTubeId(query));
        yield page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-metadata", { timeout: 10000 });
        yield page.waitForSelector("a.yt-simple-endpoint.style-scope.yt-formatted-string", { timeout: 10000 });
        yield page.waitForSelector("yt-formatted-string.style-scope.ytd-watch-info-text", { timeout: 10000 });
        setTimeout(() => { }, 1000);
        const htmlContent = yield page.content();
        const $ = load(htmlContent);
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
        console.log(colors.green("@info:"), colors.white("scrapping done for"), colors.green(query));
        yield closers(browser);
        return TubeResp;
    });
}
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
process.on("uncaughtException", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
process.on("unhandledRejection", () => __awaiter(void 0, void 0, void 0, function* () { return yield closers(browser); }));
