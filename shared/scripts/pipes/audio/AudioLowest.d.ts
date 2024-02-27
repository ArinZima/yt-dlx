import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
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
export default function AudioLowest(input: AudioLowestOC): AudioLowestType;
export {};
//# sourceMappingURL=AudioLowest.d.ts.map