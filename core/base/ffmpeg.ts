import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import readline from "readline";
import fluent from "fluent-ffmpeg";
import { execSync } from "child_process";
import type { FfmpegCommand } from "fluent-ffmpeg";
import runFunc from "./runFunc";

export function progressBar(prog: any, size: string) {
  if (prog.timemark === undefined || prog.percent === undefined) return;
  if (prog.percent < 1 && prog.timemark.includes("-")) return;
  readline.cursorTo(process.stdout, 0);
  let color = colors.green;
  if (prog.percent > 98) prog.percent = 100;
  if (prog.percent < 25) color = colors.red;
  else if (prog.percent < 50) color = colors.yellow;
  const width = Math.floor(process.stdout.columns / 4);
  const scomp = Math.round((width * prog.percent) / 100);
  const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
  let output =
    color("@prog: ") +
    sprog +
    " " +
    prog.percent.toFixed(2) +
    "% | " +
    color("@timemark: ") +
    prog.timemark;
  if (prog.frames !== 0 && !isNaN(prog.frames)) {
    output += " | " + color("@frames: ") + prog.frames;
  }
  if (prog.currentFps !== 0 && !isNaN(prog.currentFps)) {
    output += " | " + color("@fps: ") + prog.currentFps;
  }
  output += " | " + color("@size: ") + size;
  process.stdout.write(output);
  if (prog.timemark.includes("-")) process.stdout.write("\n\n");
}

async function gpuffmpeg({
  size,
  input,
  verbose,
}: {
  size: string;
  input: string;
  verbose?: boolean;
}): Promise<FfmpegCommand> {
  const response = await runFunc(async () => {
    let maxTries: number = 6;
    let currentDir: string = __dirname;
    let FfprobePath: string, FfmpegPath: string;
    const getTerm = (command: string) => {
      try {
        return execSync(command).toString().trim();
      } catch {
        return undefined;
      }
    };
    const ffmpeg: FfmpegCommand = fluent(input)
      .on("start", (command) => {
        if (verbose) console.log(colors.green("@ffmpeg:"), command);
      })
      .on("progress", (prog) => progressBar(prog, size))
      .on("end", () => console.log("\n"))
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
        console.log(
          colors.green("@ffmpeg:"),
          "using GPU",
          colors.green(vendor)
        );
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
    ffmpeg.withOutputOption("-shortest");
    return ffmpeg;
  });
  return response;
}
export default gpuffmpeg;
export type { FfmpegCommand as gpuffmpegCommand };
