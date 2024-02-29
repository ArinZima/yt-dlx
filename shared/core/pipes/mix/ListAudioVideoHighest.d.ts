import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "mp4" | "avi" | "mov";
interface ListAudioVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoHighestType = 200 | ErrorResult | StreamResult;
export default function ListAudioVideoHighest(input: ListAudioVideoHighestOC): Promise<ListAudioVideoHighestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoHighest.d.ts.map