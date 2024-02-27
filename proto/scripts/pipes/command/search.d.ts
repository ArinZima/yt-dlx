export default function search({ query }: {
    query: string;
}): Promise<import("../../web/webSearch").webSearch[] | {
    message: string;
    status: number;
} | undefined>;
//# sourceMappingURL=search.d.ts.map