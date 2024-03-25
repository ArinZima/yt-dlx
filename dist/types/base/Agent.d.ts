import type { EngineOutput } from "./Engine";
/**
 * Fetches data for a YouTube video or search query using yt-dlx.
 *
 * @param query - The YouTube video ID, link, or search query.
 * @param verbose - Optional flag to enable verbose mode.
 * @param onionTor - Optional flag to use Tor network.
 * @returns A Promise that resolves with the engine output containing video metadata.
 * @throws An error if unable to get a response or encounter issues with Tor connection.
 */
export default function Agent({ query, verbose, onionTor, }: {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
}): Promise<EngineOutput>;
//# sourceMappingURL=Agent.d.ts.map