import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import gpuffmpeg from "../../base/ffmpeg";
import lowEntry from "../../base/lowEntry";
import type { gpuffmpegCommand } from "../../base/ffmpeg";

const qconf = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  torproxy: z.string().min(1).optional(),
  quality: z.enum(["high", "medium", "low", "ultralow"]),
  filter: z
    .enum([
      "echo",
      "slow",
      "speed",
      "phaser",
      "flanger",
      "panning",
      "reverse",
      "vibrato",
      "subboost",
      "surround",
      "bassboost",
      "nightcore",
      "superslow",
      "vaporwave",
      "superspeed",
    ])
    .optional(),
});
export default async function AudioQualityCustom(input: {
  query: string;
  output?: string;
  stream?: boolean;
  verbose?: boolean;
  torproxy?: string;
  quality: "high" | "medium" | "low" | "ultralow";
  filter?:
    | "echo"
    | "slow"
    | "speed"
    | "phaser"
    | "flanger"
    | "panning"
    | "reverse"
    | "vibrato"
    | "subboost"
    | "surround"
    | "bassboost"
    | "nightcore"
    | "superslow"
    | "vaporwave"
    | "superspeed";
}): Promise<void | {
  filename: string;
  ffmpeg: gpuffmpegCommand;
}> {
  try {
    const { query, stream, verbose, output, quality, filter, torproxy } =
      await qconf.parseAsync(input);
    const engineData = await ytdlx({ query, verbose, torproxy });
    if (engineData === undefined) {
      throw new Error(
        colors.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const customData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      if (!customData) {
        throw new Error(
          colors.red("@error: ") + quality + " not found in the video."
        );
      }
      const title: string = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path.join(process.cwd(), output) : process.cwd();
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(customData);
      const ffmpeg: gpuffmpegCommand = gpuffmpeg({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose,
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.withOutputFormat("avi");
      let filename: string = `yt-dlx_(AudioQualityCustom_${quality}`;
      if (filter === "bassboost") {
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.avi`;
      } else if (filter === "echo") {
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.avi`;
      } else if (filter === "flanger") {
        ffmpeg.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.avi`;
      } else if (filter === "nightcore") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.avi`;
      } else if (filter === "panning") {
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.avi`;
      } else if (filter === "phaser") {
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.avi`;
      } else if (filter === "reverse") {
        ffmpeg.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.avi`;
      } else if (filter === "slow") {
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.avi`;
      } else if (filter === "speed") {
        ffmpeg.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.avi`;
      } else if (filter === "subboost") {
        ffmpeg.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.avi`;
      } else if (filter === "superslow") {
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.avi`;
      } else if (filter === "superspeed") {
        ffmpeg.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.avi`;
      } else if (filter === "surround") {
        ffmpeg.withAudioFilter(["surround"]);
        filename += `surround)_${title}.avi`;
      } else if (filter === "vaporwave") {
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.avi`;
      } else if (filter === "vibrato") {
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.avi`;
      } else filename += `)_${title}.avi`;
      if (stream) {
        return {
          ffmpeg,
          filename: output
            ? path.join(folder, filename)
            : filename.replace("_)_", ")_"),
        };
      } else {
        await new Promise<void>((resolve, reject) => {
          ffmpeg.output(path.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => {
            resolve();
          });
          ffmpeg.on("error", (err) => {
            reject(err);
          });
          ffmpeg.run();
        });
      }
      console.log(
        colors.green("@info:"),
        "❣️ Thank you for using",
        colors.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors.green("🌟starring"),
        "the github repo",
        colors.green("https://github.com/yt-dlx")
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        colors.red("@error: ") +
          error.errors.map((error) => error.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors.red("@error: ") + error.message);
    } else throw new Error(colors.red("@error: ") + "internal server error");
  }
}
