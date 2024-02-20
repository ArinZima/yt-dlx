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
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";

const metaSpin = randomUUID().toString();
type VideoFormat = "mp4" | "avi" | "mov";
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
interface ListAudioVideoHighestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: VideoFormat;
}
type ListAudioVideoHighestType = SuccessResult | ErrorResult | StreamResult;
export default async function ListAudioVideoHighest({
  stream,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp4",
}: ListAudioVideoHighestOC): Promise<ListAudioVideoHighestType[]> {
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
      const results: ListAudioVideoHighestType[] = [];
      await async.eachSeries(
        videos as metaVideo[],
        async (video: metaVideo) => {
          try {
            const metaBody = await ytCore({ query: video.url });
            if (!metaBody) {
              throw new Error("Unable to get response from YouTube...");
            }
            const title: string = metaBody.metaTube.title.replace(
              /[^a-zA-Z0-9_]+/g,
              "-"
            );
            let metaName: string = `yt-core_(AudioVideoHighest)_${title}.${outputFormat}`;
            const metaFold = folderName
              ? path.join(process.cwd(), folderName)
              : process.cwd();
            if (!fs.existsSync(metaFold))
              fs.mkdirSync(metaFold, { recursive: true });
            const ytc = fluentffmpeg();
            ytc.input(bigEntry(metaBody.VideoTube).meta_dl.mediaurl);
            ytc.input(bigEntry(metaBody.AudioTube).meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose) console.log(cmd);
              progressBar(0, metaSpin);
            });
            ytc.on("end", () => progressBar(100, metaSpin));
            ytc.on("close", () => progressBar(100, metaSpin));
            ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin));
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
                filename: folderName ? path.join(metaFold, metaName) : metaName,
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
