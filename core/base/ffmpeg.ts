import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import readline from "readline";
import fluent from "fluent-ffmpeg";
import { execSync } from "child_process";
import type { FfmpegCommand } from "fluent-ffmpeg";

let color = colors.green;
let maxTries: number = 6;
let currentDir: string = __dirname;
let FfprobePath: string, FfmpegPath: string;

function gpuffmpeg(input: string, verbose?: boolean): FfmpegCommand {
  const progressBar = (prog: any) => {
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return "0 B";
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };
    if (prog.timemark === undefined || prog.percent === undefined) return;
    if (prog.percent < 1 && prog.timemark.includes("-")) return;
    readline.cursorTo(process.stdout, 0);
    if (prog.percent < 30) color = colors.red;
    else if (prog.percent < 60) color = colors.yellow;
    const width = Math.floor(process.stdout.columns / 3);
    const scomp = Math.round((width * prog.percent) / 100);
    const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
    process.stdout.write(
      color("@prog: ") +
        sprog +
        color("@percent: ") +
        prog.percent.toFixed(2) +
        "% " +
        color("@timemark: ") +
        prog.timemark +
        "s " +
        color("@frames: ") +
        prog.frames +
        ", " +
        color("@currentFps: ") +
        prog.currentFps +
        ", " +
        color("@rate: ") +
        prog.currentKbps +
        "kbps, " +
        color("@size: ") +
        formatBytes(prog.targetSize)
    );
    if (prog.timemark.includes("-")) process.stdout.write("\n");
  };
  const getTerm = (command: string) => {
    try {
      return execSync(command).toString().trim();
    } catch {
      return undefined;
    }
  };
  const ffmpeg: FfmpegCommand = fluent(input)
    .on("start", (command) => {
      if (verbose) console.log(colors.green("\n@ffmpeg:"), command);
    })
    .on("progress", (prog) => progressBar(prog))
    .on("end", () => console.log(colors.green("\n@ffmpeg:"), "ended"))
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
