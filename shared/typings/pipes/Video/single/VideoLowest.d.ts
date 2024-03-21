import type { FfmpegCommand } from "fluent-ffmpeg";
export default function VideoLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;
