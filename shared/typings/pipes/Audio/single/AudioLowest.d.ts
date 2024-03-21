import type { FfmpegCommand } from "fluent-ffmpeg";
export default function AudioLowest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: FfmpegCommand;
}>;
//# sourceMappingURL=AudioLowest.d.ts.map