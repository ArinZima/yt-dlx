import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";
import AudioLowest from "./pipes/audio/single/AudioLowest";
import AudioHighest from "./pipes/audio/single/AudioHighest";
import VideoLowest from "./pipes/video/single/VideoLowest";
import VideoHighest from "./pipes/video/single/VideoHighest";
import AudioVideoLowest from "./pipes/mix/single/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/single/AudioVideoHighest";
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
    };
    VideoOnly: {
        Single: {
            Lowest: typeof VideoLowest;
            Highest: typeof VideoHighest;
        };
    };
    AudioVideo: {
        Single: {
            Lowest: typeof AudioVideoLowest;
            Highest: typeof AudioVideoHighest;
        };
    };
};
export default ytdlx;
//# sourceMappingURL=index.d.ts.map