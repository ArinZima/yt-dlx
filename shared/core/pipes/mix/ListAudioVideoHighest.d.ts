/// <reference types="node" />
import { Readable } from "stream";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListAudioVideoHighestType = void | StreamResult;
export default function ListAudioVideoHighest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<ListAudioVideoHighestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoHighest.d.ts.map