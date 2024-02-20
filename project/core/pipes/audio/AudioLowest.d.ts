import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
type AudioLowestOC = {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
};
type AudioLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function AudioLowest({ query, filter, stream, verbose, folderName, outputFormat, }: AudioLowestOC): AudioLowestType;
export {};
//# sourceMappingURL=AudioLowest.d.ts.map