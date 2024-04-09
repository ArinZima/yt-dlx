/// <reference types="node" />
import { z } from "zod";
import EventEmitter from "events";
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
export default function AudioHighest({ query, output, stream, verbose, filter, onionTor, }: z.infer<typeof ZodSchema>): Promise<EventEmitter>;
export {};
//# sourceMappingURL=quick.spec.d.ts.map