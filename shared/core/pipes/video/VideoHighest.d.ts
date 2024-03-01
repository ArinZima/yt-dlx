/// <reference types="node" />
import { Readable } from "stream";
import type VideoFilters from "../../interface/VideoFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
export default function VideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | StreamResult>;
export {};
//# sourceMappingURL=VideoHighest.d.ts.map