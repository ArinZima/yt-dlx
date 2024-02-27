import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type SuccessResult from "../../interface/SuccessResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
type AudioVideoLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function AudioVideoLowest(input: AudioVideoLowestOC): AudioVideoLowestType;
export {};
//# sourceMappingURL=AudioVideoLowest.d.ts.map