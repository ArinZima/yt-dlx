import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ffmpeg from "fluent-ffmpeg";
import EventEmitter from "eventemitter3";
import type { FfmpegCommand } from "fluent-ffmpeg";

import ytdlx from "../../../base/Agent";
import formatTime from "../../../base/formatTime";
import calculateETA from "../../../base/calculateETA";

var ZodSchema = z.object({
  query: z.string().min(2),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  onionTor: z.boolean().optional(),
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
/**
 * Downloads the highest quality version of a YouTube video with optional video filter.
 *
 * @param query - The YouTube video URL or ID or name.
 * @param stream - (optional) Whether to return the FfmpegCommand instead of downloading the video.
 * @param verbose - (optional) Whether to log verbose output or not.
 * @param output - (optional) The output directory for the processed files.
 * @param filter - (optional) The video filter to apply. Available options: "invert", "rotate90", "rotate270", "grayscale", "rotate180", "flipVertical", "flipHorizontal".
 * @param onionTor - (optional) Whether to use Tor for the download or not.
 */
class Emitter extends EventEmitter {}
export default async function VideoHighest({
  query,
  stream,
  verbose,
  output,
  filter,
  onionTor,
}: z.infer<typeof ZodSchema>): Promise<EventEmitter> {
  var emitter = new Emitter();
  try {
    ZodSchema.parse({
      query,
      stream,
      verbose,
      output,
      filter,
      onionTor,
    });
    var startTime: Date;
    var engineData = await ytdlx({ query, verbose, onionTor });
    if (engineData === undefined) {
      throw new Error(`${colors.red("@error:")} unable to get response!`);
    } else {
      var title: string = engineData.metaData.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      var folder = output ? path.join(__dirname, output) : __dirname;
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      var ff: FfmpegCommand = ffmpeg();
      var vdata =
        engineData.ManifestHigh[engineData.ManifestHigh.length - 1].url;
      ff.addInput(vdata.toString());
      ff.videoCodec("copy");
      ff.withOutputFormat("matroska");
      ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
      var filename: string = "yt-dlx_(VideoHighest_";
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
        emitter.emit("error", new Error(error.message));
      });
      ff.on("start", (comd) => {
        startTime = new Date();
        if (verbose) emitter.emit("start", comd);
      });
      ff.on("end", () => emitter.emit("end"));
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
        emitter.emit(
          "progress",
          `\r${color("@prog:")} ${progb}` +
            ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
            ` ${color("| @timemark:")} ${timemark}` +
            ` ${color("| @eta:")} ${formatTime(
              calculateETA(startTime, percent)
            )}`
        );
      });
      switch (stream) {
        case true:
          emitter.emit("data", {
            ffmpeg: ff,
            filename: output
              ? path.join(folder, filename)
              : filename.replace("_)_", ")_"),
          });
          break;
        default:
          ff.output(path.join(folder, filename.replace("_)_", ")_")));
          ff.on("end", () => emitter.emit("finish"));
          ff.on("error", (error) => {
            emitter.emit(
              "error",
              new Error(colors.red("@error: ") + error.message)
            );
          });
          ff.run();
          break;
      }
    }
  } catch (error: any) {
    switch (true) {
      case error instanceof ZodError:
        emitter.emit(
          "error",
          new Error(colors.red("@zod-error:") + error.errors)
        );
        break;
      default:
        emitter.emit("error", new Error(colors.red("@error:") + error.message));
        break;
    }
  } finally {
    console.log(
      colors.green("@info:"),
      "❣️ Thank you for using",
      colors.green("yt-dlx."),
      "Consider",
      colors.green("🌟starring"),
      "the GitHub repo",
      colors.green("https://github.com/yt-dlx\n")
    );
  }
  return emitter;
}
