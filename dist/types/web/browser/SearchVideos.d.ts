export interface IpOp {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
    screenshot?: boolean;
    type: keyof {
        video: "video";
        playlist: "playlist";
    };
}
export interface TypePlaylist {
    playlistId: string;
    playlistLink: string;
    title: string | undefined;
    author: string | undefined;
    authorUrl: string | undefined;
    videoCount: number | undefined;
}
export interface TypeVideo {
    videoId: string;
    videoLink: string;
    thumbnailUrls: string[];
    title: string | undefined;
    views: string | undefined;
    author: string | undefined;
    uploadOn: string | undefined;
    authorUrl: string | undefined;
    description: string | undefined;
}
export default function SearchVideos(input: IpOp): Promise<TypeVideo[] | TypePlaylist[] | undefined>;
