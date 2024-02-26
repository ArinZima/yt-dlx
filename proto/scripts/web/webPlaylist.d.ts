export interface YouTubePLVideos {
    ago: string;
    videoLink: string;
    title: string;
    views: string;
    author: string;
    videoId: string;
    authorUrl: string;
    thumbnailUrls: string[];
}
export interface webPlaylist {
    views: string;
    count: number;
    title: string;
    description: string;
    videos: YouTubePLVideos[];
}
export default function webPlaylist({ playlistLink, }: {
    playlistLink: string;
}): Promise<webPlaylist | undefined>;
//# sourceMappingURL=webPlaylist.d.ts.map