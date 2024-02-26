export interface WebVideo {
    thumbnailUrls: string[];
    videoLink: string;
    uploadOn: string;
    videoId: string;
    author: string;
    title: string;
    views: string;
}
export default function webVideo({ videoLink, }: {
    videoLink: string;
}): Promise<WebVideo | undefined>;
//# sourceMappingURL=webVideo.d.ts.map