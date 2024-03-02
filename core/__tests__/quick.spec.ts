console.clear();
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
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
    .on("start", (cmd) => {
      console.log(colors.green("@ffmpeg:"), cmd);
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

ffmpeg(
  "https://rr2---sn-gwpa-niad.googlevideo.com/videoplayback?expire=1709384369&ei=Uc7iZYaWA67BrtoP76OQgAY&ip=2409%3A40e1%3Aa%3Abdd4%3A13db%3A5d5a%3Ad07b%3A72ae&id=o-AK5H9-i-gU2YK_F4qo8dQgTOOu9h5NiGSvwnmRGm6Ftg&itag=137&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Ny&mm=31%2C29&mn=sn-gwpa-niad%2Csn-qxaelned&ms=au%2Crdu&mv=m&mvi=2&pcm2cms=yes&pl=36&gcr=in&initcwndbps=480000&vprv=1&svpuc=1&mime=video%2Fmp4&gir=yes&clen=59629419&dur=194.110&lmt=1706319416857349&mt=1709362148&fvip=4&keepalive=yes&fexp=24007246&c=IOS&txp=453C434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhALnFchG73wBsCWToO5eh-7xIrO-QARchhtPmfUrNzK0LAiEAzm98CAuFLAWKsKqP74S8YVcPiKxxgOMY8boQ-vt_MDY%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRgIhAO4Mf1vQsl0As0K1AR09s8yLVpMt_IgbAVZWZ0QJOTdbAiEAsWrruHbTsgtXZc9koxqJQDjFAOH7jtgFSTCQXjvSJ2E%3D"
).pipe(fs.createWriteStream(path.join("output.mkv")), { end: true });
