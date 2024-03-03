/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function AudioVideoHighest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=AudioVideoHighest.d.ts.map