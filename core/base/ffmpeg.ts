import * as fs from "fs";
import colors from "colors";
import fluentffmpeg from "fluent-ffmpeg";
import { execSync } from "child_process";
import type { FfmpegCommand } from "fluent-ffmpeg";

export default async function ffmpeg(): Promise<FfmpegCommand> {
  return new Promise(async (resolve) => {
    let proc: FfmpegCommand = fluentffmpeg();
    try {
      const ffprobePath = execSync("which ffprobe").toString().trim();
      const ffmpegPath = execSync("which ffmpeg").toString().trim();
      console.log(
        colors.green("@ffprobePath:"),
        ffprobePath,
        "|",
        colors.green("@ffmpegPath:"),
        ffmpegPath
      );
      if (fs.existsSync(ffmpegPath) && fs.existsSync(ffprobePath)) {
        proc.setFfprobePath(ffprobePath);
        proc.setFfmpegPath(ffmpegPath);
      } else {
        throw new Error(
          colors.red("@error: ") + "could not find the ffmpeg & ffprobe files."
        );
      }
    } catch (error) {
      throw new Error(
        colors.red("@error: ") +
          "An error occurred while locating ffmpeg & ffprobe executables."
      );
    }
    proc.addOption("-threads", "0");
    resolve(proc);
  });
}

/**
 * This function is not available
 *
 * let bvc: string | null = null;
 * let bac: string | null = null;
 * fluentffmpeg.getAvailableCodecs((err, codecs) => {
 * if (err) reject({ bvc: null, bac: null });
 * if (!codecs) reject({ bvc: null, bac: null });
 * Object.keys(codecs).forEach((codec) => {
 * if (codec.includes("h264") || codec.includes("hevc")) {
 * const ci = codecs[codec] as { capabilities?: string[] };
 * if (!bvc || ci.capabilities?.includes("GPU")) bvc = codec;
 * }
 * if (codec.includes("aac") || codec.includes("mp3")) {
 * const ci = codecs[codec] as { capabilities?: string[] };
 * if (!bac || ci.capabilities?.includes("GPU")) bac = codec;
 * }
 * });
 * if (bac && bvc) {
 * console.log(colors.green("@ffmpeg:"), "using video codec", bvc);
 * console.log(colors.green("@ffmpeg:"), "using audio codec", bac);
 * proc.videoCodec(bvc);
 * proc.audioCodec(bac);
 * } else {
 * console.log(colors.yellow("@ffmpeg:"), "no video & audio codec found.");
 * proc.videoCodec("");
 * proc.audioCodec("");
 * }
 * proc.videoCodec("");
 * proc.audioCodec("");
 * resolve(proc);
 * });
 *
 */
