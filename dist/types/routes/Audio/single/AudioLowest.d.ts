import { z } from "zod";
import type { FfmpegCommand } from "fluent-ffmpeg";
declare const ZodSchema: z.ZodObject<{
    query: z.ZodString;
    output: z.ZodOptional<z.ZodString>;
    stream: z.ZodOptional<z.ZodBoolean>;
    verbose: z.ZodOptional<z.ZodBoolean>;
    onionTor: z.ZodOptional<z.ZodBoolean>;
    filter: z.ZodOptional<z.ZodEnum<["echo", "slow", "speed", "phaser", "flanger", "panning", "reverse", "vibrato", "subboost", "surround", "bassboost", "nightcore", "superslow", "vaporwave", "superspeed"]>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    output?: string | undefined;
    stream?: boolean | undefined;
    verbose?: boolean | undefined;
    onionTor?: boolean | undefined;
    filter?: "reverse" | "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed" | undefined;
}, {
    query: string;
    output?: string | undefined;
    stream?: boolean | undefined;
    verbose?: boolean | undefined;
    onionTor?: boolean | undefined;
    filter?: "reverse" | "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed" | undefined;
}>;
export default function AudioLowest({ query, output, stream, verbose, filter, onionTor, }: z.infer<typeof ZodSchema>): Promise<void | {
    ffmpeg: FfmpegCommand;
    filename: string;
}>;
export {};
