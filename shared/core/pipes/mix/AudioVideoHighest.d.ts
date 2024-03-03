/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function AudioVideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    output?: string;
}): Promise<void | {
    filename: string;
    stream: gpuffmpegCommand;
}>;
//# sourceMappingURL=AudioVideoHighest.d.ts.map