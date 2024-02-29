import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";

type VideoFormat = "mp4" | "avi" | "mov";
interface VideoHighestOC {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type VideoHighestType = Promise<SuccessResult | ErrorResult | StreamResult>;

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
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
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

    const metaEntry = await bigEntry(metaBody.VideoTube);
    if (metaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
    }
    const ytc = fluentffmpeg();
    ytc.addInput(metaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    switch (filter) {
      case "grayscale":
        ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
    }
    ytc.on("start", (command) => {
      if (verbose) console.log(command);
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    ytc.on("end", () => {
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    ytc.on("close", () => {
      progressBar({
        timemark: undefined,
        percent: undefined,
      });
    });
    ytc.on("progress", (prog) => {
      progressBar({
        timemark: prog.timemark,
        percent: prog.percent,
      });
    });
    ytc.on("error", (error) => {
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
            readStream.push(null);
            callback();
          },
        });
        ytc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName
            ? path.join(metaFold, metaName.replace("-.", "."))
            : metaName.replace("-.", "."),
        };

      default:
        await new Promise<void>((resolve, reject) => {
          ytc
            .output(path.join(metaFold, metaName))
            .on("error", reject)
            .on("end", () => {
              resolve();
            })
            .run();
        });

        return {
          message: "process ended...",
          status: 200,
        };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message:
          colors.red("@error: ") +
          error.errors.map((error) => error.message).join(", "),
        status: 500,
      };
    } else if (error instanceof Error) {
      return {
        message: colors.red("@error: ") + error.message,
        status: 500,
      };
    } else {
      return {
        message: colors.red("@error: ") + "internal server error",
        status: 500,
      };
    }
  }
}
