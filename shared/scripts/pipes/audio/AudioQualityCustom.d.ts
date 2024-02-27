import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
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
export default function AudioQualityCustom(input: AudioQualityCustomOC): AudioQualityCustomType;
export {};
//# sourceMappingURL=AudioQualityCustom.d.ts.map