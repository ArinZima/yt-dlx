import * as fs from "fs";
import async from "async";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import ffmpeg from "../../base/ffmpeg";
import lowEntry from "../../base/lowEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import get_playlist from "../command/get_playlist";
import type StreamResult from "../../interface/StreamResult";

type VideoFormat = "webm" | "avi" | "mov";
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
interface ListAudioVideoLowestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: VideoFormat;
}
type ListAudioVideoLowestType = true | StreamResult;
const ListAudioVideoLowestInputSchema = z.object({
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string().min(1)),
  outputFormat: z.enum(["webm", "avi", "mov"]).optional(),
});

export default async function ListAudioVideoLowest(
  input: ListAudioVideoLowestOC
): Promise<ListAudioVideoLowestType[]> {
  try {
    const {
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "webm",
    } = ListAudioVideoLowestInputSchema.parse(input);
    switch (true) {
      case playlistUrls.length === 0:
        throw new Error("playlistUrls parameter cannot be empty");
      case !Array.isArray(playlistUrls):
        throw new Error("playlistUrls parameter must be an array");
      case !playlistUrls.every(
        (url) => typeof url === "string" && url.trim().length > 0
      ):
        throw new Error(
          "Invalid playlistUrls[] parameter. Expecting a non-empty array of strings."
        );
      default:
        const videos = await get_playlist({
          playlistUrls,
        });
        if (!videos) {
          throw new Error("Unable to get response from YouTube..");
        } else {
          const results: ListAudioVideoLowestType[] = [];
          await async.eachSeries(
            videos as metaVideo[],
            async (video: metaVideo) => {
              try {
                const metaBody = await ytdlx({ query: video.url });
                if (!metaBody) {
                  throw new Error("Unable to get response from YouTube...");
                }
                const title: string = metaBody.metaTube.title.replace(
                  /[^a-zA-Z0-9_]+/g,
                  "-"
                );
                let metaName: string = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
                const metaFold = folderName
                  ? path.join(process.cwd(), folderName)
                  : process.cwd();
                if (!fs.existsSync(metaFold))
                  fs.mkdirSync(metaFold, { recursive: true });
                const proc = await ffmpeg();
                const AmetaEntry = await lowEntry(metaBody.AudioStore);
                const VmetaEntry = await lowEntry(metaBody.VideoStore);
                if (AmetaEntry === undefined || VmetaEntry === undefined)
                  return;
                proc.addInput(VmetaEntry.meta_dl.mediaurl);
                proc.addInput(AmetaEntry.meta_dl.mediaurl);
                proc.format(outputFormat);
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
                      readStream.push(undefined);
                      callback();
                    },
                  });
                  proc.pipe(writeStream, { end: true });
                  results.push({
                    stream: readStream,
                    filename: folderName
                      ? path.join(metaFold, metaName.replace("-.", "."))
                      : metaName.replace("-.", "."),
                  });
                } else {
                  await new Promise<void>((resolve, reject) => {
                    proc.output(path.join(metaFold, metaName));
                    proc.on("end", () => resolve());
                    proc.on("error", reject);
                    proc.run();
                  });
                }
              } catch (error) {
                results.push(true);
              }
            }
          );
          return results;
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
    } else {
      throw new Error(colors.red("@error: ") + "internal server error");
    }
  }
}
