import * as fs from "fs";
import async from "async";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import { randomUUID } from "crypto";
import ytCore from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import get_playlist from "../command/get_playlist";
import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";

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
interface ListVideoHighestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type ListVideoHighestType = SuccessResult | ErrorResult | StreamResult;

const ListVideoHighestInputSchema = z.object({
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string()),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
  filter: z.string().optional(),
});

export default async function ListVideoHighest(
  input: ListVideoHighestOC
): Promise<ListVideoHighestType[]> {
  try {
    const {
      filter,
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4",
    } = ListVideoHighestInputSchema.parse(input);

    switch (true) {
      case playlistUrls.length === 0:
        return [
          {
            message: "playlistUrls parameter cannot be empty",
            status: 500,
          },
        ];
      case !Array.isArray(playlistUrls):
        return [
          {
            message: "playlistUrls parameter must be an array",
            status: 500,
          },
        ];
      case !playlistUrls.every(
        (url) => typeof url === "string" && url.trim().length > 0
      ):
        return [
          {
            message:
              "Invalid playlistUrls[] parameter. Expecting a non-empty array of strings.",
            status: 500,
          },
        ];
      default:
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
          const results: ListVideoHighestType[] = [];
          await async.eachSeries(
            videos as metaVideo[],
            async (video: metaVideo) => {
              try {
                const metaBody = await ytCore({ query: video.url });
                if (!metaBody) {
                  throw new Error("Unable to get response from YouTube...");
                }
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
                const metaEntry = await bigEntry(metaBody.VideoTube);
                if (metaEntry === null) return;
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
                    ytc.withVideoFilter(
                      "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
                    );
                    metaName = `yt-core_(VideoHighest-grayscale)_${title}.${outputFormat}`;
                    break;
                  case "invert":
                    ytc.withVideoFilter("negate");
                    metaName = `yt-core_(VideoHighest-invert)_${title}.${outputFormat}`;
                    break;
                  case "rotate90":
                    ytc.withVideoFilter("rotate=PI/2");
                    metaName = `yt-core_(VideoHighest-rotate90)_${title}.${outputFormat}`;
                    break;
                  case "rotate180":
                    ytc.withVideoFilter("rotate=PI");
                    metaName = `yt-core_(VideoHighest-rotate180)_${title}.${outputFormat}`;
                    break;
                  case "rotate270":
                    ytc.withVideoFilter("rotate=3*PI/2");
                    metaName = `yt-core_(VideoHighest-rotate270)_${title}.${outputFormat}`;
                    break;
                  case "flipHorizontal":
                    ytc.withVideoFilter("hflip");
                    metaName = `yt-core_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                  case "flipVertical":
                    ytc.withVideoFilter("vflip");
                    metaName = `yt-core_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
                    break;
                  default:
                    metaName = `yt-core_(VideoHighest)_${title}.${outputFormat}`;
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
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return [
        {
          message:
            "Validation error: " +
            error.errors.map((e) => e.message).join(", "),
          status: 500,
        },
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500,
        },
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500,
        },
      ];
    }
  }
}
