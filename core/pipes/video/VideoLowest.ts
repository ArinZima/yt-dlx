import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import gpuffmpeg from "../../base/ffmpeg";
import lowEntry from "../../base/lowEntry";
import type { gpuffmpegCommand } from "../../base/ffmpeg";

const VideoLowestZod = z.object({
  query: z.string().min(1),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
});
export default async function VideoLowest(input: {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
}): Promise<void | {
  filename: string;
  stream: gpuffmpegCommand;
}> {
  try {
    const { query, stream, verbose, folderName } = VideoLowestZod.parse(input);

    const metaBody = await ytdlx({ query, verbose });
    if (!metaBody) throw new Error("Unable to get response from YouTube...");
    let metaName: string = "";
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });

    const metaEntry = await lowEntry(metaBody.VideoStore);
    if (metaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    const ffmpeg: gpuffmpegCommand = gpuffmpeg(
      metaEntry.AVDownload.mediaurl,
      verbose
    );
    ffmpeg.outputFormat("matroska");
    metaName = `yt-dlp_(VideoLowest)_${title}.mkv`;
    ffmpeg.on("error", (error) => {
      return error;
    });
    if (stream) {
      return {
        stream: ffmpeg,
        filename: folderName ? path.join(metaFold, metaName) : metaName,
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
