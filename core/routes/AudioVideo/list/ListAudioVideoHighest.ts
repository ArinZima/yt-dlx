import { z } from "zod";
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import web from "../../../web";
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import YouTubeID from "../../../web/YouTubeId";
import formatTime from "../../../base/formatTime";
import type { FfmpegCommand } from "fluent-ffmpeg";
import calculateETA from "../../../base/calculateETA";

const qconf = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  onionTor: z.boolean().optional(),
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
  filter: z
    .enum([
      "invert",
      "rotate90",
      "rotate270",
      "grayscale",
      "rotate180",
      "flipVertical",
      "flipHorizontal",
    ])
    .optional(),
});
export default async function ListAudioVideoHighest(input: {
  query: string[];
  output?: string;
  verbose?: boolean;
  onionTor?: boolean;
  filter?:
    | "invert"
    | "rotate90"
    | "rotate270"
    | "grayscale"
    | "rotate180"
    | "flipVertical"
    | "flipHorizontal";
}): Promise<void | {
  filename: string;
  ffmpeg: FfmpegCommand;
}> {
  let startTime: Date;
  const { query, verbose, output, filter, onionTor } = await qconf.parseAsync(
    input
  );
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
      const pDATA = await web.browserLess.playlistVideos({
        playlistId: (await YouTubeID(pURL)) as string,
      });
      if (pDATA === undefined) {
        console.log(colors.red("@error:"), "Unable to get response for", pURL);
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
        onionTor,
        verbose,
      });
      if (engineData === undefined) {
        console.log(colors.red("@error:"), "Unable to get response!");
        continue;
      }
      const title: string = engineData.metaData.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path.join(process.cwd(), output) : process.cwd();
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      let filename: string = "yt-dlx_(AudioVideoHighest_";
      const ff: FfmpegCommand = ffmpeg();
      const vdata =
        Array.isArray(engineData.ManifestHigh) &&
        engineData.ManifestHigh.length > 0
          ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url
          : undefined;
      ff.addInput(engineData.AudioHighF.url);
      if (vdata) ff.addInput(vdata.toString());
      else throw new Error(colors.red("@error: ") + "no video data found.");
      ff.outputOptions("-c copy");
      ff.withOutputFormat("matroska");
      ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
      ff.withOutputFormat("matroska");
      switch (filter) {
        case "grayscale":
          ff.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          filename += `grayscale)_${title}.mkv`;
          break;
        case "invert":
          ff.withVideoFilter("negate");
          filename += `invert)_${title}.mkv`;
          break;
        case "rotate90":
          ff.withVideoFilter("rotate=PI/2");
          filename += `rotate90)_${title}.mkv`;
          break;
        case "rotate180":
          ff.withVideoFilter("rotate=PI");
          filename += `rotate180)_${title}.mkv`;
          break;
        case "rotate270":
          ff.withVideoFilter("rotate=3*PI/2");
          filename += `rotate270)_${title}.mkv`;
          break;
        case "flipHorizontal":
          ff.withVideoFilter("hflip");
          filename += `flipHorizontal)_${title}.mkv`;
          break;
        case "flipVertical":
          ff.withVideoFilter("vflip");
          filename += `flipVertical)_${title}.mkv`;
          break;
        default:
          filename += `)_${title}.mkv`;
          break;
      }
      ff.on("error", (error) => {
        throw new Error(error.message);
      });
      ff.on("start", (comd) => {
        startTime = new Date();
        if (verbose) console.info(colors.green("@comd:"), comd);
      });
      ff.on("end", () => process.stdout.write("\n"));
      ff.on("progress", ({ percent, timemark }) => {
        let color = colors.green;
        if (isNaN(percent)) percent = 0;
        if (percent > 98) percent = 100;
        if (percent < 25) color = colors.red;
        else if (percent < 50) color = colors.yellow;
        const width = Math.floor(process.stdout.columns / 4);
        const scomp = Math.round((width * percent) / 100);
        const progb =
          color("━").repeat(scomp) + color(" ").repeat(width - scomp);
        process.stdout.write(
          `\r${color("@prog:")} ${progb}` +
            ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
            ` ${color("| @timemark:")} ${timemark}` +
            ` ${color("| @eta:")} ${formatTime(
              calculateETA(startTime, percent)
            )}`
        );
      });
      await new Promise<void>((resolve, _reject) => {
        ff.output(path.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          throw new Error(colors.red("@error: ") + error.message);
        });
        ff.run();
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
    "Consider",
    colors.green("🌟starring"),
    "the github repo",
    colors.green("https://github.com/yt-dlx\n")
  );
}
