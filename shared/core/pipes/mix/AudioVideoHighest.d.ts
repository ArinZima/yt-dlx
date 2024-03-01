import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "webm" | "avi" | "mov";
interface AudioVideoHighestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
}
export default function AudioVideoHighest(input: AudioVideoHighestOC): Promise<true | StreamResult>;
export {};
//# sourceMappingURL=AudioVideoHighest.d.ts.map