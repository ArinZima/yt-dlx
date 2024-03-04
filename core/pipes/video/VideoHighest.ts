import * as fs from "fs";
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
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  torproxy: z.string().min(1).optional(),
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
  torproxy?: string;
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
  ffmpeg: gpuffmpegCommand;
}> {
  try {
    const { query, stream, verbose, output, filter, torproxy } =
      await qconf.parseAsync(input);
    const engineData = await ytdlx({ query, verbose, torproxy });
    if (engineData === undefined) {
      throw new Error(
        colors.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title: string = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path.join(process.cwd(), output) : process.cwd();
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      const sortedData = await bigEntry(engineData.VideoStore);
      const ffmpeg: gpuffmpegCommand = gpuffmpeg({
        size: sortedData.AVInfo.filesizeformatted.toString(),
        input: sortedData.AVDownload.mediaurl,
        verbose,
      });
      ffmpeg.addInput(engineData.metaTube.thumbnail);
      ffmpeg.addInputOption("-threads", "auto");
      ffmpeg.addInputOption("-re");
      ffmpeg.withOutputFormat("matroska");
      let filename: string = "yt-dlx_(VideoHighest_";
      if (filter === "grayscale") {
        ffmpeg.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        filename += `grayscale)_${title}.mkv`;
      } else if (filter === "invert") {
        ffmpeg.withVideoFilter("negate");
        filename += `invert)_${title}.mkv`;
      } else if (filter === "rotate90") {
        ffmpeg.withVideoFilter("rotate=PI/2");
        filename += `rotate90)_${title}.mkv`;
      } else if (filter === "rotate180") {
        ffmpeg.withVideoFilter("rotate=PI");
        filename += `rotate180)_${title}.mkv`;
      } else if (filter === "rotate270") {
        ffmpeg.withVideoFilter("rotate=3*PI/2");
        filename += `rotate270)_${title}.mkv`;
      } else if (filter === "flipHorizontal") {
        ffmpeg.withVideoFilter("hflip");
        filename += `flipHorizontal)_${title}.mkv`;
      } else if (filter === "flipVertical") {
        ffmpeg.withVideoFilter("vflip");
        filename += `flipVertical)_${title}.mkv`;
      } else filename += `)_${title}.mkv`;
      if (stream) {
        return {
          ffmpeg,
          filename: output
            ? path.join(folder, filename)
            : filename.replace("_)_", ")_"),
        };
      } else {
        await new Promise<void>((resolve, _reject) => {
          ffmpeg.output(path.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors.red("@error: ") + error.message);
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
