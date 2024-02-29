import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
}
type ListAudioLowestType = true | StreamResult;
export default function ListAudioLowest(input: ListAudioLowestOC): Promise<ListAudioLowestType[] | any>;
export {};
//# sourceMappingURL=ListAudioLowest.d.ts.map