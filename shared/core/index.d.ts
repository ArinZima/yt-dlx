import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";
import AudioLowest from "./pipes/audio/single/AudioLowest";
import AudioHighest from "./pipes/audio/single/AudioHighest";
import ListAudioLowest from "./pipes/audio/list/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/list/ListAudioHighest";
import VideoLowest from "./pipes/video/single/VideoLowest";
import VideoHighest from "./pipes/video/single/VideoHighest";
import ListVideoLowest from "./pipes/video/list/ListVideoLowest";
import ListVideoHighest from "./pipes/video/list/ListVideoHighest";
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
};
export default ytdlx;
//# sourceMappingURL=index.d.ts.map