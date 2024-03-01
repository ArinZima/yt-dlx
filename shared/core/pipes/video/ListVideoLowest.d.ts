/// <reference types="node" />
import { Readable } from "stream";
import type VideoFilters from "../../interface/VideoFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListVideoLowestType = void | StreamResult;
export default function ListVideoLowest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<ListVideoLowestType[] | any>;
export {};
//# sourceMappingURL=ListVideoLowest.d.ts.map