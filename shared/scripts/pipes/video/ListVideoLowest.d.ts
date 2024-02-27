import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
type ListVideoLowestType = SuccessResult | ErrorResult | StreamResult;
export default function ListVideoLowest(input: ListVideoLowestOC): Promise<ListVideoLowestType[] | any>;
export {};
//# sourceMappingURL=ListVideoLowest.d.ts.map