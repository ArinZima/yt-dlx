/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function VideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
}): Promise<void | {
    filename: string;
    stream: gpuffmpegCommand;
}>;
//# sourceMappingURL=VideoLowest.d.ts.map