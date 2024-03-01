/// <reference types="node" />
import { Readable } from "stream";
interface StreamResult {
    stream: Readable;
    filename: string;
}
export default function AudioVideoHighest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<void | StreamResult>;
export {};
//# sourceMappingURL=AudioVideoHighest.d.ts.map