/// <reference types="node" />
import { Readable } from "stream";
import type AudioFilters from "../../interface/AudioFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
export default function AudioLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<void | StreamResult>;
export {};
//# sourceMappingURL=AudioLowest.d.ts.map