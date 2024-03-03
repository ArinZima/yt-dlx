/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function AudioLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=AudioLowest.d.ts.map