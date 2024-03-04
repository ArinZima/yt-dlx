/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../base/ffmpeg";
export default function AudioQualityCustom(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    torproxy?: string;
    quality: "high" | "medium" | "low" | "ultralow";
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=quick.spec.d.ts.map