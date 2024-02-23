import help from "./pipes/command/help";
import search from "./pipes/command/search";
import extract from "./pipes/command/extract";
import get_playlist from "./pipes/command/get_playlist";
import list_formats from "./pipes/command/list_formats";
import get_video_data from "./pipes/command/get_video_data";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";
import AudioLowest from "./pipes/audio/AudioLowest";
import AudioHighest from "./pipes/audio/AudioHighest";
import VideoLowest from "./pipes/video/VideoLowest";
import VideoHighest from "./pipes/video/VideoHighest";
import AudioVideoLowest from "./pipes/mix/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/AudioVideoHighest";
import AudioQualityCustom from "./pipes/audio/AudioQualityCustom";
import VideoQualityCustom from "./pipes/video/VideoQualityCustom";
import ListVideoLowest from "./pipes/video/ListVideoLowest";
import ListVideoHighest from "./pipes/video/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/ListVideoQualityCustom";
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/ListAudioQualityCustom";
import ListAudioVideoLowest from "./pipes/mix/ListAudioVideoLowest";
import ListAudioVideoHighest from "./pipes/mix/ListAudioVideoHighest";
declare const ytdlp: {
    info: {
        help: typeof help;
        search: typeof search;
        extract: typeof extract;
        list_formats: typeof list_formats;
        get_playlist: typeof get_playlist;
        get_video_data: typeof get_video_data;
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
        };
        playlist: {
            lowest: typeof ListAudioVideoLowest;
            highest: typeof ListAudioVideoHighest;
        };
    };
};
export default ytdlp;
//# sourceMappingURL=index.d.ts.map