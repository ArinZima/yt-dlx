import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
type VideoFormat = "mp4" | "avi" | "mov";
interface VideoLowestOC {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
export default function VideoLowest(input: VideoLowestOC): Promise<true | StreamResult>;
export {};
//# sourceMappingURL=VideoLowest.d.ts.map