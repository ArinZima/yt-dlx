import type TubeConfig from "./TubeConfig";
import type EngineData from "./EngineData";

export default interface EngineResult {
  metaTube: EngineData;
  AudioTube: TubeConfig[];
  VideoTube: TubeConfig[];
  HDRVideoTube: TubeConfig[];
}
