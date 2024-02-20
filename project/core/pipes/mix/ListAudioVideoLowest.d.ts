import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListAudioVideoLowestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoLowestType = SuccessResult | ErrorResult | StreamResult;
export default function ListAudioVideoLowest({ stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioVideoLowestOC): Promise<ListAudioVideoLowestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoLowest.d.ts.map