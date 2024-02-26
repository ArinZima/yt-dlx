import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type SuccessResult from "../../interface/SuccessResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
type AudioVideoHighest = Promise<SuccessResult | ErrorResult | StreamResult>;
export default function AudioVideoHighest(input: AudioVideoHighestOC): AudioVideoHighest;
export {};
//# sourceMappingURL=AudioVideoHighest.d.ts.map