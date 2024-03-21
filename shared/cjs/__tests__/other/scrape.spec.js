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
console.clear();
const web_1 = __importDefault(require("../../web"));
const colors_1 = __importDefault(require("colors"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let Tube;
        Tube = (yield web_1.default.browser.SearchVideos({
            query: "PERSONAL BY PLAZA",
            screenshot: false,
            onionTor: true,
            verbose: false,
            type: "video",
        }));
        console.log(colors_1.default.green("@pass:"), "video search results received");
        Tube = (yield web_1.default.browser.VideoInfo({
            query: (_a = Tube[0]) === null || _a === void 0 ? void 0 : _a.videoLink,
            screenshot: false,
            onionTor: true,
            verbose: false,
        }));
        console.log(colors_1.default.green("@pass:"), "single video data received");
        Tube = (yield web_1.default.browser.SearchVideos({
            query: Tube.title,
            screenshot: false,
            onionTor: true,
            type: "playlist",
            verbose: false,
        }));
        console.log(colors_1.default.green("@pass:"), "playlist search results received");
        Tube = (yield web_1.default.browser.PlaylistInfo({
            query: (_b = Tube[0]) === null || _b === void 0 ? void 0 : _b.playlistLink,
            screenshot: false,
            onionTor: true,
            verbose: false,
        }));
        console.log(colors_1.default.green("@pass:"), "single playlist data received");
        // Tube = await web.browserLess.searchVideos({ query: "weeknd" });
        // console.log(colors.green("searchVideos"), Tube[0]);
        // Tube = await web.browserLess.searchPlaylists({ query: Tube[0].title });
        // console.log(colors.green("searchPlaylists"), Tube[0]);
        // Tube = await web.browserLess.playlistVideos({ playlistId: Tube[0].id });
        // console.log(colors.green("playlistVideos"), Tube[0]);
        // Tube = await web.browserLess.relatedVideos({ videoId: Tube[0].id });
        // console.log(colors.green("relatedVideos"), Tube[0]);
        // Tube = await web.browserLess.singleVideo({ videoId: Tube[0].id });
        // console.log(colors.green("singleVideo"), Tube);
    }
    catch (error) {
        console.error(colors_1.default.red("@error:"), error.message);
    }
}))();
// =======================================================================
