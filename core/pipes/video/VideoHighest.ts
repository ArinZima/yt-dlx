import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import ffmpeg from "../../base/ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";

type VideoFormat = "mp4" | "avi" | "mov";
interface VideoHighestOC {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type VideoHighestType = Promise<true | ErrorResult | StreamResult>;

const VideoHighestInputSchema = z.object({
  query: z.string().min(1),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
  filter: z.string().optional(),
});

export default async function VideoHighest(
  input: VideoHighestOC
): VideoHighestType {
  try {
    const {
      query,
      stream,
      verbose,
      folderName,
      outputFormat = "mp4",
      filter,
    } = VideoHighestInputSchema.parse(input);

    const metaBody = await ytdlx({ query });
    if (!metaBody) {
      throw new Error("Unable to get response from YouTube...");
    }
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
    const proc = await ffmpeg();
    proc.addInput(metaEntry.meta_dl.mediaurl);
    proc.format(outputFormat);
    switch (filter) {
      case "grayscale":
        proc.withVideoFilter(
          "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
        );
        metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        proc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        proc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        proc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        proc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        proc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        proc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
    }
    proc.on("start", (command) => {
      if (verbose) console.log(command);
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    proc.on("end", () => {
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    proc.on("close", () => {
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    proc.on("progress", (prog) => {
      progressBar({
        timemark: prog.timemark,
        percent: prog.percent,
      });
    });
    proc.on("error", (error) => {
      return error;
    });
    switch (stream) {
      case true:
        const readStream = new Readable({
          read() {},
        });
        const writeStream = new Writable({
          write(chunk, _encoding, callback) {
            readStream.push(chunk);
            callback();
          },
          final(callback) {
            readStream.push(undefined);
            callback();
          },
        });
        proc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName
            ? path.join(metaFold, metaName.replace("-.", "."))
            : metaName.replace("-.", "."),
        };

      default:
        await new Promise<void>((resolve, reject) => {
          proc.output(path.join(metaFold, metaName));
          proc.on("end", () => resolve());
          proc.on("error", reject);
          proc.run();
        });

        return true;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        colors.red("@error: ") +
          error.errors.map((error) => error.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors.red("@error: ") + error.message);
    } else {
      throw new Error(colors.red("@error: ") + "internal server error");
    }
  }
}
