import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import gpuffmpeg from "../../base/ffmpeg";
import bigEntry from "../../base/bigEntry";
import progressBar from "../../base/progressBar";
import type { gpuffmpegCommand } from "../../base/ffmpeg";

const AudioHighestZod = z.object({
  query: z.string().min(1),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
});
export default async function AudioHighest(input: {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
}): Promise<void | {
  filename: string;
  ffmpeg: gpuffmpegCommand;
}> {
  try {
    const { query, stream, verbose, folderName } = AudioHighestZod.parse(input);
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
    const metaEntry = await bigEntry(metaBody.AudioStore);
    if (metaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    const outputFormat = "avi";
    const ffmpeg: gpuffmpegCommand = gpuffmpeg(metaEntry.AVDownload.mediaurl);
    ffmpeg.addInput(metaBody.metaTube.thumbnail);
    ffmpeg.addOutputOption("-map", "1:0");
    ffmpeg.addOutputOption("-map", "0:a:0");
    ffmpeg.addOutputOption("-id3v2_version", "3");
    ffmpeg.outputFormat("avi");
    ffmpeg.on("start", (command) => {
      if (verbose) console.log(command);
      progressBar({ timemark: undefined, percent: undefined });
    });
    ffmpeg.on("end", () => {
      progressBar({ timemark: undefined, percent: undefined });
    });
    ffmpeg.on("close", () => {
      progressBar({ timemark: undefined, percent: undefined });
    });
    ffmpeg.on("progress", ({ percent, timemark }) => {
      progressBar({ timemark, percent });
    });
    ffmpeg.on("error", (error) => {
      return error;
    });
    ffmpeg.withAudioFilter([]);
    metaName = `yt-dlp-(AudioHighest)-${title}.${outputFormat}`;
    if (stream) {
      return {
        ffmpeg,
        filename: folderName
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
