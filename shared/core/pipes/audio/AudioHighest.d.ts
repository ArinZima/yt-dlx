import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
type AudioHighestOC = {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
};
type AudioHighestType = Promise<true | StreamResult>;
export default function AudioHighest(input: AudioHighestOC): AudioHighestType;
export {};
//# sourceMappingURL=AudioHighest.d.ts.map