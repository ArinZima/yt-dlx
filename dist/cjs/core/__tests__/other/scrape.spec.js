"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.clear();
const web_1 = __importDefault(require("../../web"));
const colors_1 = __importDefault(require("colors"));
(async () => {
    try {
        let Tube;
        Tube = (await web_1.default.browser.SearchVideos({
            query: "PERSONAL BY PLAZA",
            screenshot: false,
            onionTor: true,
            verbose: false,
            type: "video",
        }));
        console.log(colors_1.default.green("@pass:"), "video search results received");
        Tube = (await web_1.default.browser.VideoInfo({
            query: Tube[0]?.videoLink,
            screenshot: false,
            onionTor: true,
            verbose: false,
        }));
        console.log(colors_1.default.green("@pass:"), "single video data received");
        Tube = (await web_1.default.browser.SearchVideos({
            query: Tube.title,
            screenshot: false,
            onionTor: true,
            type: "playlist",
            verbose: false,
        }));
        console.log(colors_1.default.green("@pass:"), "playlist search results received");
        Tube = (await web_1.default.browser.PlaylistInfo({
            query: Tube[0]?.playlistLink,
            screenshot: false,
            onionTor: true,
            verbose: false,
        }));
        console.log(colors_1.default.green("@pass:"), "single playlist data received");
        Tube = await web_1.default.browserLess.searchVideos({ query: "weeknd" });
        console.log(colors_1.default.green("searchVideos"), Tube[0]);
        Tube = await web_1.default.browserLess.searchPlaylists({ query: Tube[0].title });
        console.log(colors_1.default.green("searchPlaylists"), Tube[0]);
        Tube = await web_1.default.browserLess.playlistVideos({ playlistId: Tube[0].id });
        console.log(colors_1.default.green("playlistVideos"), Tube[0]);
        Tube = await web_1.default.browserLess.relatedVideos({ videoId: Tube[0].id });
        console.log(colors_1.default.green("relatedVideos"), Tube[0]);
        Tube = await web_1.default.browserLess.singleVideo({ videoId: Tube[0].id });
        console.log(colors_1.default.green("singleVideo"), Tube);
    }
    catch (error) {
        console.error(colors_1.default.red("@error:"), error.message);
    }
})();
// =======================================================================
//# sourceMappingURL=scrape.spec.js.map