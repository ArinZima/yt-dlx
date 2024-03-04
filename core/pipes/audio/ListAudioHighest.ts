import * as fs from "fs";
import web from "../../web";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import gpuffmpeg from "../../base/ffmpeg";
import bigEntry from "../../base/bigEntry";
import type { gpuffmpegCommand } from "../../base/ffmpeg";

const qconf = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  torproxy: z.string().min(1).optional(),
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

export default async function ListAudioHighest(input: {
  query: string;
  output?: string;
  verbose?: boolean;
  torproxy?: string;
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
}): Promise<void> {
  try {
    const { query, output, verbose, filter, torproxy } = await qconf.parseAsync(
      input
    );
    const playlistData = await web.search.PlaylistInfo({ query });
    if (playlistData === undefined) {
      throw new Error(
        colors.red("@error: ") + "unable to get response from youtube."
      );
    }
    for (const video of playlistData.playlistVideos) {
      const engineData = await ytdlx({
        query: video.videoLink,
        torproxy,
        verbose,
      });
      if (engineData === undefined) {
        console.log(
          colors.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      const title: string = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const folder = output ? path.join(process.cwd(), output) : process.cwd();
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(engineData.AudioStore);
      if (sortedData === undefined) {
        console.log(
          colors.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      let filename: string = "yt-dlx_(AudioHighest_";
      const ffmpeg: gpuffmpegCommand = gpuffmpeg({
        input: sortedData.AVDownload.mediaurl,
        verbose,
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addOutputOption("-map", "1:0");
      ffmpeg.addOutputOption("-map", "0:a:0");
      ffmpeg.addOutputOption("-id3v2_version", "3");
      ffmpeg.withOutputFormat("avi");
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
      await new Promise<void>((resolve, reject) => {
        ffmpeg.output(path.join(folder, filename.replace("_)_", ")_")));
        ffmpeg.on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        });
        ffmpeg.on("end", () => resolve());
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
