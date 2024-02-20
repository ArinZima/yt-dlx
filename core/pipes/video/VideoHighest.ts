import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import ytCore from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";

const metaSpin = randomUUID().toString();
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
export default async function VideoHighest({
  query,
  filter,
  stream,
  verbose,
  folderName,
  outputFormat = "mp4",
}: VideoHighestOC): VideoHighestType {
  try {
    if (!query || typeof query !== "string") {
      return {
        message: "Invalid query parameter",
        status: 500,
      };
    }
    const metaBody = await ytCore({ query });
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

    const metaEntry = bigEntry(metaBody.VideoTube);
    const ytc = fluentffmpeg();
    ytc.input(metaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    switch (filter) {
      case "grayscale":
        ytc.videoFilters("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        metaName = `yt-core_(VideoHighest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.videoFilters("negate");
        metaName = `yt-core_(VideoHighest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.videoFilters("rotate=PI/2");
        metaName = `yt-core_(VideoHighest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.videoFilters("rotate=PI");
        metaName = `yt-core_(VideoHighest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.videoFilters("rotate=3*PI/2");
        metaName = `yt-core_(VideoHighest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.videoFilters("hflip");
        metaName = `yt-core_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.videoFilters("vflip");
        metaName = `yt-core_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-core_(VideoHighest)_${title}.${outputFormat}`;
    }
    ytc.on("start", (cmd) => {
      if (verbose) console.log(cmd);
      progressBar(0, metaSpin);
    });
    ytc.on("end", () => progressBar(100, metaSpin));
    ytc.on("close", () => progressBar(100, metaSpin));
    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin));
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
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500,
        };
      default:
        return {
          message: "Internal server error",
          status: 500,
        };
    }
  }
}
