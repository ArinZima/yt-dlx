/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
import { FfmpegCommand } from 'fluent-ffmpeg';

interface IpOp {
    query: string;
    verbose?: boolean;
    autoSocks5?: boolean;
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

interface InputYouTube$1 {
    query: string;
    verbose?: boolean;
    autoSocks5?: boolean;
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
declare function PlaylistInfo(input: InputYouTube$1): Promise<PlaylistInfoType | undefined>;

interface InputYouTube {
    query: string;
    verbose?: boolean;
    autoSocks5?: boolean;
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
declare function VideoInfo(input: InputYouTube): Promise<VideoInfoType | undefined>;

declare function help(): Promise<string>;

interface TubeConfig {
    Audio: {
        codec: string;
        bitrate: number;
        channels: number;
        extension: string;
        samplerate: number;
    };
    Video: {
        width: number;
        codec: string;
        height: number;
        bitrate: number;
        extension: string;
        resolution: string;
        aspectratio: number;
    };
    AVDownload: {
        mediaurl: string;
        formatid: string;
        formatnote: string;
        originalformat: string;
    };
    AVInfo: {
        dynamicrange: string;
        totalbitrate: number;
        filesizebytes: number;
        framespersecond: number;
        qriginalextension: string;
        extensionconatainer: string;
        filesizeformatted: string | number;
    };
}

declare function extract({ query, verbose, }: {
    query: string;
    verbose?: boolean;
}): Promise<{
    audio_data: TubeConfig[];
    video_data: TubeConfig[];
    hdrvideo_data: TubeConfig[];
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
        live_status: string;
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

declare function list_formats({ query, verbose, }: {
    query: string;
    verbose?: boolean;
}): Promise<any>;

interface EngineData {
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
    view_count: number;
    like_count: number;
    description: string;
    channel_url: string;
    webpage_url: string;
    live_status: string;
    upload_date: string;
    uploader_id: string;
    original_url: string;
    uploader_url: string;
    comment_count: number;
    duration_string: string;
    channel_follower_count: number;
}
interface EngineResult {
    ipAddress: string;
    metaTube: EngineData;
    AudioStore: TubeConfig[];
    VideoStore: TubeConfig[];
    HDRVideoStore: TubeConfig[];
}

declare function extract_playlist_videos({ autoSocks5, playlistUrls, }: {
    autoSocks5?: boolean;
    playlistUrls: string[];
}): Promise<EngineResult[]>;

declare function AudioLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    autoSocks5?: boolean;
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
    autoSocks5?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function AudioQualityCustom(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    autoSocks5?: boolean;
    quality: "high" | "medium" | "low" | "ultralow";
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListAudioLowest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void>;

declare function ListAudioHighest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void>;

declare function ListAudioQualityCustom(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    quality: "high" | "medium" | "low" | "ultralow";
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void>;

declare function VideoLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    autoSocks5?: boolean;
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
    autoSocks5?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function VideoQualityCustom(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    autoSocks5?: boolean;
    quality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListVideoLowest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListVideoHighest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListVideoQualityCustom(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    quality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
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
    autoSocks5?: boolean;
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
    autoSocks5?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function AudioVideoQualityCustom(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    autoSocks5?: boolean;
    AQuality: "high" | "medium" | "low" | "ultralow";
    VQuality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListAudioVideoHighest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListAudioVideoLowest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare function ListAudioVideoQualityCustom(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    autoSocks5?: boolean;
    AQuality: "high" | "medium" | "low" | "ultralow";
    VQuality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;

declare const ytdlx: () => {
    search: () => {
        VideoInfo: typeof VideoInfo;
        PlaylistInfo: typeof PlaylistInfo;
        SearchVideos: typeof SearchVideos;
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
        List: () => {
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
        List: () => {
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
        List: () => {
            Lowest: typeof ListAudioVideoHighest;
            Highest: typeof ListAudioVideoLowest;
            Custom: typeof ListAudioVideoQualityCustom;
        };
    };
};

export { ytdlx as default };
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
