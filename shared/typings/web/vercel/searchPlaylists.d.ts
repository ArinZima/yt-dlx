export interface searchPlaylistsType {
    id: string;
    title: string;
    videoCount: number;
    thumbnails: string[];
}
export default function searchPlaylists({ query }: {
    query: string;
}): Promise<any>;
//# sourceMappingURL=searchPlaylists.d.ts.map