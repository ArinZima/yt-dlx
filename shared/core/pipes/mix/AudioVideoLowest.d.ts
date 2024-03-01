import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "webm" | "avi" | "mov";
interface AudioVideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
export default function AudioVideoLowest(input: AudioVideoLowestOC): Promise<true | StreamResult>;
export {};
//# sourceMappingURL=AudioVideoLowest.d.ts.map