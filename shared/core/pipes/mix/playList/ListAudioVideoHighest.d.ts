/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../../base/ffmpeg";
export default function ListAudioVideoHighest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    torproxy?: string;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=ListAudioVideoHighest.d.ts.map