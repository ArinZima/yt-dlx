export interface webVideo {
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
}): Promise<webVideo | undefined>;
//# sourceMappingURL=webVideo.d.ts.map