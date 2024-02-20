import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
    filter?: keyof VideoFilters;
}
type ListVideoHighestType = SuccessResult | ErrorResult | StreamResult;
export default function ListVideoHighest({ filter, stream, verbose, folderName, playlistUrls, outputFormat, }: ListVideoHighestOC): Promise<ListVideoHighestType[]>;
export {};
//# sourceMappingURL=ListVideoHighest.d.ts.map