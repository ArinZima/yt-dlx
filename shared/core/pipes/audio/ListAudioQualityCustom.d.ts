import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";
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
type ListAudioQualityCustomType = 200 | StreamResult;
export default function ListAudioQualityCustom(input: ListAudioQualityCustomOC): Promise<ListAudioQualityCustomType[] | any>;
export {};
//# sourceMappingURL=ListAudioQualityCustom.d.ts.map