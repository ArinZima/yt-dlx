import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
type AudioQualities = "high" | "medium" | "low" | "ultralow";
interface AudioQualityCustomOC {
    query: string;
    stream?: boolean;
    folderName?: string;
    quality: AudioQualities;
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
}
type AudioQualityCustomType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function AudioQualityCustom({ query, filter, quality, stream, folderName, outputFormat, }: AudioQualityCustomOC): AudioQualityCustomType;
export {};
//# sourceMappingURL=AudioQualityCustom.d.ts.map