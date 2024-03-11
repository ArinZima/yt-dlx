/// <reference types="fluent-ffmpeg" />
import type { proTubeCommand } from "../../../base/ffmpeg";
export default function ListVideoLowest(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    proxy?: string;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: proTubeCommand;
}>;
//# sourceMappingURL=ListVideoLowest.d.ts.map