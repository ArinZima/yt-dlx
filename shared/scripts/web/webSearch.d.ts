export interface webSearch {
    title?: string;
    views?: string;
    author?: string;
    videoId: string;
    uploadOn?: string;
    videoLink: string;
    authorUrl?: string;
    description?: string;
    authorImage?: string;
    thumbnailUrls?: string[];
}
export default function webSearch({ query, }: {
    query: string;
}): Promise<webSearch[] | undefined>;
//# sourceMappingURL=webSearch.d.ts.map