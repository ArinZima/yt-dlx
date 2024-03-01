/// <reference types="node" />
import { Readable } from "stream";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListAudioVideoLowestType = void | StreamResult;
export default function ListAudioVideoLowest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<ListAudioVideoLowestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoLowest.d.ts.map