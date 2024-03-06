import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import web from "../../../web";
import { z, ZodError } from "zod";
import ytdlx from "../../../base/Agent";
import gpuffmpeg from "../../../base/ffmpeg";
import bigEntry from "../../../base/bigEntry";
import YouTubeID from "../../../web/YouTubeId";
import type { gpuffmpegCommand } from "../../../base/ffmpeg";
import runFunc from "../../../base/runFunc";

const qconf = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  torproxy: z.string().min(1).optional(),
  query: z
    .array(
      z
        .string()
        .min(1)
        .refine(
          async (input) => {
            switch (true) {
              case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
                input
              ):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined) return true;
                break;
              default:
                const resultId = await YouTubeID(
                  `https://www.youtube.com/playlist?list=${input}`
                );
                if (resultId !== undefined) return true;
                break;
            }
            return false;
          },
          {
            message: "Query must be a valid YouTube Playlist Link or ID.",
          }
        )
    )
    .min(1),
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

export default async function ListAudioQualityCustom(input: {
  query: string[];
  output?: string;
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
}): Promise<void> {
  try {
    const { query, output, verbose, quality, filter, torproxy } =
      await qconf.parseAsync(input);
    const response = await runFunc(async () => {
      const vDATA = new Set<{
        ago: string;
        title: string;
        views: string;
        author: string;
        videoId: string;
        videoLink: string;
        authorUrl: string;
        thumbnailUrls: string[];
      }>();
      for (const pURL of query) {
        try {
          const pDATA = await web.search.PlaylistInfo({
            query: pURL,
            torproxy,
          });
          if (pDATA === undefined) {
            console.log(
              colors.red("@error:"),
              "unable to get response from youtube for",
              pURL
            );
            continue;
          }
          for (const video of pDATA.playlistVideos) vDATA.add(video);
        } catch (error) {
          console.log(colors.red("@error:"), error);
          continue;
        }
      }
      console.log(
        colors.green("@info:"),
        "total number of uncommon videos:",
        colors.yellow(vDATA.size.toString())
      );
      for (const video of vDATA) {
        try {
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
          const customData = engineData.AudioStore.filter(
            (op) => op.AVDownload.formatnote === quality
          );
          if (!customData) {
            console.log(
              colors.red("@error: ") + quality + " not found in the video."
            );
            continue;
          }
          const title: string = engineData.metaTube.title.replace(
            /[^a-zA-Z0-9_]+/g,
            "_"
          );
          const folder = output
            ? path.join(process.cwd(), output)
            : process.cwd();
          if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
          const sortedData = await bigEntry(customData);
          let filename: string = `yt-dlx_(AudioQualityCustom_${quality}`;
          const ffmpeg: gpuffmpegCommand = await gpuffmpeg({
            size: sortedData.AVInfo.filesizeformatted.toString(),
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
          await new Promise<void>((resolve, _reject) => {
            ffmpeg.output(path.join(folder, filename.replace("_)_", ")_")));
            ffmpeg.on("end", () => resolve());
            ffmpeg.on("error", (error) => {
              throw new Error(colors.red("@error: ") + error.message);
            });
            ffmpeg.run();
          });
        } catch (error) {
          console.log(colors.red("@error:"), error);
          continue;
        }
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
    });
    return response;
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
