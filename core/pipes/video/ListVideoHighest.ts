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
export default async function ListVideoHighest(input: {
  query: string;
  output?: string;
  verbose?: boolean;
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
    const { query, verbose, output, filter } = await qconf.parseAsync(input);
    const playlistData = await web.search.PlaylistInfo({ query });
    if (playlistData === undefined) {
      throw new Error(
        colors.red("@error: ") + "unable to get response from youtube."
      );
    }

    for (const video of playlistData.playlistVideos) {
      const engineData = await ytdlx({
        query: video.videoLink,
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
      const sortedData = await bigEntry(engineData.VideoStore);
      if (sortedData === undefined) {
        console.log(
          colors.red("@error:"),
          "unable to get response from youtube."
        );
        continue;
      }
      let filename: string = "yt-dlx_(VideoHighest_";
      const ffmpeg: gpuffmpegCommand = gpuffmpeg({
        input: sortedData.AVDownload.mediaurl,
        verbose,
      });
      ffmpeg.outputFormat("matroska");
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
