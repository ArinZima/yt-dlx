// console.clear();
// import path from "path";
// import fs from "fs-extra";
// import colors from "colors";
// import * as bun from "bun:test";
// import AudioVideoHighest from "../pipes/mix/AudioVideoHighest";

// bun.test(colors.blue("\n\n@tesing: ") + "Quick-Tests()", async () => {
// try {
// const metaTube: any = await AudioVideoHighest({
// query: "sQEgklEwhSo",
// folderName: ".temp",
// verbose: false,
// stream: true,
// });
// const outputPath = path.join(metaTube.filename);
// const writeStream = fs.createWriteStream(outputPath);
// await metaTube.stream.pipe(writeStream);
// metaTube.stream.on("end", () => {
// console.log(colors.green("@info:"), "Download completed");
// });
// metaTube.stream.on("error", (error: any) => {
// console.error(colors.red("@error:"), error.message);
// });
// } catch (error: any) {
// console.error(colors.red("@error:"), error.message);
// }
// });

import colors from "colors";
import fluentffmpeg from "fluent-ffmpeg";
import type { FfmpegCommand } from "fluent-ffmpeg";

async function ffmpeg(): Promise<FfmpegCommand> {
  return new Promise((resolve, reject) => {
    let bvc: string | null = null;
    let bac: string | null = null;
    let proc: FfmpegCommand = fluentffmpeg();
    fluentffmpeg.getAvailableCodecs((err, codecs) => {
      if (err) reject({ bvc: null, bac: null });
      if (!codecs) reject({ bvc: null, bac: null });
      Object.keys(codecs).forEach((codec) => {
        if (codec.includes("h264") || codec.includes("hevc")) {
          const ci = codecs[codec] as { capabilities?: string[] };
          if (!bvc || ci.capabilities?.includes("GPU")) bvc = codec;
        }
        if (codec.includes("aac") || codec.includes("mp3")) {
          const ci = codecs[codec] as { capabilities?: string[] };
          if (!bac || ci.capabilities?.includes("GPU")) bac = codec;
        }
      });
      if (bac && bvc) {
        console.log(colors.green("@ffmpeg:"), "using video codec", bvc);
        console.log(colors.green("@ffmpeg:"), "using audio codec", bac);
        proc.withVideoCodec(bvc);
        proc.withAudioCodec(bac);
      } else {
        console.log(colors.yellow("@ffmpeg:"), "no video codec found.");
        console.log(colors.yellow("@ffmpeg:"), "no audio codec found.");
        proc.withVideoCodec("");
        proc.withAudioCodec("");
      }
      resolve(proc);
    });
  });
}

(async () => {
  const proc: FfmpegCommand = await ffmpeg();
  console.log(proc);
})();
