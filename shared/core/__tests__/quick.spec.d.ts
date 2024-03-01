/// <reference types="node" />
import { Readable } from "stream";
import type AudioFilters from "../interface/AudioFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListAudioHighestType = void | StreamResult;
export default function ListAudioHighest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<ListAudioHighestType[] | any>;
export {};
//# sourceMappingURL=quick.spec.d.ts.map