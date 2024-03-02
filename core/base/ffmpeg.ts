import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import readline from "readline";
import fluent from "fluent-ffmpeg";
import { execSync } from "child_process";
import type { FfmpegCommand } from "fluent-ffmpeg";

interface ProgressData {
  currentKbps: number | undefined;
  targetSize: number | undefined;
  currentFps: number | undefined;
  timemark: string | undefined;
  percent: number | undefined;
  frames: number | undefined;
}

export function progressBar(prog: ProgressData) {
  if (
    prog.currentKbps === undefined ||
    prog.currentFps === undefined ||
    prog.targetSize === undefined ||
    prog.timemark === undefined ||
    prog.percent === undefined ||
    prog.frames === undefined
  ) {
    return;
  }
  let color = colors.green;
  if (prog.percent >= 98) prog.percent = 100;
  readline.cursorTo(process.stdout, 0);
  const width = Math.floor(process.stdout.columns / 3);
  const scomp = Math.round((width * prog.percent) / 100);
  if (prog.percent < 20) color = colors.red;
  else if (prog.percent < 60) color = colors.yellow;
  const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
  process.stdout.write(
    color("@prog: ") +
      sprog +
      " " +
      prog.percent.toFixed(2) +
      "% " +
      color("@timemark: ") +
      prog.timemark +
      color(" @currentKbps: ") +
      prog.currentKbps.toFixed(2) +
      " " +
      color("@frames: ") +
      prog.frames +
      " " +
      color("@currentFps: ") +
      prog.currentFps +
      " " +
      color("@targetSize: ") +
      prog.targetSize
  );
  if (prog.percent >= 99) process.stdout.write("\n");
}

function gpuffmpeg(input: string, verbose?: boolean): FfmpegCommand {
  const getTerm = (command: string) => {
    try {
      return execSync(command).toString().trim();
    } catch (error) {
      return undefined;
    }
  };
  // =====================================[FFMPEG-LOGIC]=====================================
  const ffmpeg: FfmpegCommand = fluent()
    .input(input)
    .on("progress", (prog) => {
      progressBar({
        currentKbps: prog.currentKbps,
        targetSize: prog.targetSize,
        currentFps: prog.currentFps,
        timemark: prog.timemark,
        percent: prog.percent,
        frames: prog.frames,
      });
    })
    .on("start", (command) => {
      if (verbose) console.log(colors.green("\n@ffmpeg:"), command);
    })
    .on("end", () => {
      console.log(colors.green("\n@ffmpeg:"), "completed");
    })
    .on("error", (error) => {
      console.error(colors.red("@ffmpeg:"), error.message);
    });
  // =====================================[FFMPEG_FFPROBE-LOGIC]=====================================
  let maxTries = 6;
  let currentDir = __dirname;
  let FfprobePath, FfmpegPath;
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
  // =====================================[GPU-LOGIC]=====================================
  let gpuVendor: string | undefined;
  try {
    gpuVendor = getTerm("nvidia-smi --query-gpu=name --format=csv,noheader");
  } catch (error) {
    gpuVendor = undefined;
  }
  switch (true) {
    case gpuVendor && gpuVendor.includes("NVIDIA"):
      console.log(colors.green("@ffmpeg: using GPU " + gpuVendor));
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
