import type TubeConfig from "../interface/TubeConfig";
import type EngineData from "../interface/EngineData";
interface EngineResult {
    metaTube: EngineData;
    AudioTube: TubeConfig[];
    VideoTube: TubeConfig[];
    HDRVideoTube: TubeConfig[];
}
export default function Engine(query: string, port?: number, proxy?: string, username?: string, password?: string): Promise<EngineResult>;
export {};
//# sourceMappingURL=Engine.d.ts.map