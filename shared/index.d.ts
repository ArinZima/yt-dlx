/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
import { Readable } from 'stream';

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
    videoLink: string;
    title: string;
    views: string;
    author: string;
    videoId: string;
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

interface get_playlistOC {
    playlistUrls: string[];
}
declare function get_playlist({ playlistUrls, }: get_playlistOC): Promise<any>;

declare function list_formats({ query, }: {
    query: string;
}): Promise<any>;

interface VideoData {
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
    duration: VideoDuration;
    age_limit: number;
    live_status: string;
    description: string;
    full_description: string;
    upload_date: string;
    upload_ago: number;
    upload_ago_formatted: UploadAgoObject;
    comment_count: number;
    comment_count_formatted: string;
    channel_id: string;
    channel_name: string;
    channel_url: string;
    channel_follower_count: number;
    channel_follower_count_formatted: string;
}
interface VideoDuration {
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
}
interface UploadAgoObject {
    years: number;
    months: number;
    days: number;
    formatted: string;
}
declare function get_video_data({ query, }: {
    query: string;
}): Promise<VideoData>;

interface extract_playlist_videosOC {
    playlistUrls: string[];
}
declare function extract_playlist_videos({ playlistUrls, }: extract_playlist_videosOC): Promise<any>;

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

interface StreamResult$f {
    stream: Readable;
    filename: string;
}
declare function AudioLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<void | StreamResult$f>;

interface StreamResult$e {
    stream: Readable;
    filename: string;
}
declare function AudioHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<void | StreamResult$e>;

interface VideoFilters {
    grayscale: string;
    invert: string;
    rotate90: string;
    rotate180: string;
    rotate270: string;
    flipHorizontal: string;
    flipVertical: string;
}

interface StreamResult$d {
    stream: Readable;
    filename: string;
}
declare function VideoLowest$1(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | StreamResult$d>;

interface StreamResult$c {
    stream: Readable;
    filename: string;
}
declare function VideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | StreamResult$c>;

interface StreamResult$b {
    stream: Readable;
    filename: string;
}
declare function AudioVideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<void | StreamResult$b>;

interface StreamResult$a {
    stream: Readable;
    filename: string;
}
declare function AudioVideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<void | StreamResult$a>;

interface StreamResult$9 {
    stream: Readable;
    filename: string;
}
declare function AudioQualityCustom(input: {
    query: string;
    stream?: boolean;
    folderName?: string;
    quality: "high" | "medium" | "low" | "ultralow";
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
    filter?: keyof AudioFilters;
}): Promise<void | StreamResult$9>;

interface StreamResult$8 {
    stream: Readable;
    filename: string;
}
declare function VideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    quality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | StreamResult$8>;

interface StreamResult$7 {
    stream: Readable;
    filename: string;
}
type ListVideoLowestType = void | StreamResult$7;
declare function ListVideoLowest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<ListVideoLowestType[] | any>;

interface StreamResult$6 {
    stream: Readable;
    filename: string;
}
type ListVideoHighestType = void | StreamResult$6;
declare function ListVideoHighest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<ListVideoHighestType[] | any>;

interface StreamResult$5 {
    stream: Readable;
    filename: string;
}
type ListVideoQualityCustomType = void | StreamResult$5;
declare function ListVideoQualityCustom(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof VideoFilters;
    quality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<ListVideoQualityCustomType[] | any>;

interface StreamResult$4 {
    stream: Readable;
    filename: string;
}
type ListAudioLowestType = void | StreamResult$4;
declare function ListAudioLowest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<ListAudioLowestType[] | any>;

interface StreamResult$3 {
    stream: Readable;
    filename: string;
}
type ListAudioHighestType = void | StreamResult$3;
declare function ListAudioHighest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<ListAudioHighestType[] | any>;

interface StreamResult$2 {
    stream: Readable;
    filename: string;
}
type ListAudioQualityCustomType = void | StreamResult$2;
declare function ListAudioQualityCustom(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
    quality: "high" | "medium" | "low" | "ultralow";
}): Promise<ListAudioQualityCustomType[] | any>;

interface StreamResult$1 {
    stream: Readable;
    filename: string;
}
type ListAudioVideoLowestType = void | StreamResult$1;
declare function ListAudioVideoLowest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<ListAudioVideoLowestType[]>;

interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListAudioVideoHighestType = void | StreamResult;
declare function ListAudioVideoHighest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<ListAudioVideoHighestType[]>;

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
            lowest: typeof VideoLowest$1;
            highest: typeof VideoHighest;
            custom: typeof VideoLowest;
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

export { ytdlx as default };
/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */
