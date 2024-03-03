import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";
import AudioLowest from "./pipes/audio/AudioLowest";
import AudioHighest from "./pipes/audio/AudioHighest";
import VideoLowest from "./pipes/video/VideoLowest";
import VideoHighest from "./pipes/video/VideoHighest";
import AudioVideoLowest from "./pipes/mix/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/AudioVideoHighest";
import AudioVideoQualityCustom from "./pipes/mix/AudioVideoQualityCustom.";
import AudioQualityCustom from "./pipes/audio/AudioQualityCustom";
import VideoQualityCustom from "./pipes/video/VideoQualityCustom";
declare const ytdlx: {
    search: {
        PlaylistInfo: typeof import("./web/api/PlaylistInfo").default;
        SearchVideos: typeof import("./web/api/SearchVideos").default;
        VideoInfo: typeof import("./web/api/VideoInfo").default;
    };
    info: {
        help: typeof help;
        extract: typeof extract;
        list_formats: typeof list_formats;
        extract_playlist_videos: typeof extract_playlist_videos;
    };
    audio: {
        lowest: typeof AudioLowest;
        highest: typeof AudioHighest;
        custom: typeof AudioQualityCustom;
    };
    video: {
        lowest: typeof VideoLowest;
        highest: typeof VideoHighest;
        custom: typeof VideoQualityCustom;
    };
    audio_video: {
        lowest: typeof AudioVideoLowest;
        highest: typeof AudioVideoHighest;
        custom: typeof AudioVideoQualityCustom;
    };
};
export default ytdlx;
//# sourceMappingURL=index.d.ts.map