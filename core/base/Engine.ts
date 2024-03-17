import * as fs from "fs";
import * as path from "path";
import retry from "async-retry";
import { promisify } from "util";
import { exec } from "child_process";

export interface sizeFormat {
  (filesize: number): string | number;
}
export const sizeFormat: sizeFormat = (filesize: number): string | number => {
  if (isNaN(filesize) || filesize < 0) return filesize;
  const bytesPerMegabyte = 1024 * 1024;
  const bytesPerGigabyte = bytesPerMegabyte * 1024;
  const bytesPerTerabyte = bytesPerGigabyte * 1024;
  let formattedSize: string | number;
  switch (true) {
    case filesize < bytesPerMegabyte:
      formattedSize = filesize + " B";
      break;
    case filesize < bytesPerGigabyte:
      formattedSize = (filesize / bytesPerMegabyte).toFixed(2) + " MB";
      break;
    case filesize < bytesPerTerabyte:
      formattedSize = (filesize / bytesPerGigabyte).toFixed(2) + " GB";
      break;
    default:
      formattedSize = (filesize / bytesPerTerabyte).toFixed(2) + " TB";
      break;
  }
  return formattedSize;
};

export interface AudioFormat {
  filesize: number;
  filesizeP: string | number;
  asr: number;
  format_id: string;
  format_note: string;
  has_drm: boolean;
  tbr: number;
  url: string;
  ext: string;
  acodec: string;
  container: string;
  resolution: string;
  audio_ext: string;
  abr: number;
  format: string;
}
export interface VideoFormat {
  filesize: number;
  filesizeP: string | number;
  format_id: number;
  format_note: string;
  fps: number;
  height: number;
  width: number;
  has_drm: boolean;
  tbr: number;
  url: string;
  ext: string;
  vcodec: string;
  dynamic_range: string;
  container: string;
  resolution: string;
  aspect_ratio: number;
  video_ext: string;
  vbr: number;
  format: string;
}
export interface ManifestFormat {
  format_id: number;
  url: string;
  manifest_url: string;
  tbr: number;
  ext: string;
  fps: number;
  quality: number;
  has_drm: boolean;
  width: number;
  height: number;
  vcodec: string;
  acodec: string;
  dynamic_range: string;
  aspect_ratio: number;
  video_ext: string;
  audio_ext: string;
  abr: number;
  vbr: number;
  format: string;
}
export interface VideoInfo {
  id: string;
  title: string;
  channel: string;
  uploader: string;
  duration: number;
  thumbnail: string;
  age_limit: number;
  channel_id: string;
  categories: string[];
  display_id: string;
  description: string;
  channel_url: string;
  webpage_url: string;
  live_status: boolean;
  upload_date: string;
  uploader_id: string;
  original_url: string;
  uploader_url: string;
  duration_string: string;
}
export interface EngineOutput {
  ipAddress: string;
  metaData: VideoInfo;
  LowAudio: AudioFormat[];
  HighAudio: AudioFormat[];
  LowVideo: VideoFormat[];
  HighVideo: VideoFormat[];
  LowManifest: ManifestFormat[];
  HighManifest: ManifestFormat[];
  LowAudioDRC: AudioFormat[];
  HighAudioDRC: AudioFormat[];
  LowVideoHDR: VideoFormat[];
  HighVideoHDR: VideoFormat[];
}
export default async function Engine({
  query,
  ipAddress,
  autoSocks5,
}: {
  query: string;
  ipAddress: string;
  autoSocks5: boolean | undefined;
}) {
  let LowAudio: any = {};
  let HighAudio: any = {};
  let LowVideo: any = {};
  let HighVideo: any = {};
  let LowManifest: any = {};
  let HighManifest: any = {};
  let LowAudioDRC: any = {};
  let HighAudioDRC: any = {};
  let LowVideoHDR: any = {};
  let HighVideoHDR: any = {};
  let maxT = 8,
    pLoc = "",
    dirC = process.cwd();
  while (maxT > 0) {
    const enginePath = path.join(dirC, "util", "engine");
    switch (true) {
      case fs.existsSync(enginePath):
        pLoc = enginePath;
        maxT = 0;
        break;
      default:
        dirC = path.join(dirC, "..");
        maxT--;
        break;
    }
  }
  const metaCore = await retry(
    async () => {
      if (autoSocks5) pLoc += ` --proxy "socks5://127.0.0.1:9050"`;
      pLoc += ` --dump-single-json "${query}"`;
      pLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
      pLoc += ` --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"`;
      return await promisify(exec)(pLoc);
    },
    {
      factor: 2,
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 3000,
    }
  );
  const i = JSON.parse(metaCore.stdout.toString());
  i.formats.forEach((tube: any) => {
    const rm = new Set(["storyboard", "Default"]);
    switch (true) {
      case !rm.has(tube.format_note) &&
        tube.protocol === "m3u8_native" &&
        tube.vbr:
        switch (true) {
          case !LowManifest[tube.resolution] ||
            tube.vbr < LowManifest[tube.resolution].vbr:
            LowManifest[tube.resolution] = tube;
            break;
          case !HighManifest[tube.resolution] ||
            tube.vbr > HighManifest[tube.resolution].vbr:
            HighManifest[tube.resolution] = tube;
            break;
        }
        break;
      case rm.has(tube.format_note) ||
        tube.filesize === undefined ||
        tube.filesize === null:
        return;
      default:
        switch (true) {
          case tube.format_note.includes("DRC"):
            switch (true) {
              case LowAudio[tube.resolution] && !LowAudioDRC[tube.resolution]:
                LowAudioDRC[tube.resolution] = LowAudio[tube.resolution];
                break;
              case HighAudio[tube.resolution] && !HighAudioDRC[tube.resolution]:
                HighAudioDRC[tube.resolution] = HighAudio[tube.resolution];
                break;
            }
            LowAudioDRC[tube.format_note] = tube;
            HighAudioDRC[tube.format_note] = tube;
            break;

          case tube.format_note.includes("HDR"):
            switch (true) {
              case !LowVideoHDR[tube.format_note] ||
                tube.filesize < LowVideoHDR[tube.format_note].filesize:
                LowVideoHDR[tube.format_note] = tube;
                break;
              case !HighVideoHDR[tube.format_note] ||
                tube.filesize > HighVideoHDR[tube.format_note].filesize:
                HighVideoHDR[tube.format_note] = tube;
                break;
            }
            break;
        }
        break;
    }
    const prevLowVideo = LowVideo[tube.format_note];
    const prevHighVideo = HighVideo[tube.format_note];
    const prevLowAudio = LowAudio[tube.format_note];
    const prevHighAudio = HighAudio[tube.format_note];
    switch (true) {
      case tube.format_note.includes("p"):
        switch (true) {
          case !prevLowVideo || tube.filesize < prevLowVideo.filesize:
            LowVideo[tube.format_note] = tube;
            break;
          case !prevHighVideo || tube.filesize > prevHighVideo.filesize:
            HighVideo[tube.format_note] = tube;
            break;
        }
        break;
      default:
        switch (true) {
          case !prevLowAudio || tube.filesize < prevLowAudio.filesize:
            LowAudio[tube.format_note] = tube;
            break;
          case !prevHighAudio || tube.filesize > prevHighAudio.filesize:
            HighAudio[tube.format_note] = tube;
            break;
        }
        break;
    }
  });
  function propfilter(formats: any[]) {
    return formats.filter((i) => {
      return !i.format_note.includes("DRC") && !i.format_note.includes("HDR");
    });
  }
  function mapVideo(videoObject: VideoFormat[]) {
    return propfilter(Object.values(videoObject)).map((i: any) => ({
      filesize: i.filesize as number,
      filesizeP: sizeFormat(i.filesize) as string,
      format_id: parseFloat(i.format_id) as number,
      format_note: i.format_note as string,
      fps: parseFloat(i.fps) as number,
      height: parseFloat(i.height) as number,
      width: parseFloat(i.width) as number,
      has_drm: i.has_drm as boolean,
      tbr: parseFloat(i.tbr) as number,
      url: i.url as string,
      ext: i.ext as string,
      vcodec: i.vcodec as string,
      dynamic_range: i.dynamic_range as string,
      container: i.container as string,
      resolution: i.resolution as string,
      aspect_ratio: parseFloat(i.aspect_ratio) as number,
      video_ext: i.video_ext as string,
      vbr: parseFloat(i.vbr) as number,
      format: i.format as string,
    }));
  }
  function mapManifest(manifestObject: ManifestFormat[]) {
    return Object.values(manifestObject).map((i: any) => ({
      format_id: parseFloat(i.format_id) as number,
      url: i.url as string,
      manifest_url: i.manifest_url as string,
      tbr: parseFloat(i.tbr) as number,
      ext: i.ext as string,
      fps: parseFloat(i.fps) as number,
      quality: parseFloat(i.quality) as number,
      has_drm: i.has_drm as boolean,
      width: parseFloat(i.width) as number,
      height: parseFloat(i.height) as number,
      vcodec: i.vcodec as string,
      acodec: i.acodec as string,
      dynamic_range: i.dynamic_range as string,
      aspect_ratio: parseFloat(i.aspect_ratio) as number,
      video_ext: i.video_ext as string,
      audio_ext: i.audio_ext as string,
      abr: parseFloat(i.abr) as number,
      vbr: parseFloat(i.vbr) as number,
      format: i.format as string,
    }));
  }
  function mapAudio(audioObject: AudioFormat[]) {
    return propfilter(Object.values(audioObject)).map((i: any) => ({
      filesize: i.filesize as number,
      filesizeP: sizeFormat(i.filesize) as string,
      asr: parseFloat(i.asr) as number,
      format_id: i.format_id as string,
      format_note: i.format_note as string,
      has_drm: i.has_drm as boolean,
      tbr: parseFloat(i.tbr) as number,
      url: i.url as string,
      ext: i.ext as string,
      acodec: i.acodec as string,
      container: i.container as string,
      resolution: i.resolution as string,
      audio_ext: i.audio_ext as string,
      abr: parseFloat(i.abr) as number,
      format: i.format as string,
    }));
  }

  const payLoad: EngineOutput = {
    HighAudioDRC: mapAudio(HighAudioDRC),
    LowAudioDRC: mapAudio(LowAudioDRC),
    HighAudio: mapAudio(HighAudio),
    LowAudio: mapAudio(LowAudio),
    HighVideoHDR: mapVideo(HighVideoHDR),
    LowVideoHDR: mapVideo(LowVideoHDR),
    HighVideo: mapVideo(HighVideo),
    LowVideo: mapVideo(LowVideo),
    HighManifest: mapManifest(HighManifest),
    LowManifest: mapManifest(LowManifest),
    ipAddress,
    metaData: {
      id: i.id as string,
      title: i.title as string,
      channel: i.channel as string,
      uploader: i.uploader as string,
      duration: i.duration as number,
      thumbnail: i.thumbnail as string,
      age_limit: i.age_limit as number,
      channel_id: i.channel_id as string,
      categories: i.categories as string[],
      display_id: i.display_id as string,
      description: i.description as string,
      channel_url: i.channel_url as string,
      webpage_url: i.webpage_url as string,
      live_status: i.live_status as boolean,
      upload_date: i.upload_date as string,
      uploader_id: i.uploader_id as string,
      original_url: i.original_url as string,
      uploader_url: i.uploader_url as string,
      duration_string: i.duration_string as string,
    },
  };
  return payLoad;
}
