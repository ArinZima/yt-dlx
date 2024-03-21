export interface playlistVideosType {
    id: string;
    title: string;
    videoCount: number;
    thumbnails: string[];
}
export default function playlistVideos({ playlistId, }: {
    playlistId: string;
}): Promise<any>;
//# sourceMappingURL=playlistVideos.d.ts.map