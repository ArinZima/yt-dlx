import type { FfmpegCommand } from "fluent-ffmpeg";
export default function AudioCustom(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    resolution: "high" | "medium" | "low" | "ultralow";
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;
