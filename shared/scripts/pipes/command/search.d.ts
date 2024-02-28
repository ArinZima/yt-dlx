export default function search({ query }: {
    query: string;
}): Promise<import("../../web/ytdlx_web").TypeVideo[] | import("../../web/ytdlx_web").TypePlaylist[] | {
    message: string;
    status: number;
} | undefined>;
//# sourceMappingURL=search.d.ts.map