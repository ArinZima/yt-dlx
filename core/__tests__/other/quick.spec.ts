console.clear();
import * as path from "path";
import * as async from "async";
import ffmpeg from "fluent-ffmpeg";
import Agent from "../../base/Agent";
import bigEntry from "../../base/bigEntry";
import { progressBar } from "../../base/ffmpeg";
import type TubeConfig from "../../interface/TubeConfig";
import type EngineResult from "../../interface/EngineResult";

async.waterfall([
  async () => {
    const EngineData = Agent({
      verbose: false,
      torproxy: "socks5://127.0.0.1:9050",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    return EngineData;
  },
  async (EngineData: EngineResult) => {
    const [AudioData, VideoData] = await Promise.all([
      await bigEntry(EngineData.AudioStore),
      await bigEntry(EngineData.VideoStore),
    ]);
    return { EngineData, AudioData, VideoData };
  },
  async ({
    EngineData,
    AudioData,
    VideoData,
  }: {
    EngineData: EngineResult;
    AudioData: TubeConfig;
    VideoData: TubeConfig;
  }) => {
    const fluent = ffmpeg();
    fluent.addInput(VideoData.AVDownload.mediaurl);
    fluent.withVideoCodec("copy");
    fluent.addInput(AudioData.AVDownload.mediaurl);
    fluent.withAudioCodec("copy");
    fluent.addOutputOption(["-map 0:v:0", "-map 1:a:0"]);
    fluent.addInput(EngineData.metaTube.thumbnail);
    fluent.addOutputOption([
      "-id3v2_version",
      "3",
      "-metadata",
      `title=${EngineData.metaTube.title}`,
      "-metadata",
      `description=${EngineData.metaTube.description.trim()}`,
    ]);
    fluent.outputFormat("webm");
    fluent.output(path.resolve(__dirname, EngineData.metaTube.title + ".webm"));
    fluent.on("start", (command) => console.info(command));
    fluent.on("progress", (progress) => {
      progressBar(progress, VideoData.AVInfo.filesizeformatted.toString());
    });
    fluent.on("end", () => process.stdout.write("\n"));
    fluent.on("error", (error) => console.error(error.message));
    fluent.run();
  },
]);
