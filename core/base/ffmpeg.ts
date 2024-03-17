import * as os from "os";
import colors from "colors";
import ffmpeg from "fluent-ffmpeg";
import { progressBar } from "./progressBar";
import type { FfmpegCommand as proTubeCommand } from "fluent-ffmpeg";

export default async function proTube({
  adata,
  vdata,
  ipAddress,
}: {
  adata?: any;
  vdata?: any;
  ipAddress: string;
}): Promise<proTubeCommand> {
  const ff: proTubeCommand = ffmpeg();
  if (vdata && !adata) ff.addInput(vdata.AVDownload.mediaurl);
  else if (adata && !vdata) ff.addInput(adata.AVDownload.mediaurl);
  else if (adata && vdata) {
    ff.addInput(vdata.AVDownload.mediaurl);
    ff.addInput(adata.AVDownload.mediaurl);
    ff.withOutputOptions(["-map 0:v:0", "-map 1:a:0"]);
  }
  console.log(
    colors.green("@ffmpeg:"),
    "using",
    colors.green("ipAddress"),
    ipAddress
  );
  const numCores = os.cpus().length;
  const numThreads = numCores * 2;
  ff.outputOptions("-c copy");
  ff.addOption("-threads", numThreads.toString());
  ff.addOption("-headers", `X-Forwarded-For: ${ipAddress}`);
  ff.on("progress", (progress) => progressBar(progress));
  ff.on("end", () => process.stdout.write("\n"));
  ff.on("error", (error) => {
    throw new Error(error.message);
  });
  return ff;
}
