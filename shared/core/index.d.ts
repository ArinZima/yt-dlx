import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";
import AudioLowest from "./pipes/audio/single/AudioLowest";
import AudioHighest from "./pipes/audio/single/AudioHighest";
import AudioQualityCustom from "./pipes/audio/single/AudioQualityCustom";
import ListAudioLowest from "./pipes/audio/playList/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/playList/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/playList/ListAudioQualityCustom";
import VideoLowest from "./pipes/video/single/VideoLowest";
import VideoHighest from "./pipes/video/single/VideoHighest";
import VideoQualityCustom from "./pipes/video/single/VideoQualityCustom";
import ListVideoLowest from "./pipes/video/playList/ListVideoLowest";
import ListVideoHighest from "./pipes/video/playList/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/playList/ListVideoQualityCustom";
import AudioVideoLowest from "./pipes/mix/single/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/single/AudioVideoHighest";
import AudioVideoQualityCustom from "./pipes/mix/single/AudioVideoQualityCustom.";
import ListAudioVideoHighest from "./pipes/mix/playList/ListAudioVideoHighest";
import ListAudioVideoLowest from "./pipes/mix/playList/ListAudioVideoLowest";
import ListAudioVideoQualityCustom from "./pipes/mix/playList/ListAudioVideoQualityCustom";
declare const ytdlx: () => {
    search: () => {
        VideoInfo: typeof import("./web/api/VideoInfo").default;
        PlaylistInfo: typeof import("./web/api/PlaylistInfo").default;
        SearchVideos: typeof import("./web/api/SearchVideos").default;
    };
    info: () => {
        help: typeof help;
        extract: typeof extract;
        list_formats: typeof list_formats;
        extract_playlist_videos: typeof extract_playlist_videos;
    };
    AudioOnly: () => {
        Single: () => {
            Lowest: typeof AudioLowest;
            Highest: typeof AudioHighest;
            Custom: typeof AudioQualityCustom;
        };
        Playlist: () => {
            Lowest: typeof ListAudioLowest;
            Highest: typeof ListAudioHighest;
            Custom: typeof ListAudioQualityCustom;
        };
    };
    VideoOnly: () => {
        Single: () => {
            Lowest: typeof VideoLowest;
            Highest: typeof VideoHighest;
            Custom: typeof VideoQualityCustom;
        };
        Playlist: () => {
            Lowest: typeof ListVideoLowest;
            Highest: typeof ListVideoHighest;
            Custom: typeof ListVideoQualityCustom;
        };
    };
    AudioVideo: () => {
        Single: () => {
            Lowest: typeof AudioVideoLowest;
            Highest: typeof AudioVideoHighest;
            Custom: typeof AudioVideoQualityCustom;
        };
        Playlist: () => {
            Lowest: typeof ListAudioVideoHighest;
            Highest: typeof ListAudioVideoLowest;
            Custom: typeof ListAudioVideoQualityCustom;
        };
    };
};
export default ytdlx;
//# sourceMappingURL=index.d.ts.map