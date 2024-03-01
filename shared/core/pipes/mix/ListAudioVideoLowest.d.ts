import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "webm" | "avi" | "mov";
interface ListAudioVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoLowestType = true | StreamResult;
export default function ListAudioVideoLowest(input: ListAudioVideoLowestOC): Promise<ListAudioVideoLowestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoLowest.d.ts.map