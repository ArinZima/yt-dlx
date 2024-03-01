/// <reference types="node" />
import { Readable } from "stream";
import type AudioFilters from "../../interface/AudioFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListAudioLowestType = void | StreamResult;
export default function ListAudioLowest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<ListAudioLowestType[] | any>;
export {};
//# sourceMappingURL=ListAudioLowest.d.ts.map