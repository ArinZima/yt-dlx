/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function AudioLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=AudioLowest.d.ts.map