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
declare const ytdlx: {
    search: {
        browser: {
            SearchVideos: typeof import("./web/browser/SearchVideos").default;
            PlaylistInfo: typeof import("./web/browser/PlaylistInfo").default;
            VideoInfo: typeof import("./web/browser/VideoInfo").default;
        };
        browserLess: {
            playlistVideos: typeof import("./web/vercel/playlistVideos").default;
            relatedVideos: typeof import("./web/vercel/relatedVideos").default;
            searchPlaylists: typeof import("./web/vercel/searchPlaylists").default;
            searchVideos: typeof import("./web/vercel/searchVideos").default;
            singleVideo: typeof import("./web/vercel/singleVideo").default;
        };
    };
    info: {
        help: typeof help;
        extract: typeof extract;
        list_formats: typeof list_formats;
        extract_playlist_videos: typeof extract_playlist_videos;
    };
    AudioOnly: {
        Single: {
            Lowest: typeof AudioLowest;
            Highest: typeof AudioHighest;
        };
        List: {
            Lowest: typeof ListAudioLowest;
            Highest: typeof ListAudioHighest;
        };
    };
    VideoOnly: {
        Single: {
            Lowest: typeof VideoLowest;
            Highest: typeof VideoHighest;
        };
        List: {
            Lowest: typeof ListVideoLowest;
            Highest: typeof ListVideoHighest;
        };
    };
    AudioVideo: {
        Single: {
            Lowest: typeof AudioVideoLowest;
            Highest: typeof AudioVideoHighest;
        };
        List: {
            Lowest: typeof ListAudioVideoLowest;
            Highest: typeof ListAudioVideoHighest;
        };
    };
};
export default ytdlx;
