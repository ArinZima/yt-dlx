import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
type VideoFormat = "mp4" | "avi" | "mov";
type VideoQualities = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
interface VideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    quality: VideoQualities;
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
type VideoLowestType = Promise<true | StreamResult>;
export default function VideoLowest(input: VideoLowestOC): VideoLowestType;
export {};
//# sourceMappingURL=VideoQualityCustom.d.ts.map