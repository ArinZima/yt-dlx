/// <reference types="node" />
import { Readable } from "stream";
import type AudioFilters from "../../interface/AudioFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
export default function AudioQualityCustom(input: {
    query: string;
    stream?: boolean;
    folderName?: string;
    quality: "high" | "medium" | "low" | "ultralow";
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
    filter?: keyof AudioFilters;
}): Promise<void | StreamResult>;
export {};
//# sourceMappingURL=AudioQualityCustom.d.ts.map