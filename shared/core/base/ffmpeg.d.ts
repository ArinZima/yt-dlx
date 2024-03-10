import type { FfmpegCommand } from "fluent-ffmpeg";
export declare function progressBar(prog: any, size: string): void;
declare function gpuffmpeg({ size, input, verbose, }: {
    size: string;
    input: string;
    verbose?: boolean;
}): FfmpegCommand;
export default gpuffmpeg;
export type { FfmpegCommand as gpuffmpegCommand };
//# sourceMappingURL=ffmpeg.d.ts.map