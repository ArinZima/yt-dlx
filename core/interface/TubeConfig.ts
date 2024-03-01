export default interface TubeConfig {
  Audio: {
    codec: string;
    bitrate: number;
    channels: number;
    extension: string;
    samplerate: number;
  };
  Video: {
    width: number;
    codec: string;
    height: number;
    bitrate: number;
    extension: string;
    resolution: string;
    aspectratio: number;
  };
  meta_dl: {
    mediaurl: string;
    formatid: string;
    formatnote: string;
    originalformat: string;
  };
  meta_info: {
    dynamicrange: string;
    totalbitrate: number;
    filesizebytes: number;
    framespersecond: number;
    qriginalextension: string;
    extensionconatainer: string;
    filesizeformatted: string | number;
  };
}
