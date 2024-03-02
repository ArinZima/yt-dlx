console.clear();
import * as fs from "fs";
import colors from "colors";
import { execSync } from "child_process";
import fluentffmpeg from "fluent-ffmpeg";
import progressBar from "../base/progressBar";

function ffmpeg(): fluentffmpeg.FfmpegCommand {
  let gpuVendor: string | undefined;
  let ffmpegpath: string | undefined;
  let ffprobepath: string | undefined;
  const getTerm = (command: string) => {
    try {
      return execSync(command).toString().trim();
    } catch (error) {
      return undefined;
    }
  };
  // =====================================[FFMPEG-LOGIC]=====================================
  const ffmpeg: fluentffmpeg.FfmpegCommand = fluentffmpeg()
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

  // =====================================[FFMPEG_FFPROBE-LOGIC]=====================================
  try {
    ffprobepath = getTerm("which ffprobe");
    ffmpegpath = getTerm("which ffmpeg");
  } catch (error: any) {
    console.error(colors.red("@ffmpeg:"), error.message);
  }
  switch (true) {
    case !!(ffprobepath && ffmpegpath):
      console.log(
        colors.green("@ffmpeg: both ffprobe and ffmpeg paths are set.")
      );
      ffmpeg.setFfprobePath(ffprobepath);
      ffmpeg.setFfmpegPath(ffmpegpath);
      break;
    case !!(!ffprobepath && ffmpegpath):
      console.error(
        colors.red(
          "@ffmpeg: ffprobe path is not found. using fluent-ffmpeg default paths."
        )
      );
      ffmpeg.setFfmpegPath(ffmpegpath);
      break;
    case !!(ffprobepath && !ffmpegpath):
      console.error(
        colors.red(
          "@ffmpeg: ffmpeg path is not found. using fluent-ffmpeg default paths."
        )
      );
      ffmpeg.setFfprobePath(ffprobepath);
      break;
    default:
      console.error(
        colors.red(
          "@ffmpeg: neither ffprobe nor ffmpeg path is found. using fluent-ffmpeg default paths."
        )
      );
      break;
  }
  // =====================================[GPU-LOGIC]=====================================
  try {
    gpuVendor =
      getTerm("nvidia-smi --query-gpu=name --format=csv,noheader") ||
      getTerm("rocm-smi --show_product_name") ||
      getTerm("intel_gpu_top -s");
  } catch (error) {
    gpuVendor = undefined;
  }
  switch (true) {
    case gpuVendor &&
      (gpuVendor.includes("AMD") || gpuVendor.includes("Intel")):
      console.log(colors.green("@ffmpeg: using GPU " + gpuVendor));
      ffmpeg.withVideoCodec("h264_vaapi");
      break;
    case gpuVendor && gpuVendor.includes("NVIDIA"):
      console.log(colors.green("@ffmpeg: using GPU " + gpuVendor));
      ffmpeg.withInputOption("-hwaccel cuda");
      ffmpeg.withVideoCodec("h264_nvenc");
      break;
    default:
      console.log(
        colors.yellow("@ffmpeg:"),
        "GPU vendor not recognized.",
        "Defaulting to software processing."
      );
  }
  return ffmpeg;
}

import Agent from "../base/Agent";
import bigEntry from "../base/bigEntry";
Agent({
  query: "3:15",
})
  .then(async (data) => {
    const [EntryAudio, EntryVideo] = await Promise.all([
      bigEntry(data.AudioStore),
      bigEntry(data.VideoStore),
    ]);
    if (!EntryAudio || !EntryVideo) return;
    ffmpeg()
      .input(EntryVideo.AVDownload.mediaurl)
      .addInput(EntryAudio.AVDownload.mediaurl)
      .outputFormat("matroska")
      .pipe(fs.createWriteStream("mix.mkv"), {
        end: true,
      });
    ffmpeg()
      .input(EntryVideo.AVDownload.mediaurl)
      .addInput(EntryAudio.AVDownload.mediaurl)
      .outputFormat("avi")
      .pipe(fs.createWriteStream("Audio.avi"), {
        end: true,
      });
    ffmpeg()
      .input(EntryVideo.AVDownload.mediaurl)
      .addInput(EntryAudio.AVDownload.mediaurl)
      .outputFormat("matroska")
      .pipe(fs.createWriteStream("Video.mkv"), {
        end: true,
      });
  })
  .catch((error) => console.error(error.message));
