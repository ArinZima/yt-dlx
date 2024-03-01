import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "webm" | "avi" | "mov";
interface AudioVideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
type AudioVideoHighest = Promise<true | StreamResult>;
export default function AudioVideoHighest(input: AudioVideoHighestOC): AudioVideoHighest;
export {};
//# sourceMappingURL=AudioVideoHighest.d.ts.map