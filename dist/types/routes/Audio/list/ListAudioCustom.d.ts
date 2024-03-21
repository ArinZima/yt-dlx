export default function ListAudioCustom({ query, resolution, output, verbose, filter, onionTor, }: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    resolution: "high" | "medium" | "low" | "ultralow";
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void>;
