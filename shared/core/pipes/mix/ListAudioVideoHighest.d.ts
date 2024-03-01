import type StreamResult from "../../interface/StreamResult";
type VideoFormat = "webm" | "avi" | "mov";
interface ListAudioVideoHighestOC {
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    playlistUrls: string[];
    outputFormat?: VideoFormat;
}
type ListAudioVideoHighestType = true | StreamResult;
export default function ListAudioVideoHighest(input: ListAudioVideoHighestOC): Promise<ListAudioVideoHighestType[]>;
export {};
//# sourceMappingURL=ListAudioVideoHighest.d.ts.map