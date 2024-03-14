/// <reference types="fluent-ffmpeg" />
import type { proTubeCommand } from "../../../base/ffmpeg";
export default function AudioVideoLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    autoSocks5?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: proTubeCommand;
}>;
//# sourceMappingURL=AudioVideoLowest.d.ts.map