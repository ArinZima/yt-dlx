import fluentffmpeg from "fluent-ffmpeg";
import type AudioFilters from "../../interface/AudioFilters";
export default function AudioHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof AudioFilters;
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;
//# sourceMappingURL=AudioHighest.d.ts.map