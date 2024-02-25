export default function search({ query, number, }: {
    query: string;
    number: number;
}): Promise<import("../../web/webSearch").webSearch[] | {
    message: string;
    status: number;
} | undefined>;
//# sourceMappingURL=search.d.ts.map