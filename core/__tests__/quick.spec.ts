console.clear();
import * as fs from "fs";
import colors from "colors";
import { execSync } from "child_process";
import fluentffmpeg from "fluent-ffmpeg";
import progressBar from "../base/progressBar";

function ffmpeg(url: string): fluentffmpeg.FfmpegCommand {
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
    .input(url)
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
  // try {
  // gpuVendor =
  // getTerm("nvidia-smi --query-gpu=name --format=csv,noheader") ||
  // getTerm("rocm-smi --show_product_name") ||
  // getTerm("intel_gpu_top -s");
  // } catch (error) {
  // gpuVendor = undefined;
  // }
  // switch (true) {
  // case gpuVendor &&
  // (gpuVendor.includes("AMD") || gpuVendor.includes("Intel")):
  // console.log(colors.green("@ffmpeg: using GPU " + gpuVendor));
  // ffmpeg.withVideoCodec("h264_vaapi");
  // break;
  // case gpuVendor && gpuVendor.includes("NVIDIA"):
  // console.log(colors.green("@ffmpeg: using GPU " + gpuVendor));
  // ffmpeg.withInputOption("-hwaccel cuda");
  // ffmpeg.withVideoCodec("h264_nvenc");
  // break;
  // default:
  // console.log(
  // colors.yellow("@ffmpeg:"),
  // "GPU vendor not recognized.",
  // "Defaulting to software processing."
  // );
  // }
  return ffmpeg;
}

const videoLink =
  "https://rr5---sn-gwpa-niad.googlevideo.com/videoplayback?expire=1709392729&ei=-e7iZZToI6Du2roP2a-YoAE&ip=2409%3A40e1%3Aa%3Abdd4%3A13db%3A5d5a%3Ad07b%3A72ae&id=o-AEGrn5OrXil3vJuEWAjonrZYL4-laPKE9cAAQe86orxA&itag=271&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=bQ&mm=31%2C29&mn=sn-gwpa-niad%2Csn-qxaeen7l&ms=au%2Crdu&mv=m&mvi=5&pl=36&initcwndbps=407500&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=539424&dur=183.983&lmt=1705829926354675&mt=1709370539&fvip=2&keepalive=yes&fexp=24007246&c=IOS&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgQmtpc3i0qwFDQGhIVEGw5eWFoh0OV3Hrgw4ekuAiq1YCIBmGa9ioejkPidqe4jAm0fr4cIbmGVctrZH2v55m5dbG&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRQIhAP6pejw6csuCBAvAlKAA4hoj69w7WMAd4_c6mscpx5b_AiBl54HNI7SICP-kC-6ku35nO3qKSYmKF5MpIzaeAaw4Vw%3D%3D";

ffmpeg(videoLink)
  .outputFormat("matroska")
  .pipe(fs.createWriteStream("output.mkv"), {
    end: true,
  });

ffmpeg(videoLink).outputFormat("avi").pipe(fs.createWriteStream("output.avi"), {
  end: true,
});

ffmpeg(videoLink)
  .outputFormat("webm")
  .pipe(fs.createWriteStream("output.webm"), {
    end: true,
  });
