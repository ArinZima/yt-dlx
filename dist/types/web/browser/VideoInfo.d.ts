export interface InputYouTube {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
    screenshot?: boolean;
}
export interface VideoInfoType {
    views: string;
    title: string;
    author: string;
    videoId: string;
    uploadOn: string;
    videoLink: string;
    thumbnailUrls: string[];
}
export default function VideoInfo(input: InputYouTube): Promise<VideoInfoType | undefined>;
