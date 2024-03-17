import * as os from "os";
import colors from "colors";
import ffmpeg from "fluent-ffmpeg";
import { progressBar } from "./progressBar";
import type { FfmpegCommand as proTubeCommand } from "fluent-ffmpeg";

interface ProTubeOptions {
  adata?: string;
  vdata?: string;
  ipAddress: string;
}

export default async function proTube({
  adata,
  vdata,
  ipAddress,
}: ProTubeOptions): Promise<proTubeCommand> {
  return new Promise(async (resolve, reject) => {
    const numThreads = os.cpus().length * 2;
    const ff: proTubeCommand = ffmpeg();
    ff.outputFormat("matroska");
    ff.outputOptions("-c copy");
    ff.addOption("-threads", numThreads.toString());
    ff.addOption("-headers", "X-Forwarded-For: " + ipAddress);
    if (vdata && !adata) ff.addInput(vdata);
    if (adata && !vdata) ff.addInput(adata);
    if (adata && vdata) {
      ff.addInput(vdata);
      ff.addInput(adata);
      ff.withOutputOptions(["-map 0:v:0", "-map 1:a:0"]);
    }
    console.log(
      colors.green("@info:"),
      "ffmpeg using",
      colors.green("ipAddress"),
      ipAddress
    );
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("error", (error) => reject(error.message));
    ff.on("progress", (progress) => progressBar(progress));
    resolve(ff);
  });
}
