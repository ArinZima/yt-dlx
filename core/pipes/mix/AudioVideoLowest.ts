import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import ytCore from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import lowEntry from "../../base/lowEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";

const metaSpin = randomUUID().toString();
type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoLowestOC {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  outputFormat?: VideoFormat;
}
type AudioVideoLowestType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default async function AudioVideoLowest({
  query,
  stream,
  verbose,
  folderName,
  outputFormat = "mp4",
}: AudioVideoLowestOC): AudioVideoLowestType {
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
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    let metaName: string = `yt-core_(AudioVideoLowest)_${title}.${outputFormat}`;
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg();
    ytc.input(lowEntry(metaBody.VideoTube).meta_dl.mediaurl);
    ytc.input(lowEntry(metaBody.AudioTube).meta_dl.mediaurl);
    ytc.format(outputFormat);
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
    if (stream) {
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
    } else {
      await new Promise<void>((resolve, reject) => {
        ytc
          .output(path.join(metaFold, metaName))
          .on("error", reject)
          .on("end", () => {
            resolve();
            return {
              status: 200,
              message: "process ended...",
            };
          })
          .run();
      });
      return {
        status: 200,
        message: "process ended...",
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
