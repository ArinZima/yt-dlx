/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function VideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
}): Promise<void | {
    filename: string;
    stream: gpuffmpegCommand;
}>;
//# sourceMappingURL=VideoHighest.d.ts.map