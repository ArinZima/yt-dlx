import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
type ListVideoHighestType = 200 | ErrorResult | StreamResult;
export default function ListVideoHighest(input: ListVideoHighestOC): Promise<ListVideoHighestType[] | any>;
export {};
//# sourceMappingURL=ListVideoHighest.d.ts.map