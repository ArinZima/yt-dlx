import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
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
export default function ListAudioHighest({ filter, stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioHighestOC): Promise<ListAudioHighestType[]>;
export {};
//# sourceMappingURL=ListAudioHighest.d.ts.map