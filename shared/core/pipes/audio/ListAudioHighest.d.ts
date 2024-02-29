import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
}
type ListAudioHighestType = 200 | StreamResult;
export default function ListAudioHighest(input: ListAudioHighestOC): Promise<ListAudioHighestType[] | any>;
export {};
//# sourceMappingURL=ListAudioHighest.d.ts.map