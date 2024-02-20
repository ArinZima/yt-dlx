import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
type AudioQualities = "high" | "medium" | "low" | "ultralow";
interface ListAudioQualityCustomOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    quality: AudioQualities;
    outputFormat?: AudioFormat;
    filter?: keyof AudioFilters;
}
type ListAudioQualityCustomType = SuccessResult | ErrorResult | StreamResult;
export default function ListAudioQualityCustom({ filter, stream, quality, verbose, folderName, playlistUrls, outputFormat, }: ListAudioQualityCustomOC): Promise<ListAudioQualityCustomType[]>;
export {};
//# sourceMappingURL=ListAudioQualityCustom.d.ts.map