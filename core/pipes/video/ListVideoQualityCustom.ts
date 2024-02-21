import * as fs from "fs";
import async from "async";
import colors from "colors";
import * as path from "path";
import { randomUUID } from "crypto";
import ytCore from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import get_playlist from "../command/get_playlist";
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
interface metaVideo {
  title: string;
  description: string;
  url: string;
  timestamp: string;
  views: number;
  uploadDate: string;
  ago: string;
  image: string;
  thumbnail: string;
  authorName: string;
  authorUrl: string;
}
interface ListVideoQualityCustomOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  quality: VideoQualities;
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type ListVideoQualityCustomType = SuccessResult | ErrorResult | StreamResult;
export default async function ListVideoQualityCustom({
  filter,
  stream,
  quality,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp4",
}: ListVideoQualityCustomOC): Promise<ListVideoQualityCustomType[]> {
  try {
    if (
      !Array.isArray(playlistUrls) ||
      !playlistUrls.every((url) => typeof url === "string")
    ) {
      return [
        {
          message:
            "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500,
        },
      ];
    }
    const videos = await get_playlist({
      playlistUrls,
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500,
        },
      ];
    } else {
      const results: ListVideoQualityCustomType[] = [];
      await async.eachSeries(
        videos as metaVideo[],
        async (video: metaVideo) => {
          try {
            let metaBody: any;
            metaBody = await ytCore({ query: video.url });
            if (!metaBody) {
              results.push({
                message: "Unable to get response from YouTube...",
                status: 500,
              });
            } else {
              metaBody = metaBody.VideoTube.filter(
                (op: { meta_dl: { formatnote: string } }) =>
                  op.meta_dl.formatnote === quality
              );
              if (!metaBody) {
                results.push({
                  message: "Unable to get response from YouTube...",
                  status: 500,
                });
              } else {
                let metaName: string = "";
                const title: string = metaBody.metaTube.title.replace(
                  /[^a-zA-Z0-9_]+/g,
                  "-"
                );
                const metaFold = folderName
                  ? path.join(process.cwd(), folderName)
                  : process.cwd();
                if (!fs.existsSync(metaFold))
                  fs.mkdirSync(metaFold, { recursive: true });
                const metaEntry = bigEntry(metaBody.VideoTube);
                const ytc = fluentffmpeg();
                ytc.addInput(metaEntry.meta_dl.mediaurl);
                ytc.format(outputFormat);
                ytc.on("start", (cmd) => {
                  if (verbose) console.log(cmd);
                  progressBar(0, metaSpin);
                });
                ytc.on("end", () => progressBar(100, metaSpin));
                ytc.on("close", () => progressBar(100, metaSpin));
                ytc.on("progress", ({ percent }) =>
                  progressBar(percent, metaSpin)
                );
                switch (filter) {
                  case "grayscale":
                    ytc.withVideoFilter([
                      "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
                    ]);
                    metaName = `yt-core_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
                    break;
                  case "invert":
                    ytc.withVideoFilter(["negate"]);
                    metaName = `yt-core_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
                    break;
                  case "rotate90":
                    ytc.withVideoFilter(["rotate=PI/2"]);
                    metaName = `yt-core_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
                    break;
                  case "rotate180":
                    ytc.withVideoFilter(["rotate=PI"]);
                    metaName = `yt-core_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
                    break;
                  case "rotate270":
                    ytc.withVideoFilter(["rotate=3*PI/2"]);
                    metaName = `yt-core_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
                    break;
                  case "flipHorizontal":
                    ytc.withVideoFilter(["hflip"]);
                    metaName = `yt-core_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                  case "flipVertical":
                    ytc.withVideoFilter(["vflip"]);
                    metaName = `yt-core_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
                    break;
                  default:
                    ytc.withVideoFilter([]);
                    metaName = `yt-core_(VideoQualityCustom)_${title}.${outputFormat}`;
                }
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
                  results.push({
                    stream: readStream,
                    filename: folderName
                      ? path.join(metaFold, metaName)
                      : metaName,
                  });
                } else {
                  await new Promise<void>((resolve, reject) => {
                    ytc
                      .output(path.join(metaFold, metaName))
                      .on("end", () => resolve())
                      .on("error", reject)
                      .run();
                  });
                }
              }
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors.bold.red("ERROR: ") + video.title,
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500,
          },
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500,
          },
        ];
    }
  }
}
