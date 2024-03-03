/// <reference types="fluent-ffmpeg" />
import type { gpuffmpegCommand } from "../../base/ffmpeg";
export default function AudioHighest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: gpuffmpegCommand;
}>;
//# sourceMappingURL=AudioHighest.d.ts.map