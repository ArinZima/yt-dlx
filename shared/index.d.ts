/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
import fluentffmpeg from 'fluent-ffmpeg';

interface InputYouTube$1 {
    query: string;
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
declare function VideoInfo(input: InputYouTube$1): Promise<VideoInfoType | undefined>;

interface IpOp {
    query: string;
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

interface InputYouTube {
    query: string;
    screenshot?: boolean;
}
interface PlaylistVideos {
    ago: string;
    title: string;
    views: string;
    author: string;
    videoId: string;
    videoLink: string;
    authorUrl: string;
    thumbnailUrls: string[];
}
interface PlaylistInfoType {
    playlistViews: number;
    playlistTitle: string;
    playlistVideoCount: number;
    playlistDescription: string;
    playlistVideos: PlaylistVideos[];
}
declare function PlaylistInfo(input: InputYouTube): Promise<PlaylistInfoType | undefined>;

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

declare function extract({ query }: {
    query: string;
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
    message: any;
    status: number;
}>;

declare function list_formats({ query, }: {
    query: string;
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
    metaTube: EngineData;
    AudioStore: TubeConfig[];
    VideoStore: TubeConfig[];
    HDRVideoStore: TubeConfig[];
}

declare function extract_playlist_videos({ playlistUrls, }: {
    playlistUrls: string[];
}): Promise<EngineResult[]>;

interface AudioFilters {
    bassboost: string;
    echo: string;
    flanger: string;
    nightcore: string;
    panning: string;
    phaser: string;
    reverse: string;
    slow: string;
    speed: string;
    subboost: string;
    superslow: string;
    superspeed: string;
    surround: string;
    vaporwave: string;
    vibrato: string;
}

declare function AudioLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

declare function AudioHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

interface VideoFilters {
    grayscale: string;
    invert: string;
    rotate90: string;
    rotate180: string;
    rotate270: string;
    flipHorizontal: string;
    flipVertical: string;
}

declare function VideoLowest$1(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

declare function VideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

declare function AudioVideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

declare function AudioVideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

declare function AudioQualityCustom(input: {
    query: string;
    stream?: boolean;
    folderName?: string;
    quality: "high" | "medium" | "low" | "ultralow";
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
    filter?: keyof AudioFilters;
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

declare function VideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    quality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;

declare const ytdlx: {
    search: {
        PlaylistInfo: typeof PlaylistInfo;
        SearchVideos: typeof SearchVideos;
        VideoInfo: typeof VideoInfo;
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
        lowest: typeof VideoLowest$1;
        highest: typeof VideoHighest;
        custom: typeof VideoLowest;
    };
    audio_video: {
        lowest: typeof AudioVideoLowest;
        highest: typeof AudioVideoHighest;
    };
};

export { ytdlx as default };
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
