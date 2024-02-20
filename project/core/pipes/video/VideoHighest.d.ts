import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface VideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
type VideoHighestType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function VideoHighest({ query, filter, stream, verbose, folderName, outputFormat, }: VideoHighestOC): VideoHighestType;
export {};
//# sourceMappingURL=VideoHighest.d.ts.map