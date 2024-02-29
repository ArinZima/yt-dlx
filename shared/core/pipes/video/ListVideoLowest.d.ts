import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
type ListVideoLowestType = 200 | StreamResult;
export default function ListVideoLowest(input: ListVideoLowestOC): Promise<ListVideoLowestType[] | any>;
export {};
//# sourceMappingURL=ListVideoLowest.d.ts.map