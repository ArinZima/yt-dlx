import fluentffmpeg from "fluent-ffmpeg";
import type VideoFilters from "../../interface/VideoFilters";
export default function VideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    filter?: keyof VideoFilters;
}): Promise<void | {
    fileName: string;
    stream: fluentffmpeg.FfprobeStreamDisposition;
}>;
//# sourceMappingURL=VideoLowest.d.ts.map