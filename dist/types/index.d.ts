import help from "./routes/command/help";
import extract from "./routes/command/extract";
import list_formats from "./routes/command/list_formats";
import video_data from "./routes/command/video_data";
import search_videos from "./routes/command/search_videos";
import playlist_data from "./routes/command/playlist_data";
import search_playlists from "./routes/command/search_playlists";
import AudioLowest from "./routes/Audio/single/AudioLowest";
import AudioHighest from "./routes/Audio/single/AudioHighest";
import ListAudioLowest from "./routes/Audio/list/ListAudioLowest";
import ListAudioHighest from "./routes/Audio/list/ListAudioHighest";
import VideoLowest from "./routes/Video/single/VideoLowest";
import VideoHighest from "./routes/Video/single/VideoHighest";
import ListVideoLowest from "./routes/Video/list/ListVideoLowest";
import ListVideoHighest from "./routes/Video/list/ListVideoHighest";
import AudioVideoHighest from "./routes/AudioVideo/single/AudioVideoHighest";
import AudioVideoLowest from "./routes/AudioVideo/single/AudioVideoLowest";
import ListAudioVideoHighest from "./routes/AudioVideo/list/ListAudioVideoHighest";
import ListAudioVideoLowest from "./routes/AudioVideo/list/ListAudioVideoLowest";
declare const ytdlx: {
    ytSearch: {
        video: {
            single: typeof video_data;
            multiple: typeof search_videos;
        };
        playlist: {
            single: typeof playlist_data;
            multiple: typeof search_playlists;
        };
    };
    info: {
        help: typeof help;
        extract: typeof extract;
        list_formats: typeof list_formats;
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
