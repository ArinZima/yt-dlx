import ffmpeg from "fluent-ffmpeg";
import type { FfmpegCommand } from "fluent-ffmpeg";
import type TubeConfig from "../interface/TubeConfig";
export declare function progressBar(prog: any): void;
export default function proTube({ adata, vdata, }: {
    adata?: TubeConfig;
    vdata?: TubeConfig;
}): Promise<ffmpeg.FfmpegCommand>;
export type { FfmpegCommand as proTubeCommand };
//# sourceMappingURL=ffmpeg.d.ts.map