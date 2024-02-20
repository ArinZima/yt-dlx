import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type VideoFormat = "mp4" | "avi" | "mov";
type VideoQualities = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
interface ListVideoQualityCustomOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    quality: VideoQualities;
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
type ListVideoQualityCustomType = SuccessResult | ErrorResult | StreamResult;
export default function ListVideoQualityCustom({ filter, stream, quality, verbose, folderName, playlistUrls, outputFormat, }: ListVideoQualityCustomOC): Promise<ListVideoQualityCustomType[]>;
export {};
//# sourceMappingURL=ListVideoQualityCustom.d.ts.map