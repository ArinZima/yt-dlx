import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
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
export default function ListAudioLowest({ filter, stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioLowestOC): Promise<ListAudioLowestType[]>;
export {};
//# sourceMappingURL=ListAudioLowest.d.ts.map