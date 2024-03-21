import type { FfmpegCommand } from "fluent-ffmpeg";
export default function ListAudioVideoCustom({ query, resolution, verbose, output, filter, onionTor, }: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    resolution: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "3072p" | "4320p" | "6480p" | "8640p" | "12000p";
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;
