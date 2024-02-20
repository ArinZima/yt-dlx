export interface ScrapeResult {
    stdout: string | null;
    stderr: string | null;
    status: number;
}
export default function scrape(query: string): Promise<ScrapeResult>;
//# sourceMappingURL=scrape.d.ts.map