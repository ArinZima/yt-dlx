import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import Engine from "../../base/agent";
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
interface VideoQualityCustomOC {
  query: string;
  stream?: boolean;
  folderName?: string;
  quality: VideoQualities;
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type VideoQualityCustomType = Promise<
  SuccessResult | ErrorResult | StreamResult
>;
export default async function VideoQualityCustom({
  query,
  filter,
  quality,
  stream,
  folderName,
  outputFormat = "mp4",
}: VideoQualityCustomOC): VideoQualityCustomType {
  try {
    if (
      !query ||
      typeof query !== "string" ||
      !quality ||
      typeof quality !== "string"
    ) {
      return {
        message: "Invalid query or quality parameter",
        status: 500,
      };
    }
    const EnResp = await Engine({ query });
    if (!EnResp) {
      return {
        message: "The specified quality was not found...",
        status: 500,
      };
    }
    const YSBody = EnResp.VideoTube.filter(
      (op: { meta_dl: { formatnote: string } }) =>
        op.meta_dl.formatnote === quality
    );
    if (!YSBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
    } else {
      let ipop: string = "";
      const title: string = EnResp.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const opfol = folderName
        ? path.join(process.cwd(), folderName)
        : process.cwd();
      if (!fs.existsSync(opfol)) fs.mkdirSync(opfol, { recursive: true });
      const ytc = fluentffmpeg();
      const metaEntry = bigEntry(YSBody);
      ytc.input(metaEntry.meta_dl.mediaurl);
      ytc.format(outputFormat);
      switch (filter) {
        case "grayscale":
          ytc.withVideoFilter([
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
          ]);
          ipop = `yt-core_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
          break;
        case "invert":
          ytc.withVideoFilter(["negate"]);
          ipop = `yt-core_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
          break;
        case "rotate90":
          ytc.withVideoFilter(["rotate=PI/2"]);
          ipop = `yt-core_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
          break;
        case "rotate180":
          ytc.withVideoFilter(["rotate=PI"]);
          ipop = `yt-core_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
          break;
        case "rotate270":
          ytc.withVideoFilter(["rotate=3*PI/2"]);
          ipop = `yt-core_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
          break;
        case "flipHorizontal":
          ytc.withVideoFilter(["hflip"]);
          ipop = `yt-core_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
          break;
        case "flipVertical":
          ytc.withVideoFilter(["vflip"]);
          ipop = `yt-core_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
          break;
        default:
          ytc.withVideoFilter([]);
          ipop = `yt-core_(VideoQualityCustom)_${title}.${outputFormat}`;
      }
      ytc.on("start", () => {
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
          filename: folderName ? path.join(opfol, ipop) : ipop,
        };
      } else {
        await new Promise<void>((resolve, reject) => {
          ytc
            .output(path.join(opfol, ipop))
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
