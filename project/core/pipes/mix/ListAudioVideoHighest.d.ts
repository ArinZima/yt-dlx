import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListAudioVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoHighestType = SuccessResult | ErrorResult | StreamResult;
export default function ListAudioVideoHighest({ stream, verbose, folderName, playlistUrls, outputFormat, }: ListAudioVideoHighestOC): Promise<ListAudioVideoHighestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoHighest.d.ts.map