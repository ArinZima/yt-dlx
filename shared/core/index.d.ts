import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";
import AudioLowest from "./pipes/audio/AudioLowest";
import AudioHighest from "./pipes/audio/AudioHighest";
import AudioQualityCustom from "./pipes/audio/AudioQualityCustom";
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/ListAudioQualityCustom";
import VideoLowest from "./pipes/video/VideoLowest";
import VideoHighest from "./pipes/video/VideoHighest";
import VideoQualityCustom from "./pipes/video/VideoQualityCustom";
import ListVideoLowest from "./pipes/video/ListVideoLowest";
import ListVideoHighest from "./pipes/video/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/ListVideoQualityCustom";
import AudioVideoLowest from "./pipes/mix/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/AudioVideoHighest";
import AudioVideoQualityCustom from "./pipes/mix/AudioVideoQualityCustom.";
import ListAudioVideoHighest from "./pipes/mix/ListAudioVideoHighest";
import ListAudioVideoLowest from "./pipes/mix/ListAudioVideoLowest";
import ListAudioVideoQualityCustom from "./pipes/mix/ListAudioVideoQualityCustom";
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
        single: {
            lowest: typeof AudioLowest;
            highest: typeof AudioHighest;
            custom: typeof AudioQualityCustom;
        };
        playlist: {
            lowest: typeof ListAudioLowest;
            highest: typeof ListAudioHighest;
            custom: typeof ListAudioQualityCustom;
        };
    };
    video: {
        single: {
            lowest: typeof VideoLowest;
            highest: typeof VideoHighest;
            custom: typeof VideoQualityCustom;
        };
        playlist: {
            lowest: typeof ListVideoLowest;
            highest: typeof ListVideoHighest;
            custom: typeof ListVideoQualityCustom;
        };
    };
    audio_video: {
        single: {
            lowest: typeof AudioVideoLowest;
            highest: typeof AudioVideoHighest;
            custom: typeof AudioVideoQualityCustom;
        };
        playlist: {
            lowest: typeof ListAudioVideoHighest;
            highest: typeof ListAudioVideoLowest;
            custom: typeof ListAudioVideoQualityCustom;
        };
    };
};
export default ytdlx;
//# sourceMappingURL=index.d.ts.map