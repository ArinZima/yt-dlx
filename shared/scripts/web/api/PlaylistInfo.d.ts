export interface InputYouTube {
    query: string;
    screenshot?: boolean;
}
export interface PlaylistVideos {
    ago: string;
    videoLink: string;
    title: string;
    views: string;
    author: string;
    videoId: string;
    authorUrl: string;
    thumbnailUrls: string[];
}
export interface PlaylistInfoType {
    playlistViews: number;
    playlistTitle: string;
    playlistVideoCount: number;
    playlistDescription: string;
    playlistVideos: PlaylistVideos[];
}
export default function PlaylistInfo(input: InputYouTube): Promise<PlaylistInfoType | undefined>;
//# sourceMappingURL=PlaylistInfo.d.ts.map