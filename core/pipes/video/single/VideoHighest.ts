import { z } from "zod";
import * as os from "os";
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import formatTime from "../../../base/formatTime";
import type { FfmpegCommand } from "fluent-ffmpeg";
import calculateETA from "../../../base/calculateETA";

/**
 * VideoHighest function is designed for fetching highest video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf = z.object({
  query: z.string().min(1),
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
export default async function VideoHighest(input: {
  query: string;
  output?: string;
  stream?: boolean;
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
  const { query, stream, verbose, output, filter, onionTor } =
    await qconf.parseAsync(input);
  const engineData = await ytdlx({ query, verbose, onionTor });
  if (engineData === undefined) {
    throw new Error(
      colors.red("@error: ") + "unable to get response from youtube."
    );
  } else {
    const title: string = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path.join(process.cwd(), output) : process.cwd();
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    const numThreads = os.cpus().length * 2;
    const ff: FfmpegCommand = ffmpeg();
    const vdata =
      Array.isArray(engineData.ManifestHigh) &&
      engineData.ManifestHigh.length > 0
        ? engineData.ManifestHigh[engineData.ManifestHigh.length - 1]?.url
        : undefined;
    if (vdata) ff.addInput(vdata.toString());
    else throw new Error(colors.red("@error: ") + "no video data found.");
    ff.outputOptions(["-c", "copy"]);
    ff.withOutputFormat("matroska");
    ff.addOption("-threads", numThreads.toString());
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    let filename: string = "yt-dlx_(VideoHighest_";
    switch (filter) {
      case "grayscale":
        ff.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
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
      const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb}` +
          ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
          ` ${color("| @timemark:")} ${timemark}` +
          ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output
          ? path.join(folder, filename)
          : filename.replace("_)_", ")_"),
      };
    } else {
      await new Promise<void>((resolve, reject) => {
        ff.output(path.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject(new Error(colors.red("@error: ") + error.message));
        });
        ff.run();
      });
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
}
