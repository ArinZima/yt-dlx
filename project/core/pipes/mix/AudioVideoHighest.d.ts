import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
type AudioVideoHighest = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function AudioVideoHighest({ query, stream, verbose, folderName, outputFormat, }: AudioVideoHighestOC): AudioVideoHighest;
export {};
//# sourceMappingURL=AudioVideoHighest.d.ts.map