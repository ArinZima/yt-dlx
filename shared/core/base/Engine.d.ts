import type EngineResult from "../interface/EngineResult";
export declare function sizeFormat(filesize: number): string | number;
export default function Engine({ query, ipAddress, autoSocks5, }: {
    query: string;
    ipAddress: string;
    autoSocks5?: boolean;
}): Promise<EngineResult>;
//# sourceMappingURL=Engine.d.ts.map