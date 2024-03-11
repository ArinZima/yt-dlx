/// <reference types="fluent-ffmpeg" />
import type { proTubeCommand } from "../../../base/ffmpeg";
export default function AudioHighest(input: {
    query: string;
    output?: string;
    stream?: boolean;
    verbose?: boolean;
    proxy?: string;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void | {
    filename: string;
    ffmpeg: proTubeCommand;
}>;
//# sourceMappingURL=AudioHighest.d.ts.map