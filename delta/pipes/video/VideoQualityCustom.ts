import * as fs from "fs";
import * as path from "path";
import { z, ZodError } from "zod";
import ytDlp from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";

type VideoFormat = "mp4" | "avi" | "mov";
type VideoQualities =
  | "144p"
  | "240p"
  | "360p"
  | "480p"
  | "720p"
  | "1080p"
  | "1440p"
  | "2160p"
  | "2880p"
  | "4320p"
  | "5760p"
  | "8640p"
  | "12000p";
interface VideoLowestOC {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  quality: VideoQualities;
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type VideoLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;

const VideoLowestInputSchema = z.object({
  query: z.string(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  filter: z.string().optional(),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
});

export default async function VideoLowest(
  input: VideoLowestOC
): VideoLowestType {
  try {
    const {
      query,
      filter,
      stream,
      verbose,
      folderName,
      outputFormat = "mp4",
    } = VideoLowestInputSchema.parse(input);

    const metaBody = await ytDlp({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
    }
    let metaName: string = "";
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
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
        metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
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
          filename: folderName ? path.join(metaFold, metaName) : metaName,
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
        message: error.errors.map((err) => err.message).join(", "),
        status: 500,
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500,
      };
    } else {
      return {
        message: "Internal server error",
        status: 500,
      };
    }
  }
}
