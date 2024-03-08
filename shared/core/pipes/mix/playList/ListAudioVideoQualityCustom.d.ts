/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../../base/ffmpeg";
export default function ListAudioVideoQualityCustom(input: {
    query: string[];
    output?: string;
    verbose?: boolean;
    torproxy?: string;
    AQuality: "high" | "medium" | "low" | "ultralow";
    VQuality: "144p" | "240p" | "360p" | "480p" | "720p" | "1080p" | "1440p" | "2160p" | "2880p" | "4320p" | "5760p" | "8640p" | "12000p";
    filter?: "invert" | "rotate90" | "rotate270" | "grayscale" | "rotate180" | "flipVertical" | "flipHorizontal";
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=ListAudioVideoQualityCustom.d.ts.map