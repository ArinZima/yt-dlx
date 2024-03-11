import type TubeConfig from "../interface/TubeConfig";
import type { FfmpegCommand as proTubeCommand } from "fluent-ffmpeg";
export type { proTubeCommand };
export declare function progressBar(prog: any): void;
export default function proTube({ adata, vdata, ipAddress, }: {
    ipAddress: string;
    adata?: TubeConfig;
    vdata?: TubeConfig;
}): Promise<proTubeCommand>;
//# sourceMappingURL=ffmpeg.d.ts.map