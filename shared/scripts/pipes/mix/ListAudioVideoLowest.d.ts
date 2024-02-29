import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListAudioVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoLowestType = 200 | ErrorResult | StreamResult;
export default function ListAudioVideoLowest(input: ListAudioVideoLowestOC): Promise<ListAudioVideoLowestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoLowest.d.ts.map