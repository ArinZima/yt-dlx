import type EngineResult from "../interface/EngineResult";
export declare function sizeFormat(filesize: number): string | number;
export default function Engine({ query, proxy, ipAddress, }: {
    query: string;
    proxy?: string;
    ipAddress?: string;
}): Promise<EngineResult>;
//# sourceMappingURL=Engine.d.ts.map