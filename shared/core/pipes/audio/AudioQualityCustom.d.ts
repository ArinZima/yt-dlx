import fluentffmpeg from "fluent-ffmpeg";
import type AudioFilters from "../../interface/AudioFilters";
export default function AudioQualityCustom(input: {
    query: string;
    stream?: boolean;
    folderName?: string;
    quality: "high" | "medium" | "low" | "ultralow";
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
    filter?: keyof AudioFilters;
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;
//# sourceMappingURL=AudioQualityCustom.d.ts.map