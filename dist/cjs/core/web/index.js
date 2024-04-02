"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlaylistInfo_1 = __importDefault(require("./browser/PlaylistInfo"));
const SearchVideos_1 = __importDefault(require("./browser/SearchVideos"));
const VideoInfo_1 = __importDefault(require("./browser/VideoInfo"));
const playlistVideos_1 = __importDefault(require("./vercel/playlistVideos"));
const relatedVideos_1 = __importDefault(require("./vercel/relatedVideos"));
const searchPlaylists_1 = __importDefault(require("./vercel/searchPlaylists"));
const searchVideos_1 = __importDefault(require("./vercel/searchVideos"));
const singleVideo_1 = __importDefault(require("./vercel/singleVideo"));
const web = {
    browser: {
        VideoInfo: VideoInfo_1.default,
        SearchVideos: SearchVideos_1.default,
        PlaylistInfo: PlaylistInfo_1.default,
    },
    browserLess: {
        singleVideo: singleVideo_1.default,
        searchVideos: searchVideos_1.default,
        relatedVideos: relatedVideos_1.default,
        playlistVideos: playlistVideos_1.default,
        searchPlaylists: searchPlaylists_1.default,
    },
};
exports.default = web;
//# sourceMappingURL=index.js.map