import colors from "colors";
import fluentffmpeg from "fluent-ffmpeg";
import type { FfmpegCommand } from "fluent-ffmpeg";

export default async function ffmpeg(): Promise<FfmpegCommand> {
  return new Promise((resolve, reject) => {
    let bvc: string | null = null;
    let bac: string | null = null;
    let proc: FfmpegCommand = fluentffmpeg();
    fluentffmpeg.getAvailableCodecs((err, codecs) => {
      if (err) reject({ bvc: null, bac: null });
      if (!codecs) reject({ bvc: null, bac: null });
      Object.keys(codecs).forEach((codec) => {
        if (codec.includes("h264") || codec.includes("hevc")) {
          const ci = codecs[codec] as { capabilities?: string[] };
          if (!bvc || ci.capabilities?.includes("GPU")) bvc = codec;
        }
        if (codec.includes("aac") || codec.includes("mp3")) {
          const ci = codecs[codec] as { capabilities?: string[] };
          if (!bac || ci.capabilities?.includes("GPU")) bac = codec;
        }
      });
      if (bac && bvc) {
        console.log(colors.blue("@ffmpeg:"), "using video codec", bvc);
        console.log(colors.blue("@ffmpeg:"), "using audio codec", bac);
        proc.withVideoCodec(bvc);
        proc.withAudioCodec(bac);
      } else {
        console.log(colors.yellow("@ffmpeg:"), "no video & audio codec found.");
        proc.withVideoCodec("");
        proc.withAudioCodec("");
      }
      resolve(proc);
    });
  });
}
