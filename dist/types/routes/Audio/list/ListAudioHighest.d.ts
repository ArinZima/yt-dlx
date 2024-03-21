export default function ListAudioHighest({ query, output, verbose, filter, onionTor, }: {
    query: string[];
    output?: string;
    verbose?: boolean;
    onionTor?: boolean;
    filter?: "echo" | "slow" | "speed" | "phaser" | "flanger" | "panning" | "reverse" | "vibrato" | "subboost" | "surround" | "bassboost" | "nightcore" | "superslow" | "vaporwave" | "superspeed";
}): Promise<void>;
