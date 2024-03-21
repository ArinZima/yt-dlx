import web from "./web";
import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";
import AudioLowest from "./pipes/Audio/single/AudioLowest";
import AudioHighest from "./pipes/Audio/single/AudioHighest";
import ListAudioLowest from "./pipes/Audio/list/ListAudioLowest";
import ListAudioHighest from "./pipes/Audio/list/ListAudioHighest";
import VideoLowest from "./pipes/Video/single/VideoLowest";
import VideoHighest from "./pipes/Video/single/VideoHighest";
import ListVideoLowest from "./pipes/Video/list/ListVideoLowest";
import ListVideoHighest from "./pipes/Video/list/ListVideoHighest";
import AudioVideoHighest from "./pipes/AudioVideo/single/AudioVideoHighest";
import AudioVideoLowest from "./pipes/AudioVideo/single/AudioVideoLowest";
import ListAudioVideoHighest from "./pipes/AudioVideo/list/ListAudioVideoHighest";
import ListAudioVideoLowest from "./pipes/AudioVideo/list/ListAudioVideoLowest";
var ytdlx = {
    search: {
        browser: {
            SearchVideos: web.browser.SearchVideos,
            PlaylistInfo: web.browser.PlaylistInfo,
            VideoInfo: web.browser.VideoInfo,
        },
        browserLess: {
            playlistVideos: web.browserLess.playlistVideos,
            relatedVideos: web.browserLess.relatedVideos,
            searchPlaylists: web.browserLess.searchPlaylists,
            searchVideos: web.browserLess.searchVideos,
            singleVideo: web.browserLess.singleVideo,
        },
    },
    info: {
        help: help,
        extract: extract,
        list_formats: list_formats,
        extract_playlist_videos: extract_playlist_videos,
    },
    AudioOnly: {
        Single: {
            Lowest: AudioLowest,
            Highest: AudioHighest,
        },
        List: {
            Lowest: ListAudioLowest,
            Highest: ListAudioHighest,
        },
    },
    VideoOnly: {
        Single: {
            Lowest: VideoLowest,
            Highest: VideoHighest,
        },
        List: {
            Lowest: ListVideoLowest,
            Highest: ListVideoHighest,
        },
    },
    AudioVideo: {
        Single: {
            Lowest: AudioVideoLowest,
            Highest: AudioVideoHighest,
        },
        List: {
            Lowest: ListAudioVideoLowest,
            Highest: ListAudioVideoHighest,
        },
    },
};
export default ytdlx;
