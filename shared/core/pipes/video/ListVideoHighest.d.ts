/// <reference types="node" />
import { Readable } from "stream";
import type VideoFilters from "../../interface/VideoFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListVideoHighestType = void | StreamResult;
export default function ListVideoHighest(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof VideoFilters;
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<ListVideoHighestType[] | any>;
export {};
//# sourceMappingURL=ListVideoHighest.d.ts.map