/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../../base/ffmpeg";
export default function VideoLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    torproxy?: string;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=VideoLowest.d.ts.map