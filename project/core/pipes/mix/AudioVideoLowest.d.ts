import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
type AudioVideoLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function AudioVideoLowest({ query, stream, verbose, folderName, outputFormat, }: AudioVideoLowestOC): AudioVideoLowestType;
export {};
//# sourceMappingURL=AudioVideoLowest.d.ts.map