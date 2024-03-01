/// <reference types="node" />
import { Readable } from "stream";
import type AudioFilters from "../../interface/AudioFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListAudioQualityCustomType = void | StreamResult;
export default function ListAudioQualityCustom(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof AudioFilters;
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
    quality: "high" | "medium" | "low" | "ultralow";
}): Promise<ListAudioQualityCustomType[] | any>;
export {};
//# sourceMappingURL=ListAudioQualityCustom.d.ts.map