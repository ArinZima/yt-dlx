export default function search({ query }: {
    query: string;
}): Promise<import("../../web").TypeVideo[] | import("../../web").TypePlaylist[] | {
    message: string;
    status: number;
} | undefined>;
//# sourceMappingURL=search.d.ts.map