import fluentffmpeg from "fluent-ffmpeg";
export default function AudioVideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;
//# sourceMappingURL=AudioVideoLowest.d.ts.map