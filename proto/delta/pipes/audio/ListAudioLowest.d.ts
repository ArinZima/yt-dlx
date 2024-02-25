import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
}
type ListAudioLowestType = SuccessResult | ErrorResult | StreamResult;
export default function ListAudioLowest(input: ListAudioLowestOC): Promise<ListAudioLowestType[] | any>;
export {};
//# sourceMappingURL=ListAudioLowest.d.ts.map