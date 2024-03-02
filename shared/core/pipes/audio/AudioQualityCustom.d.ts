import fluentffmpeg from "fluent-ffmpeg";
import type AudioFilters from "../../interface/AudioFilters";
export default function AudioQualityCustom(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof AudioFilters;
    quality: "high" | "medium" | "low" | "ultralow";
    outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;
//# sourceMappingURL=AudioQualityCustom.d.ts.map