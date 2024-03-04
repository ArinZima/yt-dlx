console.clear();
import bytes from "bytes";
import readline from "readline";
import { spawn } from "child_process";
import speedometer from "speedometer";

const speed = speedometer();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const url =
  "https://rr5---sn-gwpa-niaz.googlevideo.com/videoplayback?expire=1709574426&ei=urTlZdn6Gd64rtoPubC30A0&ip=2409%3A40e1%3A1079%3A5c0d%3A2873%3A3e6%3A45b3%3Ab71f&id=o-ACQEfKStR6Qrw3xg5UCSTWV2Ritqy30j2uOl3HQonqh2&itag=140&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=my&mm=31%2C29&mn=sn-gwpa-niaz%2Csn-qxaelnez&ms=au%2Crdu&mv=m&mvi=5&pl=36&initcwndbps=522500&vprv=1&svpuc=1&mime=audio%2Fmp4&gir=yes&clen=4832946&dur=298.585&lmt=1709439405833807&mt=1709552480&fvip=1&keepalive=yes&fexp=24007246&beids=24350319&c=IOS&txp=5532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgeYZtc5QW0KL0oI9FUzi3rFJWQmUWH_5ZOOUwtKMJc3ACIQD0Imx_toSa1vWYQPHTGxajOfeJHuFTizIrkfgo08CYlA%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRgIhAKmt3ChBmZRRFkKQnB_FUm4YVv3kQiz7IOBiOMOYw59pAiEA4UXb_TjnSlqyqcopUh5ZVIY4k0rC-FwEY2HQSFebblI%3D";

const ffmpeg = spawn("ffmpeg", ["-y", "-i", url, "-c", "copy", "music.avi"]);
ffmpeg.stderr.on("data", (data) => {
  const stderrString = data.toString();
  const matches = stderrString.match(
    /size=\s*(\d+)kB\s*time=([^ ]+)\s*bitrate=\s*(\d+\.\d+)\s*/
  );
  if (matches) {
    const sizeInBytes = parseInt(matches[1]) * 1024;
    const downloadSpeed = speed(sizeInBytes);
    rl.write(null, { ctrl: true, name: "u" });
    rl.write(
      `@time: ${matches[2]} | @bitrate: ${matches[3]} kbits/s | @size: ${bytes(
        sizeInBytes
      )} | @network: ${bytes(downloadSpeed)}/s`
    );
  }
});
ffmpeg.stdout.on("data", (data) => console.log("stdout:", data));
ffmpeg.on("error", (err) => console.error("@error:", err));
ffmpeg.on("close", () => process.exit(0));
