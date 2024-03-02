import colors from "colors";
import fluent from "fluent-ffmpeg";
import { execSync } from "child_process";
import progressBar from "../base/progressBar";
import type { FfmpegCommand } from "fluent-ffmpeg";

function gpuffmpeg(input: string): FfmpegCommand {
  const getTerm = (command: string) => {
    try {
      return execSync(command).toString().trim();
    } catch (error) {
      return undefined;
    }
  };
  // =====================================[FFMPEG-LOGIC]=====================================
  const ffmpeg: FfmpegCommand = fluent()
    .setFfprobePath("util/ffmpeg/bin/ffmpeg")
    .setFfmpegPath("util/ffmpeg/bin/ffprobe")
    .input(input)
    .on("start", () => {
      progressBar({ timemark: undefined, percent: undefined });
    })
    .on("progress", ({ percent, timemark }) => {
      progressBar({ timemark, percent });
    })
    .on("end", () => {
      console.log(colors.green("@ffmpeg:"), "completed");
      progressBar({ timemark: undefined, percent: undefined });
    })
    .on("error", (error) => {
      console.error(colors.red("@ffmpeg:"), error.message);
      progressBar({ timemark: undefined, percent: undefined });
    });

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
