/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function VideoQualityCustom(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    quality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=VideoQualityCustom.d.ts.map