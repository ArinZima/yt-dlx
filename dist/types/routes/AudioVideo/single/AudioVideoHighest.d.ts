import type { FfmpegCommand } from "fluent-ffmpeg";
export default function AudioVideoHighest({ query, stream, verbose, output, filter, onionTor, }: {
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
