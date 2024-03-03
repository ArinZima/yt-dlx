/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function AudioQualityCustom(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    quality: "high" | "medium" | "low" | "ultralow";
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=AudioQualityCustom.d.ts.map