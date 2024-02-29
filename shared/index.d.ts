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
    meta_audio: {
        codec: string;
        bitrate: number;
        channels: number;
        extension: string;
        samplerate: number;
    };
    meta_video: {
        width: number;
        codec: string;
        height: number;
        bitrate: number;
        extension: string;
        resolution: string;
        aspectratio: number;
    };
    meta_dl: {
        mediaurl: string;
        formatid: string;
        formatnote: string;
        originalformat: string;
    };
    meta_info: {
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

interface StreamResult {
    stream: Readable;
    filename: string;
}

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

type AudioFormat$5 = "mp3" | "ogg" | "flac" | "aiff";
type AudioLowestOC = {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: AudioFormat$5;
    filter?: keyof AudioFilters;
};
type AudioLowestType = Promise<200 | StreamResult>;
declare function AudioLowest(input: AudioLowestOC): AudioLowestType;

type AudioFormat$4 = "mp3" | "ogg" | "flac" | "aiff";
type AudioHighestOC = {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: AudioFormat$4;
    filter?: keyof AudioFilters;
};
type AudioHighestType = Promise<200 | StreamResult>;
declare function AudioHighest(input: AudioHighestOC): AudioHighestType;

interface VideoFilters {
    grayscale: string;
    invert: string;
    rotate90: string;
    rotate180: string;
    rotate270: string;
    flipHorizontal: string;
    flipVertical: string;
}

type VideoFormat$9 = "mp4" | "avi" | "mov";
interface VideoLowestOC$1 {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat$9;
    filter?: keyof VideoFilters;
}
type VideoLowestType$1 = Promise<200 | StreamResult>;
declare function VideoLowest$1(input: VideoLowestOC$1): VideoLowestType$1;

interface ErrorResult {
    message: string;
    status: 500;
}

type VideoFormat$8 = "mp4" | "avi" | "mov";
interface VideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat$8;
    filter?: keyof VideoFilters;
}
type VideoHighestType = Promise<200 | ErrorResult | StreamResult>;
declare function VideoHighest(input: VideoHighestOC): VideoHighestType;

type VideoFormat$7 = "mp4" | "avi" | "mov";
interface AudioVideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat$7;
}
type AudioVideoLowestType = Promise<200 | StreamResult>;
declare function AudioVideoLowest(input: AudioVideoLowestOC): AudioVideoLowestType;

type VideoFormat$6 = "mp4" | "avi" | "mov";
interface AudioVideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat$6;
}
type AudioVideoHighest = Promise<200 | StreamResult>;
declare function AudioVideoHighest(input: AudioVideoHighestOC): AudioVideoHighest;

type AudioFormat$3 = "mp3" | "ogg" | "flac" | "aiff";
type AudioQualities$1 = "high" | "medium" | "low" | "ultralow";
interface AudioQualityCustomOC {
    query: string;
    stream?: boolean;
    folderName?: string;
    quality: AudioQualities$1;
    outputFormat?: AudioFormat$3;
    filter?: keyof AudioFilters;
}
type AudioQualityCustomType = Promise<200 | ErrorResult | StreamResult>;
declare function AudioQualityCustom(input: AudioQualityCustomOC): AudioQualityCustomType;

type VideoFormat$5 = "mp4" | "avi" | "mov";
type VideoQualities$1 = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
interface VideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    quality: VideoQualities$1;
    outputFormat?: VideoFormat$5;
    filter?: keyof VideoFilters;
}
type VideoLowestType = Promise<200 | StreamResult>;
declare function VideoLowest(input: VideoLowestOC): VideoLowestType;

type VideoFormat$4 = "mp4" | "avi" | "mov";
interface ListVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat$4;
    filter?: keyof VideoFilters;
}
type ListVideoLowestType = 200 | StreamResult;
declare function ListVideoLowest(input: ListVideoLowestOC): Promise<ListVideoLowestType[] | any>;

type VideoFormat$3 = "mp4" | "avi" | "mov";
interface ListVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat$3;
    filter?: keyof VideoFilters;
}
type ListVideoHighestType = 200 | ErrorResult | StreamResult;
declare function ListVideoHighest(input: ListVideoHighestOC): Promise<ListVideoHighestType[] | any>;

type VideoFormat$2 = "mp4" | "avi" | "mov";
type VideoQualities = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
interface ListVideoQualityCustomOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    quality: VideoQualities;
    outputFormat?: VideoFormat$2;
    filter?: keyof VideoFilters;
}
type ListVideoQualityCustomType = 200 | StreamResult;
declare function ListVideoQualityCustom(input: ListVideoQualityCustomOC): Promise<ListVideoQualityCustomType[] | any>;

type AudioFormat$2 = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat$2;
    filter?: keyof AudioFilters;
}
type ListAudioLowestType = 200 | StreamResult;
declare function ListAudioLowest(input: ListAudioLowestOC): Promise<ListAudioLowestType[] | any>;

type AudioFormat$1 = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat$1;
    filter?: keyof AudioFilters;
}
type ListAudioHighestType = 200 | StreamResult;
declare function ListAudioHighest(input: ListAudioHighestOC): Promise<ListAudioHighestType[] | any>;

type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
type AudioQualities = "high" | "medium" | "low" | "ultralow";
interface ListAudioQualityCustomOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    quality: AudioQualities;
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
}
type ListAudioQualityCustomType = 200 | StreamResult;
declare function ListAudioQualityCustom(input: ListAudioQualityCustomOC): Promise<ListAudioQualityCustomType[] | any>;

type VideoFormat$1 = "mp4" | "avi" | "mov";
interface ListAudioVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat$1;
}
type ListAudioVideoLowestType = 200 | StreamResult;
declare function ListAudioVideoLowest(input: ListAudioVideoLowestOC): Promise<ListAudioVideoLowestType[]>;

type VideoFormat = "mp4" | "avi" | "mov";
interface ListAudioVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoHighestType = 200 | StreamResult;
declare function ListAudioVideoHighest(input: ListAudioVideoHighestOC): Promise<ListAudioVideoHighestType[]>;

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
