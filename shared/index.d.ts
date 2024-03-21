/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
import { FfmpegCommand } from 'fluent-ffmpeg';

declare function singleVideo({ videoId }: {
    videoId: string;
}): Promise<any>;

declare function searchVideos({ query }: {
    query: string;
}): Promise<any>;

declare function searchPlaylists({ query }: {
    query: string;
}): Promise<any>;

declare function relatedVideos({ videoId }: {
    videoId: string;
}): Promise<any>;

declare function playlistVideos({ playlistId, }: {
    playlistId: string;
}): Promise<any>;

interface InputYouTube$1 {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
    screenshot?: boolean;
}
interface VideoInfoType {
    views: string;
    title: string;
    author: string;
    videoId: string;
    uploadOn: string;
    videoLink: string;
    thumbnailUrls: string[];
}
declare function VideoInfo$1(input: InputYouTube$1): Promise<VideoInfoType | undefined>;

interface InputYouTube {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
    screenshot?: boolean;
}
interface PlaylistInfoType {
    playlistViews: number;
    playlistTitle: string;
    playlistVideoCount: number;
    playlistDescription: string;
    playlistVideos: {
        ago: string;
        title: string;
        views: string;
        author: string;
        videoId: string;
        videoLink: string;
        authorUrl: string;
        thumbnailUrls: string[];
    }[];
}
declare function PlaylistInfo(input: InputYouTube): Promise<PlaylistInfoType | undefined>;

interface IpOp {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
    screenshot?: boolean;
    type: keyof {
        video: "video";
        playlist: "playlist";
    };
}
interface TypePlaylist {
    playlistId: string;
    playlistLink: string;
    title: string | undefined;
    author: string | undefined;
    authorUrl: string | undefined;
    videoCount: number | undefined;
}
interface TypeVideo {
    videoId: string;
    videoLink: string;
    thumbnailUrls: string[];
    title: string | undefined;
    views: string | undefined;
    author: string | undefined;
    uploadOn: string | undefined;
    authorUrl: string | undefined;
    description: string | undefined;
}
declare function SearchVideos(input: IpOp): Promise<TypeVideo[] | TypePlaylist[] | undefined>;

declare function help(): Promise<string>;

interface AudioFormat {
    filesize: number;
    filesizeP: string | number;
    asr: number;
    format_note: string;
    tbr: number;
    url: string;
    ext: string;
    acodec: string;
    container: string;
    resolution: string;
    audio_ext: string;
    abr: number;
    format: string;
}
interface VideoFormat {
    filesize: number;
    filesizeP: string | number;
    format_note: string;
    fps: number;
    height: number;
    width: number;
    tbr: number;
    url: string;
    ext: string;
    vcodec: string;
    dynamic_range: string;
    container: string;
    resolution: string;
    aspect_ratio: number;
    video_ext: string;
    vbr: number;
    format: string;
}
interface ManifestFormat {
    url: string;
    manifest_url: string;
    tbr: number;
    ext: string;
    fps: number;
    width: number;
    height: number;
    vcodec: string;
    dynamic_range: string;
    aspect_ratio: number;
    video_ext: string;
    vbr: number;
    format: string;
}
interface VideoInfo {
    id: string;
    title: string;
    channel: string;
    uploader: string;
    duration: number;
    thumbnail: string;
    age_limit: number;
    channel_id: string;
    categories: string[];
    display_id: string;
    description: string;
    channel_url: string;
    webpage_url: string;
    live_status: boolean;
    view_count: number;
    like_count: number;
    comment_count: number;
    channel_follower_count: number;
    upload_date: string;
    uploader_id: string;
    original_url: string;
    uploader_url: string;
    duration_string: string;
}
interface EngineOutput {
    ipAddress: string;
    metaData: VideoInfo;
    AudioLowF: AudioFormat;
    AudioHighF: AudioFormat;
    VideoLowF: VideoFormat;
    VideoHighF: VideoFormat;
    AudioLowDRC: AudioFormat[];
    AudioHighDRC: AudioFormat[];
    AudioLow: AudioFormat[];
    AudioHigh: AudioFormat[];
    VideoLowHDR: VideoFormat[];
    VideoHighHDR: VideoFormat[];
    VideoLow: VideoFormat[];
    VideoHigh: VideoFormat[];
    ManifestLow: ManifestFormat[];
    ManifestHigh: ManifestFormat[];
}

declare function extract({ query, verbose, onionTor, }: {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
}): Promise<{
    ipAddress: string;
    AudioLowF: AudioFormat;
    AudioHighF: AudioFormat;
    VideoLowF: VideoFormat;
    VideoHighF: VideoFormat;
    AudioLowDRC: AudioFormat[];
    AudioHighDRC: AudioFormat[];
    AudioLow: AudioFormat[];
    AudioHigh: AudioFormat[];
    VideoLowHDR: VideoFormat[];
    VideoHighHDR: VideoFormat[];
    VideoLow: VideoFormat[];
    VideoHigh: VideoFormat[];
    ManifestLow: ManifestFormat[];
    ManifestHigh: ManifestFormat[];
    meta_data: {
        id: string;
        original_url: string;
        webpage_url: string;
        title: string;
        view_count: number;
        like_count: number;
        view_count_formatted: string;
        like_count_formatted: string;
        uploader: string;
        uploader_id: string;
        uploader_url: string;
        thumbnail: string;
        categories: string[];
        time: number;
        duration: {
            hours: number;
            minutes: number;
            seconds: number;
            formatted: string;
        };
        age_limit: number;
        live_status: boolean;
        description: string;
        full_description: string;
        upload_date: string;
        upload_ago: number;
        upload_ago_formatted: {
            years: number;
            months: number;
            days: number;
            formatted: string;
        };
        comment_count: number;
        comment_count_formatted: string;
        channel_id: string;
        channel_name: string;
        channel_url: string;
        channel_follower_count: number;
        channel_follower_count_formatted: string;
    };
} | {
    message: string;
    status: number;
}>;

declare function list_formats({ query, verbose, onionTor, }: {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
}): Promise<void>;

declare function extract_playlist_videos({ playlistUrls, }: {
    playlistUrls: string[];
}): Promise<EngineOutput[]>;

declare function AudioLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function AudioHighest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListAudioLowest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void>;

declare function ListAudioHighest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void>;

declare function VideoLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function VideoHighest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListVideoLowest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListVideoHighest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function AudioVideoHighest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function AudioVideoLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListAudioVideoHighest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListAudioVideoLowest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare const ytdlx: {
    search: {
        browser: {
            SearchVideos: typeof SearchVideos;
            PlaylistInfo: typeof PlaylistInfo;
            VideoInfo: typeof VideoInfo$1;
        };
        browserLess: {
            playlistVideos: typeof playlistVideos;
            relatedVideos: typeof relatedVideos;
            searchPlaylists: typeof searchPlaylists;
            searchVideos: typeof searchVideos;
            singleVideo: typeof singleVideo;
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

export { ytdlx as default };
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
