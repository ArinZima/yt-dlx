console.clear();
import * as fs from "fs";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import Agent from "../../base/Agent";
import bigEntry from "../../base/bigEntry";
import { progressBar } from "../../base/ffmpeg";
import type TubeConfig from "../../interface/TubeConfig";
import type EngineResult from "../../interface/EngineResult";

async function proTube({
  adata,
  vdata,
  metaTube,
}: {
  adata: TubeConfig;
  vdata: TubeConfig;
  metaTube: any;
}): Promise<ffmpeg.FfmpegCommand> {
  let max: number = 6;
  const fluent = ffmpeg();
  let dirC: string = __dirname;
  let ffprobepath: string, ffmpegpath: string;
  while (max > 0) {
    ffprobepath = path.join(dirC, "util", "ffmpeg", "bin", "ffprobe");
    ffmpegpath = path.join(dirC, "util", "ffmpeg", "bin", "ffmpeg");
    if (fs.existsSync(ffprobepath) && fs.existsSync(ffmpegpath)) {
      fluent.setFfprobePath(ffprobepath);
      fluent.setFfmpegPath(ffmpegpath);
      break;
    } else {
      dirC = path.join(dirC, "..");
      max--;
    }
  }
  fluent.addInput(vdata.AVDownload.mediaurl);
  fluent.addInput(adata.AVDownload.mediaurl);
  fluent.withOutputOptions(["-map 0:v:0", "-map 1:a:0"]);
  fluent.withVideoCodec("copy");
  fluent.withAudioCodec("copy");
  fluent.addInput(metaTube.thumbnail);
  if (adata.Audio.bitrate) {
    fluent.withAudioBitrate(adata.Audio.bitrate);
  }
  if (vdata.Audio.bitrate) {
    fluent.withVideoBitrate(vdata.Audio.bitrate);
  }
  if (adata.Audio.channels) {
    fluent.withAudioChannels(adata.Audio.channels);
  }
  if (vdata.AVInfo.framespersecond) {
    fluent.withFPS(vdata.AVInfo.framespersecond);
  }
  if (vdata.Video.aspectratio) {
    fluent.withAspectRatio(vdata.Video.aspectratio);
  }
  fluent.on("progress", (progress) => {
    progressBar(progress, vdata.AVInfo.filesizeformatted.toString());
  });
  fluent.on("end", () => process.stdout.write("\n"));
  fluent.on("error", (error) => {
    throw new Error(error.message);
  });
  return fluent;
}

(async () => {
  try {
    const { AudioStore, VideoStore, metaTube } = (await Agent({
      verbose: false,
      torproxy: "socks5://127.0.0.1:9050",
      query: "https://youtu.be/6POZlJAZsok?si=owoDFiB9laKgC_oU",
    })) as EngineResult;
    const [adata, vdata] = await Promise.all([
      await bigEntry(AudioStore),
      await bigEntry(VideoStore),
    ]);
    const probe = await proTube({
      metaTube,
      adata,
      vdata,
    });
    probe.withOutputOptions([
      "-id3v2_version",
      "3",
      "-metadata",
      `title=${metaTube.title}`,
      "-metadata",
      `description=${metaTube.description.trim()}`,
    ]);
    probe.withOutputFormat("webm");
    probe.output(metaTube.title + ".webm");
    probe.run();
  } catch (error) {
    console.log(error);
  }
})();
