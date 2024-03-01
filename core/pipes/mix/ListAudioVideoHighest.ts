import * as fs from "fs";
import async from "async";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import get_playlist from "../command/get_playlist";

interface StreamResult {
  stream: Readable;
  filename: string;
}
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
type ListAudioVideoHighestType = void | StreamResult;
const ListAudioVideoHighestZod = z.object({
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string().min(1)),
  outputFormat: z.enum(["webm", "avi", "mov"]).optional(),
});
export default async function ListAudioVideoHighest(input: {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: "webm" | "avi" | "mov";
}): Promise<ListAudioVideoHighestType[]> {
  try {
    const {
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "webm",
    } = ListAudioVideoHighestZod.parse(input);
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
          const results: ListAudioVideoHighestType[] = [];
          await async.eachSeries(
            videos as metaVideo[],
            async (video: metaVideo) => {
              const metaBody = await ytdlx({ query: video.url });
              if (!metaBody) {
                throw new Error("Unable to get response from YouTube...");
              }
              const title: string = metaBody.metaTube.title.replace(
                /[^a-zA-Z0-9_]+/g,
                "-"
              );
              let metaName: string = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
              const metaFold = folderName
                ? path.join(process.cwd(), folderName)
                : process.cwd();
              if (!fs.existsSync(metaFold))
                fs.mkdirSync(metaFold, { recursive: true });
              const proc: fluentffmpeg.FfmpegCommand = fluentffmpeg();
              const AmetaEntry = await bigEntry(metaBody.AudioStore);
              const VmetaEntry = await bigEntry(metaBody.VideoStore);
              if (AmetaEntry === undefined || VmetaEntry === undefined) return;
              proc.addInput(VmetaEntry.AVDownload.mediaurl);
              proc.addInput(AmetaEntry.AVDownload.mediaurl);
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
