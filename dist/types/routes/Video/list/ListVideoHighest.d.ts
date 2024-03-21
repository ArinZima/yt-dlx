import type { FfmpegCommand } from "fluent-ffmpeg";
export default function ListVideoHighest({ query, verbose, output, filter, onionTor, }: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;
