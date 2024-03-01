import * as fs from "fs";
import colors from "colors";
import fluentffmpeg from "fluent-ffmpeg";
import { execSync } from "child_process";

export default async function ffmpeg(): Promise<fluentffmpeg.FfmpegCommand> {
  let proc: fluentffmpeg.FfmpegCommand = fluentffmpeg();
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
  return proc;
}
/**
 * TODO implement this method when yt-dlx is stable
 * const hasGPU = execSync("nvidia-smi --query-gpu=name --format=csv,noheader")
 * .toString().trim();
 * if (hasGPU) {
 * console.log(colors.green("@ffmpegGPU:"), hasGPU);
 * proc.addOption("-c:v", "h264_nvenc");
 * } else console.log(colors.yellow("@ffmpegGPU:"), "no GPU detected.");
 *
 */
