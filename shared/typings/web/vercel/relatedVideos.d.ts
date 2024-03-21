export interface relatedVideosType {
    id: string;
    title: string;
    isLive: boolean;
    duration: number;
    uploadDate: string;
    thumbnails: string[];
}
export default function relatedVideos({ videoId }: {
    videoId: string;
}): Promise<any>;
//# sourceMappingURL=relatedVideos.d.ts.map