export interface InputYouTube {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
    screenshot?: boolean;
}
export interface PlaylistInfoType {
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
export default function PlaylistInfo(input: InputYouTube): Promise<PlaylistInfoType | undefined>;
//# sourceMappingURL=PlaylistInfo.d.ts.map