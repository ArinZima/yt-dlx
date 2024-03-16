console.clear();
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import retry from "async-retry";
import { promisify } from "util";
import { exec } from "child_process";

function sizeFormat(filesize: number) {
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
}

interface AudioFormat {
  filesize: number;
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
interface VideoFormat {
  filesize: number;
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
interface ManifestFormat {
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
interface EngineOutput {
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
async function Engine() {
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
    if (fs.existsSync(enginePath)) {
      pLoc = enginePath;
      break;
    } else {
      dirC = path.join(dirC, "..");
      maxT--;
    }
  }
  const metaCore = await retry(
    async () => {
      pLoc += ` --proxy "socks5://127.0.0.1:9050"`;
      pLoc += ` --dump-single-json "https://youtu.be/gLcpjY3Gm2E?si=gfGa2k_ig7Y6w42q"`;
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
  const metaTube = JSON.parse(metaCore.stdout.toString());
  await metaTube.formats.forEach((tube: any) => {
    const rm = new Set(["storyboard", "Default"]);
    if (
      !rm.has(tube.format_note) &&
      tube.protocol === "m3u8_native" &&
      tube.vbr
    ) {
      if (
        !LowManifest[tube.resolution] ||
        tube.vbr < LowManifest[tube.resolution].vbr
      )
        LowManifest[tube.resolution] = tube;
      if (
        !HighManifest[tube.resolution] ||
        tube.vbr > HighManifest[tube.resolution].vbr
      )
        HighManifest[tube.resolution] = tube;
    }
    if (rm.has(tube.format_note) || tube.filesize === undefined || null) return;
    if (tube.format_note.includes("DRC")) {
      if (LowAudio[tube.resolution] && !LowAudioDRC[tube.resolution]) {
        LowAudioDRC[tube.resolution] = LowAudio[tube.resolution];
      }
      if (HighAudio[tube.resolution] && !HighAudioDRC[tube.resolution]) {
        HighAudioDRC[tube.resolution] = HighAudio[tube.resolution];
      }
      LowAudioDRC[tube.format_note] = tube;
      HighAudioDRC[tube.format_note] = tube;
    } else if (tube.format_note.includes("HDR")) {
      if (
        !LowVideoHDR[tube.format_note] ||
        tube.filesize < LowVideoHDR[tube.format_note].filesize
      )
        LowVideoHDR[tube.format_note] = tube;
      if (
        !HighVideoHDR[tube.format_note] ||
        tube.filesize > HighVideoHDR[tube.format_note].filesize
      )
        HighVideoHDR[tube.format_note] = tube;
    }
    const prevLowVideo = LowVideo[tube.format_note];
    const prevHighVideo = HighVideo[tube.format_note];
    const prevLowAudio = LowAudio[tube.format_note];
    const prevHighAudio = HighAudio[tube.format_note];
    switch (true) {
      case tube.format_note.includes("p"):
        if (!prevLowVideo || tube.filesize < prevLowVideo.filesize)
          LowVideo[tube.format_note] = tube;
        if (!prevHighVideo || tube.filesize > prevHighVideo.filesize)
          HighVideo[tube.format_note] = tube;
        break;
      default:
        if (!prevLowAudio || tube.filesize < prevLowAudio.filesize)
          LowAudio[tube.format_note] = tube;
        if (!prevHighAudio || tube.filesize > prevHighAudio.filesize)
          HighAudio[tube.format_note] = tube;
        break;
    }
  });
  function propfilter(formats: any[]) {
    return formats.filter((format) => {
      return (
        !format.format_note.includes("DRC") &&
        !format.format_note.includes("HDR")
      );
    });
  }
  const payLoad: EngineOutput = {
    LowAudioDRC: Object.values(LowAudioDRC).map((format: any) => ({
      filesize: format.filesize,
      asr: format.asr,
      format_id: format.format_id,
      format_note: format.format_note,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      acodec: format.acodec,
      container: format.container,
      resolution: format.resolution,
      audio_ext: format.audio_ext,
      abr: format.abr,
      format: format.format,
    })),
    HighAudioDRC: Object.values(HighAudioDRC).map((format: any) => ({
      filesize: format.filesize,
      asr: format.asr,
      format_id: format.format_id,
      format_note: format.format_note,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      acodec: format.acodec,
      container: format.container,
      resolution: format.resolution,
      audio_ext: format.audio_ext,
      abr: format.abr,
      format: format.format,
    })),
    LowAudio: propfilter(Object.values(LowAudio)).map((format: any) => ({
      filesize: format.filesize,
      asr: format.asr,
      format_id: format.format_id,
      format_note: format.format_note,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      acodec: format.acodec,
      container: format.container,
      resolution: format.resolution,
      audio_ext: format.audio_ext,
      abr: format.abr,
      format: format.format,
    })),
    HighAudio: propfilter(Object.values(HighAudio)).map((format: any) => ({
      filesize: format.filesize,
      asr: format.asr,
      format_id: format.format_id,
      format_note: format.format_note,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      acodec: format.acodec,
      container: format.container,
      resolution: format.resolution,
      audio_ext: format.audio_ext,
      abr: format.abr,
      format: format.format,
    })),
    LowVideoHDR: Object.values(LowVideoHDR).map((format: any) => ({
      filesize: format.filesize,
      format_id: format.format_id,
      format_note: format.format_note,
      fps: format.fps,
      height: format.height,
      width: format.width,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      vcodec: format.vcodec,
      dynamic_range: format.dynamic_range,
      container: format.container,
      resolution: format.resolution,
      aspect_ratio: format.aspect_ratio,
      video_ext: format.video_ext,
      vbr: format.vbr,
      format: format.format,
    })),
    HighVideoHDR: Object.values(HighVideoHDR).map((format: any) => ({
      filesize: format.filesize,
      format_id: format.format_id,
      format_note: format.format_note,
      fps: format.fps,
      height: format.height,
      width: format.width,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      vcodec: format.vcodec,
      dynamic_range: format.dynamic_range,
      container: format.container,
      resolution: format.resolution,
      aspect_ratio: format.aspect_ratio,
      video_ext: format.video_ext,
      vbr: format.vbr,
      format: format.format,
    })),
    LowVideo: propfilter(Object.values(LowVideo)).map((format: any) => ({
      filesize: format.filesize,
      format_id: format.format_id,
      format_note: format.format_note,
      fps: format.fps,
      height: format.height,
      width: format.width,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      vcodec: format.vcodec,
      dynamic_range: format.dynamic_range,
      container: format.container,
      resolution: format.resolution,
      aspect_ratio: format.aspect_ratio,
      video_ext: format.video_ext,
      vbr: format.vbr,
      format: format.format,
    })),
    HighVideo: propfilter(Object.values(HighVideo)).map((format: any) => ({
      filesize: format.filesize,
      format_id: format.format_id,
      format_note: format.format_note,
      fps: format.fps,
      height: format.height,
      width: format.width,
      has_drm: format.has_drm,
      tbr: format.tbr,
      url: format.url,
      ext: format.ext,
      vcodec: format.vcodec,
      dynamic_range: format.dynamic_range,
      container: format.container,
      resolution: format.resolution,
      aspect_ratio: format.aspect_ratio,
      video_ext: format.video_ext,
      vbr: format.vbr,
      format: format.format,
    })),
    LowManifest: Object.values(LowManifest).map((format: any) => ({
      format_id: format.format_id,
      url: format.url,
      manifest_url: format.manifest_url,
      tbr: format.tbr,
      ext: format.ext,
      fps: format.fps,
      quality: format.quality,
      has_drm: format.has_drm,
      width: format.width,
      height: format.height,
      vcodec: format.vcodec,
      acodec: format.acodec,
      dynamic_range: format.dynamic_range,
      aspect_ratio: format.aspect_ratio,
      video_ext: format.video_ext,
      audio_ext: format.audio_ext,
      abr: format.abr,
      vbr: format.vbr,
      format: format.format,
    })),
    HighManifest: Object.values(HighManifest).map((format: any) => ({
      format_id: format.format_id,
      url: format.url,
      manifest_url: format.manifest_url,
      tbr: format.tbr,
      ext: format.ext,
      fps: format.fps,
      quality: format.quality,
      has_drm: format.has_drm,
      width: format.width,
      height: format.height,
      vcodec: format.vcodec,
      acodec: format.acodec,
      dynamic_range: format.dynamic_range,
      aspect_ratio: format.aspect_ratio,
      video_ext: format.video_ext,
      audio_ext: format.audio_ext,
      abr: format.abr,
      vbr: format.vbr,
      format: format.format,
    })),
  };
  return payLoad;
}
// ===========================================================================
Engine().then((tube: EngineOutput) => {
  if (tube.LowAudio.length > 0) {
    console.log(colors.magenta("Low Audio:"));
    tube.LowAudio.forEach((i: any) => {
      console.log(colors.magenta("@audio:"), {
        filesize: sizeFormat(i.filesize) as number,
        // asr: parseFloat(i.asr) as number,
        // format_id: i.format_id as string,
        // format_note: i.format_note as string,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // acodec: i.acodec as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // audio_ext: i.audio_ext as string,
        // abr: parseFloat(i.abr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no low i..");
  console.log("\n");
  if (tube.LowAudioDRC.length > 0) {
    console.log(colors.magenta("Low Audio DRC:"));
    tube.LowAudioDRC.forEach((i: any) => {
      console.log(colors.magenta("@audio:"), {
        filesize: sizeFormat(i.filesize) as number,
        // asr: parseFloat(i.asr) as number,
        // format_id: i.format_id as string,
        // format_note: i.format_note as string,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // acodec: i.acodec as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // audio_ext: i.audio_ext as string,
        // abr: parseFloat(i.abr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no low audio DRC..");
  console.log("\n");
  if (tube.HighAudio.length > 0) {
    console.log(colors.magenta("High Audio:"));
    tube.HighAudio.forEach((i: any) => {
      console.log(colors.magenta("@audio:"), {
        filesize: sizeFormat(i.filesize) as number,
        // asr: parseFloat(i.asr) as number,
        // format_id: i.format_id as string,
        // format_note: i.format_note as string,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // acodec: i.acodec as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // audio_ext: i.audio_ext as string,
        // abr: parseFloat(i.abr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no high i..");
  console.log("\n");
  if (tube.HighAudioDRC.length > 0) {
    console.log(colors.magenta("High Audio DRC:"));
    tube.HighAudioDRC.forEach((i: any) => {
      console.log(colors.magenta("@audio:"), {
        filesize: sizeFormat(i.filesize) as number,
        // asr: parseFloat(i.asr) as number,
        // format_id: i.format_id as string,
        // format_note: i.format_note as string,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // acodec: i.acodec as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // audio_ext: i.audio_ext as string,
        // abr: parseFloat(i.abr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no high audio DRC..");
  console.log("\n");
  if (tube.LowVideo.length > 0) {
    console.log(colors.blue("Low Video:"));
    tube.LowVideo.forEach((i: any) => {
      console.log(colors.blue("@video:"), {
        filesize: sizeFormat(i.filesize) as number,
        // format_id: parseFloat(i.format_id) as number,
        // format_note: i.format_note as string,
        // fps: parseFloat(i.fps) as number,
        // height: parseFloat(i.height) as number,
        // width: parseFloat(i.width) as number,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // vcodec: i.vcodec as string,
        // dynamic_range: i.dynamic_range as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // aspect_ratio: parseFloat(i.aspect_ratio) as number,
        // video_ext: i.video_ext as string,
        // vbr: parseFloat(i.vbr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no low i..");
  console.log("\n");
  if (tube.LowVideoHDR.length > 0) {
    console.log(colors.blue("Low Video HDR:"));
    tube.LowVideoHDR.forEach((i: any) => {
      console.log(colors.blue("@video:"), {
        filesize: sizeFormat(i.filesize) as number,
        // format_id: parseFloat(i.format_id) as number,
        // format_note: i.format_note as string,
        // fps: parseFloat(i.fps) as number,
        // height: parseFloat(i.height) as number,
        // width: parseFloat(i.width) as number,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // vcodec: i.vcodec as string,
        // dynamic_range: i.dynamic_range as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // aspect_ratio: parseFloat(i.aspect_ratio) as number,
        // video_ext: i.video_ext as string,
        // vbr: parseFloat(i.vbr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no low video HDR..");
  console.log("\n");
  if (tube.HighVideo.length > 0) {
    console.log(colors.blue("High Video:"));
    tube.HighVideo.forEach((i: any) => {
      console.log(colors.blue("@video:"), {
        filesize: sizeFormat(i.filesize) as number,
        // format_id: parseFloat(i.format_id) as number,
        // format_note: i.format_note as string,
        // fps: parseFloat(i.fps) as number,
        // height: parseFloat(i.height) as number,
        // width: parseFloat(i.width) as number,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // vcodec: i.vcodec as string,
        // dynamic_range: i.dynamic_range as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // aspect_ratio: parseFloat(i.aspect_ratio) as number,
        // video_ext: i.video_ext as string,
        // vbr: parseFloat(i.vbr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no high i..");
  console.log("\n");
  if (tube.HighVideoHDR.length > 0) {
    console.log(colors.blue("High Video HDR:"));
    tube.HighVideoHDR.forEach((i: any) => {
      console.log(colors.blue("@video:"), {
        filesize: sizeFormat(i.filesize) as number,
        // format_id: parseFloat(i.format_id) as number,
        // format_note: i.format_note as string,
        // fps: parseFloat(i.fps) as number,
        // height: parseFloat(i.height) as number,
        // width: parseFloat(i.width) as number,
        // has_drm: i.has_drm as boolean,
        // tbr: parseFloat(i.tbr) as number,
        // url: i.url as string,
        // ext: i.ext as string,
        // vcodec: i.vcodec as string,
        // dynamic_range: i.dynamic_range as string,
        // container: i.container as string,
        // resolution: i.resolution as string,
        // aspect_ratio: parseFloat(i.aspect_ratio) as number,
        // video_ext: i.video_ext as string,
        // vbr: parseFloat(i.vbr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no high video HDR..");
  console.log("\n");
  if (tube.LowManifest.length > 0) {
    console.log(colors.red("Low Manifest:"));
    tube.LowManifest.forEach((i: any) => {
      console.log(colors.red("@manifest:"), {
        format_id: parseFloat(i.format_id) as number,
        // url: i.url as string,
        // manifest_url: i.manifest_url as string,
        // tbr: parseFloat(i.tbr) as number,
        // ext: i.ext as string,
        // fps: parseFloat(i.fps) as number,
        // quality: parseFloat(i.quality) as number,
        // has_drm: i.has_drm as boolean,
        // width: parseFloat(i.width) as number,
        // height: parseFloat(i.height) as number,
        // vcodec: i.vcodec as string,
        // acodec: i.acodec as string,
        // dynamic_range: i.dynamic_range as string,
        // aspect_ratio: parseFloat(i.aspect_ratio) as number,
        // video_ext: i.video_ext as string,
        // audio_ext: i.audio_ext as string,
        // abr: parseFloat(i.abr) as number,
        // vbr: parseFloat(i.vbr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no low i..");
  console.log("\n");
  if (tube.HighManifest.length > 0) {
    console.log(colors.red("High Manifest:"));
    tube.HighManifest.forEach((i: any) => {
      console.log(colors.red("@manifest:"), {
        format_id: parseFloat(i.format_id) as number,
        // url: i.url as string,
        // manifest_url: i.manifest_url as string,
        // tbr: parseFloat(i.tbr) as number,
        // ext: i.ext as string,
        // fps: parseFloat(i.fps) as number,
        // quality: parseFloat(i.quality) as number,
        // has_drm: i.has_drm as boolean,
        // width: parseFloat(i.width) as number,
        // height: parseFloat(i.height) as number,
        // vcodec: i.vcodec as string,
        // acodec: i.acodec as string,
        // dynamic_range: i.dynamic_range as string,
        // aspect_ratio: parseFloat(i.aspect_ratio) as number,
        // video_ext: i.video_ext as string,
        // audio_ext: i.audio_ext as string,
        // abr: parseFloat(i.abr) as number,
        // vbr: parseFloat(i.vbr) as number,
        format: i.format as string,
      });
    });
  } else console.error(colors.red("@error:"), "no high i..");
});
// ===========================================================================
// console.clear();
// import * as fs from "fs";
// import colors from "colors";
// import * as path from "path";
// import { promisify } from "util";
// import ffmpeg from "fluent-ffmpeg";
// import { exec } from "child_process";
// import { progressBar } from "../../base/ffmpeg";

// function sizeFormat(filesize: number) {
// if (isNaN(filesize) || filesize < 0) return filesize;
// const bytesPerMegabyte = 1024 * 1024;
// const bytesPerGigabyte = bytesPerMegabyte * 1024;
// const bytesPerTerabyte = bytesPerGigabyte * 1024;
// if (filesize < bytesPerMegabyte) return filesize + " B";
// else if (filesize < bytesPerGigabyte) {
// return (filesize / bytesPerMegabyte).toFixed(2) + " MB";
// } else if (filesize < bytesPerTerabyte) {
// return (filesize / bytesPerGigabyte).toFixed(2) + " GB";
// } else return (filesize / bytesPerTerabyte).toFixed(2) + " TB";
// }

// async function Engine() {
// const LowAudio: any = {};
// const HighAudio: any = {};
// const LowVideo: any = {};
// const HighVideo: any = {};
// const LowManifest: any = {};
// const HighManifest: any = {};
// let payLoad: any = {
// manifest: [],
// LowAudio: [],
// HighAudio: [],
// LowVideo: [],
// HighVideo: [],
// LowManifest: [],
// HighManifest: [],
// };
// let maxT = 8;
// let pLoc = "";
// let dirC = process.cwd();
// while (maxT > 0) {
// const enginePath = path.join(dirC, "util", "engine");
// if (fs.existsSync(enginePath)) {
// pLoc = enginePath;
// break;
// } else {
// dirC = path.join(dirC, "..");
// maxT--;
// }
// }
// pLoc += " --proxy socks5://127.0.0.1:9050";
// pLoc += " --dump-single-json 'https://www.youtube.com/watch?v=AbFnsaDQMYQ'";
// pLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
// pLoc += ` --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"`;
// const metaCore = await promisify(exec)(pLoc);
// const metaTube = JSON.parse(metaCore.stdout.toString());
// await metaTube.formats.forEach((tube: any) => {
// const rm = new Set(["storyboard", "Default"]);
// if (!rm.has(tube.format_note) && tube.protocol === "m3u8_native" && tube.vbr) {
// if (!LowManifest[tube.resolution] || tube.vbr < LowManifest[tube.resolution].vbr)
// LowManifest[tube.resolution] = tube;
// if (!HighManifest[tube.resolution] || tube.vbr > HighManifest[tube.resolution].vbr)
// HighManifest[tube.resolution] = tube;
// }
// if (rm.has(tube.format_note) || tube.filesize === undefined || null) return;
// const prevLowVideo = LowVideo[tube.format_note];
// const prevHighVideo = HighVideo[tube.format_note];
// const prevLowAudio = LowAudio[tube.format_note];
// const prevHighAudio = HighAudio[tube.format_note];
// switch (true) {
// case tube.format_note.includes("p"):
// if (!prevLowVideo || tube.filesize < prevLowVideo.filesize)
// LowVideo[tube.format_note] = tube;
// if (!prevHighVideo || tube.filesize > prevHighVideo.filesize)
// HighVideo[tube.format_note] = tube;
// break;
// default:
// if (!prevLowAudio || tube.filesize < prevLowAudio.filesize)
// LowAudio[tube.format_note] = tube;
// if (!prevHighAudio || tube.filesize > prevHighAudio.filesize)
// HighAudio[tube.format_note] = tube;
// break;
// }
// });
// if (LowAudio) {
// Object.values(LowAudio).forEach((tube) => {
// payLoad.LowAudio.push(tube);
// });
// }
// if (HighAudio) {
// Object.values(HighAudio).forEach((tube) => {
// payLoad.HighAudio.push(tube);
// });
// }
// if (LowVideo) {
// Object.values(LowVideo).forEach((tube) => {
// payLoad.LowVideo.push(tube);
// });
// }
// if (HighVideo) {
// Object.values(HighVideo).forEach((tube) => {
// payLoad.HighVideo.push(tube);
// });
// }
// if (LowManifest) {
// Object.entries(LowManifest).forEach(([_resolution, tube]) => {
// payLoad.LowManifest.push(tube);
// });
// }
// if (HighManifest) {
// Object.entries(HighManifest).forEach(([_resolution, tube]) => {
// payLoad.HighManifest.push(tube);
// });
// }
// if (payLoad) return payLoad;
// else return null;
// }

// (async () => {
// const tube: any = await Engine();
// if (tube.LowAudio.length > 0) {
// console.log(colors.magenta("Low Audio:"));
// tube.LowAudio.forEach((i: any) => {
// console.log(colors.magenta("@audio:"), {
// filesize: sizeFormat(i.filesize),
// format_note: i.format_note,
// });
// });
// }
// console.log();
// if (tube.HighAudio.length > 0) {
// console.log(colors.magenta("High Audio:"));
// tube.HighAudio.forEach((i: any) => {
// console.log(colors.magenta("@audio:"), {
// filesize: sizeFormat(i.filesize),
// format_note: i.format_note,
// });
// });
// }
// console.log();
// if (tube.LowVideo.length > 0) {
// console.log(colors.blue("Low Video:"));
// tube.LowVideo.forEach((i: any) => {
// console.log(colors.blue("@video:"), {
// filesize: sizeFormat(i.filesize),
// format_note: i.format_note,
// });
// });
// }
// console.log();
// if (tube.HighVideo.length > 0) {
// console.log(colors.blue("High Video:"));
// tube.HighVideo.forEach((i: any) => {
// console.log(colors.blue("@video:"), {
// filesize: sizeFormat(i.filesize),
// format_note: i.format_note,
// });
// });
// }
// console.log();
// if (tube.LowManifest.length > 0) {
// console.log(colors.red("Low Manifest:"));
// tube.LowManifest.forEach((i: any) => {
// console.log(colors.red("@manifest:"), {
// resolution: i.resolution,
// vbr: i.vbr,
// });
// });
// }
// console.log();
// if (tube.HighManifest.length > 0) {
// console.log(colors.red("High Manifest:"));
// tube.HighManifest.forEach((i: any) => {
// console.log(colors.red("@manifest:"), {
// resolution: i.resolution,
// vbr: i.vbr,
// });
// });
// }
// console.log();
// const found = [
// tube.manifest[0],
// tube.manifest[2],
// tube.manifest[3],
// tube.manifest[4],
// tube.manifest[5],
// tube.manifest[6],
// tube.manifest[7],
// ];
// for (const f of found) {
// ffmpeg(f.manifest_url)
// .videoCodec("copy")
// .outputFormat("webm")
// .output(f.resolution + ".webm")
// .inputOptions(["-protocol_whitelist file,http,https,tcp,tls"])
// .on("start", (start) => console.log(start))
// .on("end", () => process.stdout.write("\n"))
// .on("progress", (progress) => progressBar(progress))
// .on("error", (error) => console.error(error.message))
// .run();
// }
// })();
// ===========================================================================
// console.clear();
// import { Client } from "youtubei";

// (async () => {
// try {
// const youtube = new Client();
// const videos = await youtube.search("Houdini", {
// type: "video",
// });
// videos.items.forEach((item) => {
// console.log({
// id: item.id,
// title: item.title,
// thumbnails: item.thumbnails,
// uploadDate: item.uploadDate,
// description: item.description,
// duration: item.duration,
// isLive: item.isLive,
// viewCount: item.viewCount,
// channelid: item.channel?.id,
// channelname: item.channel?.name,
// });
// });

// const playlist = await youtube.search("Houdini", {
// type: "playlist",
// });
// playlist.items.forEach((item) => {
// console.log({
// id: item.id,
// title: item.title,
// videoCount: item.videoCount,
// thumbnails: item.thumbnails,
// });
// });
// } catch (error) {
// console.error("Error occurred:", error);
// }
// })();
