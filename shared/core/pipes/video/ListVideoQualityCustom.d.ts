/// <reference types="node" />
import { Readable } from "stream";
import type VideoFilters from "../../interface/VideoFilters";
interface StreamResult {
    stream: Readable;
    filename: string;
}
type ListVideoQualityCustomType = void | StreamResult;
export default function ListVideoQualityCustom(input: {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    filter?: keyof VideoFilters;
    quality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    outputFormat?: "mp4" | "avi" | "mov";
}): Promise<ListVideoQualityCustomType[] | any>;
export {};
//# sourceMappingURL=ListVideoQualityCustom.d.ts.map