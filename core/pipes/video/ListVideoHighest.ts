import * as fs from "fs";
import colors from "colors";
import web from "../../web";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type TubeConfig from "../../interface/TubeConfig";
import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";

type VideoFormat = "mp4" | "avi" | "mov";
interface ListVideoHighestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type ListVideoHighestType = 200 | ErrorResult | StreamResult;
const ListVideoHighestInputSchema = z.object({
  filter: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string().min(1)),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
});
export default async function ListVideoHighest(
  input: ListVideoHighestOC
): Promise<any> {
  try {
    const {
      filter,
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4",
    } = ListVideoHighestInputSchema.parse(input);
    let parseList = [];
    let metaName: string = "";
    let results: ListVideoHighestType[] = [];
    const uniqueVideoIds = new Set();
    for (const videoLink of playlistUrls) {
      const metaList = await web.search.PlaylistInfo({ query: videoLink });
      if (metaList === undefined || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500,
        };
      }
      const uniqueVideos = metaList.playlistVideos.filter(
        (video) => !uniqueVideoIds.has(video.videoId)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
    }
    console.log(
      colors.bold.green("INFO:"),
      "🎁Total Unique Videos:",
      parseList.length
    );
    for (const i of parseList) {
      const TubeBody = await web.search.VideoInfo({
        query: i.videoLink,
      });
      if (TubeBody === undefined) continue;
      const metaBody = await ytdlx({
        query: TubeBody.videoLink,
      });
      if (metaBody === undefined) continue;
      const title: string = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName
        ? path.join(process.cwd(), folderName)
        : process.cwd();
      if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
      const metaEntry: TubeConfig | undefined = await bigEntry(
        metaBody.VideoStore
      );
      if (metaEntry === undefined) continue;
      const ytc = fluentffmpeg();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.format(outputFormat);
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
      switch (filter) {
        case "grayscale":
          ytc.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
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
      switch (true) {
        case stream:
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
          ytc.pipe(writeStream, { end: true });
          results.push({
            stream: readStream,
            filename: folderName
              ? path.join(metaFold, metaName.replace("-.", "."))
              : metaName.replace("-.", "."),
          });
          break;
        default:
          await new Promise<void>((resolve, reject) => {
            ytc
              .output(path.join(metaFold, metaName))
              .on("end", () => resolve())
              .on("error", reject)
              .run();
          });
          break;
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
