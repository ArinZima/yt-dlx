"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = __importDefault(require("./web"));
const help_1 = __importDefault(require("./pipes/command/help"));
const extract_1 = __importDefault(require("./pipes/command/extract"));
const list_formats_1 = __importDefault(require("./pipes/command/list_formats"));
const extract_playlist_videos_1 = __importDefault(require("./pipes/command/extract_playlist_videos"));
const AudioLowest_1 = __importDefault(require("./pipes/Audio/single/AudioLowest"));
const AudioHighest_1 = __importDefault(require("./pipes/Audio/single/AudioHighest"));
const ListAudioLowest_1 = __importDefault(require("./pipes/Audio/list/ListAudioLowest"));
const ListAudioHighest_1 = __importDefault(require("./pipes/Audio/list/ListAudioHighest"));
const VideoLowest_1 = __importDefault(require("./pipes/Video/single/VideoLowest"));
const VideoHighest_1 = __importDefault(require("./pipes/Video/single/VideoHighest"));
const ListVideoLowest_1 = __importDefault(require("./pipes/Video/list/ListVideoLowest"));
const ListVideoHighest_1 = __importDefault(require("./pipes/Video/list/ListVideoHighest"));
const AudioVideoHighest_1 = __importDefault(require("./pipes/AudioVideo/single/AudioVideoHighest"));
const AudioVideoLowest_1 = __importDefault(require("./pipes/AudioVideo/single/AudioVideoLowest"));
const ListAudioVideoHighest_1 = __importDefault(require("./pipes/AudioVideo/list/ListAudioVideoHighest"));
const ListAudioVideoLowest_1 = __importDefault(require("./pipes/AudioVideo/list/ListAudioVideoLowest"));
const ytdlx = {
    search: {
        browser: {
            SearchVideos: web_1.default.browser.SearchVideos,
            PlaylistInfo: web_1.default.browser.PlaylistInfo,
            VideoInfo: web_1.default.browser.VideoInfo,
        },
        browserLess: {
            playlistVideos: web_1.default.browserLess.playlistVideos,
            relatedVideos: web_1.default.browserLess.relatedVideos,
            searchPlaylists: web_1.default.browserLess.searchPlaylists,
            searchVideos: web_1.default.browserLess.searchVideos,
            singleVideo: web_1.default.browserLess.singleVideo,
        },
    },
    info: {
        help: help_1.default,
        extract: extract_1.default,
        list_formats: list_formats_1.default,
        extract_playlist_videos: extract_playlist_videos_1.default,
    },
    AudioOnly: {
        Single: {
            Lowest: AudioLowest_1.default,
            Highest: AudioHighest_1.default,
        },
        List: {
            Lowest: ListAudioLowest_1.default,
            Highest: ListAudioHighest_1.default,
        },
    },
    VideoOnly: {
        Single: {
            Lowest: VideoLowest_1.default,
            Highest: VideoHighest_1.default,
        },
        List: {
            Lowest: ListVideoLowest_1.default,
            Highest: ListVideoHighest_1.default,
        },
    },
    AudioVideo: {
        Single: {
            Lowest: AudioVideoLowest_1.default,
            Highest: AudioVideoHighest_1.default,
        },
        List: {
            Lowest: ListAudioVideoLowest_1.default,
            Highest: ListAudioVideoHighest_1.default,
        },
    },
};
exports.default = ytdlx;
