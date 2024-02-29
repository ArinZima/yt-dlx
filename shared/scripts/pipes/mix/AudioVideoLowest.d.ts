import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
type AudioVideoLowestType = Promise<200 | StreamResult>;
export default function AudioVideoLowest(input: AudioVideoLowestOC): AudioVideoLowestType;
export {};
//# sourceMappingURL=AudioVideoLowest.d.ts.map