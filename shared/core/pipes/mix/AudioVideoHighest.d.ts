import fluentffmpeg from "fluent-ffmpeg";
export default function AudioVideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;
//# sourceMappingURL=AudioVideoHighest.d.ts.map