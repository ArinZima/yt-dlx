import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import retry from "async-retry";
import { promisify } from "util";
import { exec } from "child_process";

// =====================================================================================
export interface sizeFormat {
  (filesize: number): string | number;
}
export const sizeFormat: sizeFormat = (filesize: number): string | number => {
  if (isNaN(filesize) || filesize < 0) return filesize;
  const bytesPerMegabyte = 1024 * 1024;
  const bytesPerGigabyte = bytesPerMegabyte * 1024;
  const bytesPerTerabyte = bytesPerGigabyte * 1024;
  if (filesize < bytesPerMegabyte) return filesize + " B";
  else if (filesize < bytesPerGigabyte) {
    return (filesize / bytesPerMegabyte).toFixed(2) + " MB";
  } else if (filesize < bytesPerTerabyte) {
    return (filesize / bytesPerGigabyte).toFixed(2) + " GB";
  } else return (filesize / bytesPerTerabyte).toFixed(2) + " TB";
};
// =====================================================================================
export interface AudioFormat {
  filesize: number;
  filesizeP: string | number;
  asr: number;
  format_note: string;
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
  format_note: string;
  fps: number;
  height: number;
  width: number;
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
  url: string;
  manifest_url: string;
  tbr: number;
  ext: string;
  fps: number;
  width: number;
  height: number;
  vcodec: string;
  dynamic_range: string;
  aspect_ratio: number;
  video_ext: string;
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
  view_count: number;
  like_count: number;
  comment_count: number;
  channel_follower_count: number;
  upload_date: string;
  uploader_id: string;
  original_url: string;
  uploader_url: string;
  duration_string: string;
}
export interface EngineOutput {
  ipAddress: string;
  metaData: VideoInfo;
  AudioLowF: AudioFormat;
  AudioHighF: AudioFormat;
  VideoLowF: VideoFormat;
  VideoHighF: VideoFormat;
  AudioLowDRC: AudioFormat[];
  AudioHighDRC: AudioFormat[];
  AudioLow: AudioFormat[];
  AudioHigh: AudioFormat[];
  VideoLowHDR: VideoFormat[];
  VideoHighHDR: VideoFormat[];
  VideoLow: VideoFormat[];
  VideoHigh: VideoFormat[];
  ManifestLow: ManifestFormat[];
  ManifestHigh: ManifestFormat[];
}
// =====================================================================================
export default async function Engine({
  query,
  ipAddress,
  onionTor,
}: {
  query: string;
  ipAddress: string;
  onionTor: boolean | undefined;
}) {
  let AudioLow: any = {};
  let AudioHigh: any = {};
  let VideoLow: any = {};
  let VideoHigh: any = {};
  let ManifestLow: any = {};
  let ManifestHigh: any = {};
  let AudioLowDRC: any = {};
  let AudioHighDRC: any = {};
  let VideoLowHDR: any = {};
  let VideoHighHDR: any = {};
  let AudioLowF: AudioFormat | any = null;
  let AudioHighF: AudioFormat | any = null;
  let VideoLowF: VideoFormat | any = null;
  let VideoHighF: VideoFormat | any = null;
  let dirC = __dirname || process.cwd();
  let pLoc = "";
  let maxT = 8;
  while (maxT > 0) {
    const cprobePath = path.join(dirC, "util", "cprobe");
    if (fs.existsSync(cprobePath)) {
      pLoc = cprobePath;
      break;
    } else {
      dirC = path.join(dirC, "..");
      maxT--;
    }
  }
  if (pLoc === "") {
    throw new Error(
      colors.red("@error: ") +
        "Could not find cprobe file. maybe re-install yt-dlx?"
    );
  }
  const config = {
    factor: 2,
    retries: 3,
    minTimeout: 1000,
    maxTimeout: 3000,
  };
  const metaCore = await retry(async () => {
    if (onionTor) pLoc += ` --proxy "socks5://127.0.0.1:9050"`;
    pLoc += ` --dump-single-json "${query}"`;
    pLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
    pLoc += ` --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"`;
    return await promisify(exec)(pLoc);
  }, config);
  const i = JSON.parse(metaCore.stdout.toString());
  i.formats.forEach((tube: any) => {
    const rm = new Set(["storyboard", "Default"]);
    if (
      !rm.has(tube.format_note) &&
      tube.protocol === "m3u8_native" &&
      tube.vbr
    ) {
      if (
        !ManifestLow[tube.resolution] ||
        tube.vbr < ManifestLow[tube.resolution].vbr
      )
        ManifestLow[tube.resolution] = tube;
      if (
        !ManifestHigh[tube.resolution] ||
        tube.vbr > ManifestHigh[tube.resolution].vbr
      )
        ManifestHigh[tube.resolution] = tube;
    }
    if (rm.has(tube.format_note) || tube.filesize === undefined || null) return;
    if (tube.format_note.includes("DRC")) {
      if (AudioLow[tube.resolution] && !AudioLowDRC[tube.resolution]) {
        AudioLowDRC[tube.resolution] = AudioLow[tube.resolution];
      }
      if (AudioHigh[tube.resolution] && !AudioHighDRC[tube.resolution]) {
        AudioHighDRC[tube.resolution] = AudioHigh[tube.resolution];
      }
      AudioLowDRC[tube.format_note] = tube;
      AudioHighDRC[tube.format_note] = tube;
    } else if (tube.format_note.includes("HDR")) {
      if (
        !VideoLowHDR[tube.format_note] ||
        tube.filesize < VideoLowHDR[tube.format_note].filesize
      )
        VideoLowHDR[tube.format_note] = tube;
      if (
        !VideoHighHDR[tube.format_note] ||
        tube.filesize > VideoHighHDR[tube.format_note].filesize
      )
        VideoHighHDR[tube.format_note] = tube;
    }
    const prevLowVideo = VideoLow[tube.format_note];
    const prevHighVideo = VideoHigh[tube.format_note];
    const prevLowAudio = AudioLow[tube.format_note];
    const prevHighAudio = AudioHigh[tube.format_note];
    switch (true) {
      case tube.format_note.includes("p"):
        if (!prevLowVideo || tube.filesize < prevLowVideo.filesize)
          VideoLow[tube.format_note] = tube;
        if (!prevHighVideo || tube.filesize > prevHighVideo.filesize)
          VideoHigh[tube.format_note] = tube;
        break;
      default:
        if (!prevLowAudio || tube.filesize < prevLowAudio.filesize)
          AudioLow[tube.format_note] = tube;
        if (!prevHighAudio || tube.filesize > prevHighAudio.filesize)
          AudioHigh[tube.format_note] = tube;
        break;
    }
  });
  (Object.values(AudioLow) as AudioFormat[]).forEach((audio: AudioFormat) => {
    if (audio.filesize !== null) {
      switch (true) {
        case !AudioLowF || audio.filesize < AudioLowF.filesize:
          AudioLowF = audio;
          break;
        case !AudioHighF || audio.filesize > AudioHighF.filesize:
          AudioHighF = audio;
          break;
        default:
          break;
      }
    }
  });
  (Object.values(VideoLow) as VideoFormat[]).forEach((video: VideoFormat) => {
    if (video.filesize !== null) {
      switch (true) {
        case !VideoLowF || video.filesize < VideoLowF.filesize:
          VideoLowF = video;
          break;
        case !VideoHighF || video.filesize > VideoHighF.filesize:
          VideoHighF = video;
          break;
        default:
          break;
      }
    }
  });
  function propfilter(formats: any[]) {
    return formats.filter((i) => {
      return !i.format_note.includes("DRC") && !i.format_note.includes("HDR");
    });
  }
  const payLoad: EngineOutput = {
    ipAddress,
    AudioLowF: (() => {
      const i = AudioLowF || ({} as AudioFormat);
      return nAudio(i);
    })(),
    AudioHighF: (() => {
      const i = AudioHighF || ({} as AudioFormat);
      return nAudio(i);
    })(),
    VideoLowF: (() => {
      const i = VideoLowF || ({} as VideoFormat);
      return nVideo(i);
    })(),
    VideoHighF: (() => {
      const i = VideoHighF || ({} as VideoFormat);
      return nVideo(i);
    })(),
    AudioLowDRC: Object.values(AudioLowDRC).map((i: any) => pAudio(i)),
    AudioHighDRC: Object.values(AudioHighDRC).map((i: any) => pAudio(i)),
    AudioLow: propfilter(Object.values(AudioLow)).map((i: any) => pAudio(i)),
    AudioHigh: propfilter(Object.values(AudioHigh)).map((i: any) => pAudio(i)),
    VideoLowHDR: Object.values(VideoLowHDR).map((i: any) => pVideo(i)),
    VideoHighHDR: Object.values(VideoHighHDR).map((i: any) => pVideo(i)),
    VideoLow: propfilter(Object.values(VideoLow)).map((i: any) => pVideo(i)),
    VideoHigh: propfilter(Object.values(VideoHigh)).map((i: any) => pVideo(i)),
    ManifestLow: Object.values(ManifestLow).map((i: any) => pManifest(i)),
    ManifestHigh: Object.values(ManifestHigh).map((i: any) => pManifest(i)),
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
      view_count: i.view_count as number,
      like_count: i.like_count as number,
      comment_count: i.comment_count as number,
      channel_follower_count: i.channel_follower_count as number,
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

function nAudio(i: any) {
  i.filesizeP = sizeFormat(i.filesize);
  delete i.format_id;
  delete i.source_preference;
  delete i.has_drm;
  delete i.quality;
  delete i.fps;
  delete i.height;
  delete i.width;
  delete i.language;
  delete i.language_preference;
  delete i.preference;
  delete i.dynamic_range;
  delete i.downloader_options;
  delete i.protocol;
  delete i.aspect_ratio;
  delete i.vbr;
  delete i.vcodec;
  delete i.http_headers;
  delete i.video_ext;
  return i;
}

function nVideo(i: any) {
  i.filesizeP = sizeFormat(i.filesize);
  delete i.asr;
  delete i.format_id;
  delete i.has_drm;
  delete i.quality;
  delete i.source_preference;
  delete i.audio_channels;
  delete i.protocol;
  delete i.language;
  delete i.language_preference;
  delete i.preference;
  delete i.acodec;
  delete i.downloader_options;
  delete i.http_headers;
  delete i.audio_ext;
  delete i.abr;
  return i;
}

function pAudio(i: any) {
  return {
    filesize: i.filesize as number,
    filesizeP: sizeFormat(i.filesize) as string,
    asr: parseFloat(i.asr) as number,
    format_note: i.format_note as string,
    tbr: parseFloat(i.tbr) as number,
    url: i.url as string,
    ext: i.ext as string,
    acodec: i.acodec as string,
    container: i.container as string,
    resolution: i.resolution as string,
    audio_ext: i.audio_ext as string,
    abr: parseFloat(i.abr) as number,
    format: i.format as string,
  };
}

function pVideo(i: any) {
  return {
    filesize: i.filesize as number,
    filesizeP: sizeFormat(i.filesize) as string,
    format_note: i.format_note as string,
    fps: parseFloat(i.fps) as number,
    height: parseFloat(i.height) as number,
    width: parseFloat(i.width) as number,
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
  };
}

function pManifest(i: any) {
  return {
    url: i.url as string,
    manifest_url: i.manifest_url as string,
    tbr: parseFloat(i.tbr) as number,
    ext: i.ext as string,
    fps: parseFloat(i.fps) as number,
    width: parseFloat(i.width) as number,
    height: parseFloat(i.height) as number,
    vcodec: i.vcodec as string,
    dynamic_range: i.dynamic_range as string,
    aspect_ratio: parseFloat(i.aspect_ratio) as number,
    video_ext: i.video_ext as string,
    vbr: parseFloat(i.vbr) as number,
    format: i.format as string,
  };
}
