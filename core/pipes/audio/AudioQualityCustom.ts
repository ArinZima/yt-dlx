import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import gpuffmpeg from "../../base/ffmpeg";
import bigEntry from "../../base/bigEntry";
import type { gpuffmpegCommand } from "../../base/ffmpeg";

const AudioQualityCustomZod = z.object({
  query: z.string().min(1),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  quality: z.enum(["high", "medium", "low", "ultralow"]),
});
export default async function AudioQualityCustom(input: {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  quality: "high" | "medium" | "low" | "ultralow";
}): Promise<void | {
  filename: string;
  ffmpeg: gpuffmpegCommand;
}> {
  try {
    const { query, stream, verbose, quality, folderName } =
      AudioQualityCustomZod.parse(input);
    const metaResp = await ytdlx({ query, verbose });
    if (!metaResp) {
      throw new Error("Unable to get response from YouTube...");
    }
    const metaBody = metaResp.AudioStore.filter(
      (op: { AVDownload: { formatnote: string } }) =>
        op.AVDownload.formatnote === quality
    );
    if (!metaBody) throw new Error("Unable to get response from YouTube...");
    let metaName: string = "";
    const title: string = metaResp.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await bigEntry(metaBody);
    if (metaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    const ffmpeg: gpuffmpegCommand = gpuffmpeg(
      metaEntry.AVDownload.mediaurl,
      verbose
    );
    ffmpeg.addInput(metaResp.metaTube.thumbnail);
    ffmpeg.addOutputOption("-map", "1:0");
    ffmpeg.addOutputOption("-map", "0:a:0");
    ffmpeg.addOutputOption("-id3v2_version", "3");
    ffmpeg.outputFormat("avi");
    ffmpeg.withAudioFilter([]);
    metaName = `yt-dlp-(AudioQualityCustom)-${title}.avi`;
    ffmpeg.on("error", (error) => {
      return error;
    });
    if (stream) {
      return {
        ffmpeg,
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
