import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import gpuffmpeg from "../../base/ffmpeg";
import bigEntry from "../../base/bigEntry";
import type { gpuffmpegCommand } from "../../base/ffmpeg";

const AudioVideoHighestZod = z.object({
  query: z.string().min(1),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  output: z.string().optional(),
});
export default async function AudioVideoHighest(input: {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  output?: string;
}): Promise<void | {
  filename: string;
  stream: gpuffmpegCommand;
}> {
  try {
    const { query, stream, verbose, output } =
      AudioVideoHighestZod.parse(input);
    const metaBody = await ytdlx({ query, verbose });
    if (!metaBody) throw new Error("Unable to get response from YouTube...");
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = output ? path.join(process.cwd(), output) : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const metaName: string = `yt-dlp_(AudioVideoHighest)_${title}.mkv`;
    const [AmetaEntry, VmetaEntry] = await Promise.all([
      bigEntry(metaBody.AudioStore),
      bigEntry(metaBody.VideoStore),
    ]);
    if (AmetaEntry === undefined || VmetaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    const ffmpeg: gpuffmpegCommand = gpuffmpeg({
      input: VmetaEntry.AVDownload.mediaurl,
      verbose,
    });
    ffmpeg.addInput(AmetaEntry.AVDownload.mediaurl);
    ffmpeg.outputFormat("matroska");
    ffmpeg.addOption("-shortest");
    ffmpeg.on("error", (error) => {
      return error;
    });
    if (stream) {
      return {
        stream: ffmpeg,
        filename: output ? path.join(metaFold, metaName) : metaName,
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
