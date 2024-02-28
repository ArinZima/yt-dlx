import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
}
type ListAudioHighestType = SuccessResult | ErrorResult | StreamResult;
export default function ListAudioHighest(input: ListAudioHighestOC): Promise<ListAudioHighestType[] | any>;
export {};
//# sourceMappingURL=ListAudioHighest.d.ts.map