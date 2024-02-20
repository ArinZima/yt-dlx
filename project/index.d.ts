/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands out as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
import { Readable } from 'stream';

declare function help(): Promise<string>;

declare function search({ query }: {
    query: string;
}): Promise<string | {
    message: string;
    status: number;
} | null>;

declare function extract({ query }: {
    query: string;
}): Promise<any>;

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

/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands ipop as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
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

/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands ipop as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
interface SuccessResult {
    status: 200;
    message: string;
}

/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands ipop as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */

interface StreamResult {
    stream: Readable;
    filename: string;
}

/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands ipop as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
interface ErrorResult {
    message: string;
    status: 500;
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
type AudioLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function AudioLowest({ query, filter, stream, verbose, folderName, outputFormat, }: AudioLowestOC): AudioLowestType;

type AudioFormat$4 = "mp3" | "ogg" | "flac" | "aiff";
type AudioHighestOC = {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: AudioFormat$4;
    filter?: keyof AudioFilters;
};
type AudioHighestType = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function AudioHighest({ query, filter, stream, verbose, folderName, outputFormat, }: AudioHighestOC): AudioHighestType;

/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands ipop as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
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
interface VideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    outputFormat?: VideoFormat$9;
}
type VideoLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function VideoLowest({ query, filter, stream, verbose, folderName, outputFormat, }: VideoLowestOC): VideoLowestType;

type VideoFormat$8 = "mp4" | "avi" | "mov";
interface VideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat$8;
    filter?: keyof VideoFilters;
}
type VideoHighestType = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function VideoHighest({ query, filter, stream, verbose, folderName, outputFormat, }: VideoHighestOC): VideoHighestType;

type VideoFormat$7 = "mp4" | "avi" | "mov";
interface AudioVideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat$7;
}
type AudioVideoLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function AudioVideoLowest({ query, stream, verbose, folderName, outputFormat, }: AudioVideoLowestOC): AudioVideoLowestType;

type VideoFormat$6 = "mp4" | "avi" | "mov";
interface AudioVideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat$6;
}
type AudioVideoHighest = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function AudioVideoHighest({ query, stream, verbose, folderName, outputFormat, }: AudioVideoHighestOC): AudioVideoHighest;

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
type AudioQualityCustomType = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function AudioQualityCustom({ query, filter, quality, stream, folderName, outputFormat, }: AudioQualityCustomOC): AudioQualityCustomType;

type VideoFormat$5 = "mp4" | "avi" | "mov";
type VideoQualities$1 = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
interface VideoQualityCustomOC {
    query: string;
    stream?: boolean;
    folderName?: string;
    quality: VideoQualities$1;
    outputFormat?: VideoFormat$5;
    filter?: keyof VideoFilters;
}
type VideoQualityCustomType = Promise<SuccessResult | ErrorResult | StreamResult>;
declare function VideoQualityCustom({ query, filter, quality, stream, folderName, outputFormat, }: VideoQualityCustomOC): VideoQualityCustomType;

type VideoFormat$4 = "mp4" | "avi" | "mov";
interface ListVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat$4;
    filter?: keyof VideoFilters;
}
type ListVideoLowestType = SuccessResult | ErrorResult | StreamResult;
declare function ListVideoLowest({ filter, stream, verbose, folderName, playlistUrls, outputFormat, }: ListVideoLowestOC): Promise<ListVideoLowestType[]>;

type VideoFormat$3 = "mp4" | "avi" | "mov";
interface ListVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat$3;
    filter?: keyof VideoFilters;
}
type ListVideoHighestType = SuccessResult | ErrorResult | StreamResult;
declare function ListVideoHighest({ filter, stream, verbose, folderName, playlistUrls, outputFormat, }: ListVideoHighestOC): Promise<ListVideoHighestType[]>;

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
type ListVideoQualityCustomType = SuccessResult | ErrorResult | StreamResult;
declare function ListVideoQualityCustom({ filter, stream, quality, verbose, folderName, playlistUrls, outputFormat, }: ListVideoQualityCustomOC): Promise<ListVideoQualityCustomType[]>;

type AudioFormat$2 = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat$2;
    filter?: keyof AudioFilters;
}
type ListAudioLowestType = SuccessResult | ErrorResult | StreamResult;
declare function ListAudioLowest({ filter, stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioLowestOC): Promise<ListAudioLowestType[]>;

type AudioFormat$1 = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat$1;
    filter?: keyof AudioFilters;
}
type ListAudioHighestType = SuccessResult | ErrorResult | StreamResult;
declare function ListAudioHighest({ filter, stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioHighestOC): Promise<ListAudioHighestType[]>;

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
type ListAudioQualityCustomType = SuccessResult | ErrorResult | StreamResult;
declare function ListAudioQualityCustom({ filter, stream, quality, verbose, folderName, playlistUrls, outputFormat, }: ListAudioQualityCustomOC): Promise<ListAudioQualityCustomType[]>;

type VideoFormat$1 = "mp4" | "avi" | "mov";
interface ListAudioVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat$1;
}
type ListAudioVideoLowestType = SuccessResult | ErrorResult | StreamResult;
declare function ListAudioVideoLowest({ stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioVideoLowestOC): Promise<ListAudioVideoLowestType[]>;

type VideoFormat = "mp4" | "avi" | "mov";
interface ListAudioVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoHighestType = SuccessResult | ErrorResult | StreamResult;
declare function ListAudioVideoHighest({ stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioVideoHighestOC): Promise<ListAudioVideoHighestType[]>;

declare const ytCore: {
    info: {
        help: typeof help;
        extract: typeof extract;
        search: typeof search;
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

export { ytCore as default };
/**
 * ============================================[ 📢YOUTUBE DOWNLOADER CORE <( YT-CORE )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-CORE—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-CORE stands out as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-core.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */
