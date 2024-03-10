console.clear();
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import readline from "readline";
import ffmpeg from "fluent-ffmpeg";
import Agent from "../../base/Agent";
import bigEntry from "../../base/bigEntry";
import type TubeConfig from "../../interface/TubeConfig";
import type EngineResult from "../../interface/EngineResult";

function progressBar(prog: any) {
  if (prog.timemark === undefined || prog.percent === undefined) return;
  if (prog.percent < 1 && prog.timemark.includes("-")) return;
  readline.cursorTo(process.stdout, 0);
  let color = colors.green;
  if (prog.percent > 98) prog.percent = 100;
  if (prog.percent < 25) color = colors.red;
  else if (prog.percent < 50) color = colors.yellow;
  const width = Math.floor(process.stdout.columns / 4);
  const scomp = Math.round((width * prog.percent) / 100);
  const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
  let output =
    color("@prog: ") +
    sprog +
    " " +
    prog.percent.toFixed(2) +
    "% | " +
    color("@timemark: ") +
    prog.timemark;
  if (prog.frames !== 0 && !isNaN(prog.frames)) {
    output += " | " + color("@frames: ") + prog.frames;
  }
  if (prog.currentFps !== 0 && !isNaN(prog.currentFps)) {
    output += " | " + color("@fps: ") + prog.currentFps;
  }
  process.stdout.write(output);
  if (prog.timemark.includes("-")) process.stdout.write("\n\n");
}
async function proTube({
  adata,
  vdata,
}: {
  adata?: TubeConfig;
  vdata?: TubeConfig;
}): Promise<ffmpeg.FfmpegCommand> {
  let max: number = 6;
  const ff = ffmpeg();
  let dirC: string = __dirname;
  let ffprobepath: string, ffmpegpath: string;
  while (max > 0) {
    ffprobepath = path.join(dirC, "util", "ffmpeg", "bin", "ffprobe");
    ffmpegpath = path.join(dirC, "util", "ffmpeg", "bin", "ffmpeg");
    switch (true) {
      case fs.existsSync(ffprobepath) && fs.existsSync(ffmpegpath):
        ff.setFfprobePath(ffprobepath);
        ff.setFfmpegPath(ffmpegpath);
        max = 0;
        break;
      default:
        dirC = path.join(dirC, "..");
        max--;
    }
  }
  if (vdata && !adata) {
    ff.addInput(vdata.AVDownload.mediaurl);
    ff.withVideoCodec("copy");
    if (vdata.AVInfo.framespersecond) ff.withFPS(vdata.AVInfo.framespersecond);
    if (vdata.Video.aspectratio) ff.withAspectRatio(vdata.Video.aspectratio);
    if (vdata.Video.bitrate) ff.withVideoBitrate(vdata.Video.bitrate);
  } else if (adata && !vdata) {
    ff.addInput(adata.AVDownload.mediaurl);
    ff.withAudioCodec("copy");
    if (adata.Audio.channels) ff.withAudioChannels(adata.Audio.channels);
    if (adata.Audio.bitrate) ff.withAudioBitrate(adata.Audio.bitrate);
  } else if (adata && vdata) {
    ff.addInput(vdata.AVDownload.mediaurl);
    ff.addInput(adata.AVDownload.mediaurl);
    ff.withOutputOptions(["-map 0:v:0", "-map 1:a:0"]);
    ff.withVideoCodec("copy");
    ff.withAudioCodec("copy");
    if (vdata.AVInfo.framespersecond) ff.withFPS(vdata.AVInfo.framespersecond);
    if (vdata.Video.aspectratio) ff.withAspectRatio(vdata.Video.aspectratio);
    if (adata.Audio.channels) ff.withAudioChannels(adata.Audio.channels);
    if (vdata.Video.bitrate) ff.withVideoBitrate(vdata.Video.bitrate);
    if (adata.Audio.bitrate) ff.withAudioBitrate(adata.Audio.bitrate);
  }
  ff.on("progress", (progress) => progressBar(progress));
  ff.on("end", () => process.stdout.write("\n"));
  ff.on("error", (error) => {
    throw new Error(error.message);
  });
  return ff;
}

(async () => {
  try {
    const { AudioStore, VideoStore, metaTube } = (await Agent({
      query: "https://youtu.be/6POZlJAZsok?si=owoDFiB9laKgC_oU",
      verbose: true,
    })) as EngineResult;
    const [AudioData, VideoData] = await Promise.all([
      bigEntry(AudioStore),
      bigEntry(VideoStore),
    ]);
    let probe: ffmpeg.FfmpegCommand;
    const series = [
      async () => {
        probe = await proTube({ adata: AudioData });
        console.log(colors.blue("@info:"), "Audio only!");
        probe.addInput(metaTube.thumbnail);
        probe.withOutputOptions([
          "-id3v2_version",
          "3",
          "-metadata",
          `title=${metaTube.title}`,
          "-metadata",
          `description=${metaTube.description.trim()}`,
        ]);
        probe.withOutputFormat("avi");
        probe.output(metaTube.title + ".avi");
        probe.run();
      },
      async () => {
        probe = await proTube({ vdata: VideoData });
        console.log(colors.blue("@info:"), "Video only!");
        probe.addInput(metaTube.thumbnail);
        probe.withOutputOptions([
          "-id3v2_version",
          "3",
          "-metadata",
          `title=${metaTube.title}`,
          "-metadata",
          `description=${metaTube.description.trim()}`,
        ]);
        probe.withOutputFormat("matroska");
        probe.output(metaTube.title + ".mkv");
        probe.run();
      },
      async () => {
        probe = await proTube({ adata: AudioData, vdata: VideoData });
        console.log(colors.blue("@info:"), "Audio & Video mixed!");
        probe.addInput(metaTube.thumbnail);
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
      },
    ];
    for (const task of series) await task();
  } catch (error) {
    console.log(error);
  }
})();
