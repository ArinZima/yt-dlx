import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
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
export default function VideoLowest({ query, filter, stream, verbose, folderName, outputFormat, }: VideoLowestOC): VideoLowestType;
export {};
//# sourceMappingURL=VideoLowest.d.ts.map