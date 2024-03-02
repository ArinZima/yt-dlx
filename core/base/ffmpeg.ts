import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import fluent from "fluent-ffmpeg";
import { execSync } from "child_process";
import progressBar from "../base/progressBar";
import type { FfmpegCommand } from "fluent-ffmpeg";

let maxTries: number = 6;
let currentDir: string = __dirname;
let FfprobePath: string, FfmpegPath: string;
function gpuffmpeg(input: string, verbose?: boolean): FfmpegCommand {
  const ffmpeg: FfmpegCommand = fluent()
    .input(input)
    .on("start", (command) => {
      if (verbose) console.log(colors.green("\n@ffmpeg:"), command);
    })
    .on("progress", ({ percent, timemark }) => {
      progressBar({ timemark, percent });
    })
    .on("end", () => console.log(colors.green("\n@ffmpeg:"), "ended"))
    .on("close", () => console.log(colors.green("\n@ffmpeg:"), "closed"))
    .on("finish", () => console.log(colors.green("\n@ffmpeg:"), "finish"))
    .on("error", (e) => console.error(colors.red("\n@ffmpeg:"), e.message));
  while (maxTries > 0) {
    FfprobePath = path.join(currentDir, "util", "ffmpeg", "bin", "ffprobe");
    FfmpegPath = path.join(currentDir, "util", "ffmpeg", "bin", "ffmpeg");
    if (fs.existsSync(FfprobePath) && fs.existsSync(FfmpegPath)) {
      ffmpeg.setFfprobePath(FfprobePath);
      ffmpeg.setFfmpegPath(FfmpegPath);
      break;
    } else {
      currentDir = path.join(currentDir, "..");
      maxTries--;
    }
  }
  const getTerm = (command: string) => {
    try {
      return execSync(command).toString().trim();
    } catch {
      return undefined;
    }
  };
  const vendor = getTerm("nvidia-smi --query-gpu=name --format=csv,noheader");
  switch (true) {
    case vendor && vendor.includes("NVIDIA"):
      console.log(colors.green("@ffmpeg: using GPU " + vendor));
      ffmpeg.withInputOption("-hwaccel cuda");
      ffmpeg.withVideoCodec("h264_nvenc");
      break;
    default:
      console.log(
        colors.yellow("@ffmpeg:"),
        "GPU vendor not recognized.",
        "defaulting to software processing."
      );
  }
  return ffmpeg;
}
export default gpuffmpeg;
export type { FfmpegCommand as gpuffmpegCommand };
