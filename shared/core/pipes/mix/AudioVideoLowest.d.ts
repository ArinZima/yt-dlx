/// <reference types="node" />
import { Readable } from "stream";
interface StreamResult {
    stream: Readable;
    filename: string;
}
export default function AudioVideoLowest(input: {
    query: string;
    stream?: boolean;
    verbose?: boolean;
    folderName?: string;
    outputFormat?: "webm" | "avi" | "mov";
}): Promise<void | StreamResult>;
export {};
//# sourceMappingURL=AudioVideoLowest.d.ts.map