import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface VideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
    outputFormat?: VideoFormat;
}
type VideoLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function VideoLowest(input: VideoLowestOC): VideoLowestType;
export {};
//# sourceMappingURL=VideoQualityCustom.d.ts.map