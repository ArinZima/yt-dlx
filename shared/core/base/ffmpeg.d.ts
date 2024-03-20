import type { FfmpegCommand as proTubeCommand } from "fluent-ffmpeg";
interface ProTubeOptions {
    ipAddress: string;
    adata?: string;
    vdata?: string;
}
export default function proTube({ adata, vdata, ipAddress, }: ProTubeOptions): Promise<proTubeCommand>;
export type { proTubeCommand };
//# sourceMappingURL=ffmpeg.d.ts.map