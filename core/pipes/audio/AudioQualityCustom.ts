import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import gpuffmpeg from "../../base/ffmpeg";
import lowEntry from "../../base/lowEntry";
import type { gpuffmpegCommand } from "../../base/ffmpeg";

const qconf = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  quality: z.enum(["high", "medium", "low", "ultralow"]),
});
export default async function AudioQualityCustom(input: {
  query: string;
  output?: string;
  stream?: boolean;
  verbose?: boolean;
  quality: "high" | "medium" | "low" | "ultralow";
}): Promise<void | {
  filename: string;
  ffmpeg: gpuffmpegCommand;
}> {
  try {
    const { query, stream, verbose, output, quality } = await qconf.parseAsync(
      input
    );
    const engineData = await ytdlx({ query, verbose });
    if (engineData === undefined) {
      throw new Error(
        colors.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const customData = engineData.AudioStore.filter(
        (op) => op.AVDownload.formatnote === quality
      );
      const title: string = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const folder = output ? path.join(process.cwd(), output) : process.cwd();
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      const sortedData = await lowEntry(customData);
      if (sortedData === undefined) {
        throw new Error(
          colors.red("@error: ") + "unable to get response from youtube."
        );
      } else {
        const ffmpeg: gpuffmpegCommand = gpuffmpeg({
          input: sortedData.AVDownload.mediaurl,
          verbose,
        })
          .addInput(engineData.metaTube.thumbnail)
          .addOutputOption("-map", "1:0")
          .addOutputOption("-map", "0:a:0")
          .addOutputOption("-id3v2_version", "3")
          .outputFormat("avi");
        const filename: string = `yt-dlp-(AudioQualityCustom)-${title}.avi`;
        switch (stream) {
          case true:
            return {
              ffmpeg,
              filename: output ? path.join(folder, filename) : filename,
            };
          default:
            await new Promise<void>(() => {
              ffmpeg.output(path.join(folder, filename));
              ffmpeg.run();
            });
            break;
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
