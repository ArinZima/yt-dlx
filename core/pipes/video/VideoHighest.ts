import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import progressBar from "../../base/progressBar";
import type VideoFilters from "../../interface/VideoFilters";

const VideoHighestZod = z.object({
  query: z.string().min(1),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
  filter: z.string().optional(),
});
export default async function VideoHighest(input: {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  filter?: keyof VideoFilters;
  outputFormat?: "mp4" | "avi" | "mov";
}): Promise<void | {
  fileName: string;
  stream: fluentffmpeg.FfprobeStreamDisposition;
}> {
  try {
    const {
      query,
      stream,
      verbose,
      folderName,
      outputFormat = "mp4",
      filter,
    } = VideoHighestZod.parse(input);

    const metaBody = await ytdlx({ query });
    if (!metaBody) throw new Error("Unable to get response from YouTube...");
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    let metaName: string = "";
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });

    const metaEntry = await bigEntry(metaBody.VideoStore);
    if (metaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    const ffmpeg: fluentffmpeg.FfmpegCommand = fluentffmpeg();
    ffmpeg.addInput(metaEntry.AVDownload.mediaurl);
    ffmpeg.format(outputFormat);
    switch (filter) {
      case "grayscale":
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ffmpeg.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ffmpeg.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ffmpeg.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ffmpeg.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ffmpeg.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
    }
    ffmpeg.on("start", (command) => {
      if (verbose) console.log(command);
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    ffmpeg.on("end", () => {
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    ffmpeg.on("close", () => {
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    ffmpeg.on("progress", (prog) => {
      progressBar({
        timemark: prog.timemark,
        percent: prog.percent,
      });
    });
    ffmpeg.on("error", (error) => {
      return error;
    });
    if (stream) {
      return {
        stream: ffmpeg,
        fileName: folderName
          ? path.join(metaFold, metaName.replace("-.", "."))
          : metaName.replace("-.", "."),
      };
    } else {
      await new Promise<void>((resolve, reject) => {
        ffmpeg.output(path.join(metaFold, metaName));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", reject);
        ffmpeg.run();
      });
    }
    console.log(
      colors.green("@info:"),
      "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
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
