import { execSync } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import colors from "colors";

const url =
  "https://rr2---sn-gwpa-niad.googlevideo.com/videoplayback?expire=1709381528&ei=OMPiZY_XN9q34t4Py5-AwAc&ip=2409%3A40e1%3Aa%3Abdd4%3A13db%3A5d5a%3Ad07b%3A72ae&id=o-ABs9tgWdJ4_qymWJC8pr5vhFJFdZiYlCyxAs8JVBPOjZ&itag=251&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Ny&mm=31%2C29&mn=sn-gwpa-niad%2Csn-qxaeenls&ms=au%2Crdu&mv=m&mvi=2&pl=36&gcr=in&initcwndbps=487500&spc=UWF9f8uogMW3AwheQQ77COXDo--4yOMcgKnNKeJjUGoj31Y&vprv=1&svpuc=1&mime=audio%2Fwebm&gir=yes&clen=3318768&dur=194.141&lmt=1706318180112794&mt=1709359511&fvip=1&keepalive=yes&fexp=24007246&c=ANDROID&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgDxhXMVA6yt6nbCsY5JJOhCYLm7SmMaGBGvLKQGDYjz8CIH93cXl5WcxsvksY16t6XkBg0Fnry-IiIlnUfZkRCiov&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRQIhAISQiLSlWRCzrRNt9KHxoRrjNB90OBqqAS1B1M0wc731AiB6TmSG4wSXTyxCUYnTY_XuLei5xm2zbLAxO4fS88Nf6g%3D%3D";
const gpuVendor = execSync("nvidia-smi --query-gpu=name --format=csv,noheader")
  .toString()
  .trim();

const proc = ffmpeg()
  .input(url)
  .inputOptions("-hwaccel cuda")
  .on("progress", ({ percent, timemark, currentKbps }) => {
    const text = `${colors.green("@prog:")} ${percent}% | ${colors.green(
      "@time:"
    )} ${timemark} | ${colors.green("@rate:")} ${currentKbps}kbps`;
    console.log(text);
  })
  .on("start", (cmd) => console.log(colors.green("@ffmpegStart:"), cmd))
  .on("error", (err) => console.log(colors.red("@ffmpegError:"), err.message))
  .on("end", () =>
    console.log(colors.green("@ffmpegEnd:"), "Conversion completed")
  );

if (gpuVendor) {
  console.log(colors.green("@ffmpegGPU:"), gpuVendor);
  if (gpuVendor.includes("NVIDIA")) {
    proc.videoCodec("h264_nvenc");
  } else if (gpuVendor.includes("AMD")) {
    proc.videoCodec("h264_vaapi");
  } else if (gpuVendor.includes("Intel")) {
    proc.videoCodec("h264_vaapi");
  } else {
    console.log(
      colors.yellow("@ffmpegGPU:"),
      "GPU vendor not recognized. Defaulting to software processing."
    );
  }
} else {
  console.log(
    colors.yellow("@ffmpegGPU:"),
    "No GPU detected. Defaulting to software processing."
  );
}

proc.output("output.mp4");
proc.run();
