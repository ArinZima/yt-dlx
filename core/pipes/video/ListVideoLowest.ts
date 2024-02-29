import * as fs from "fs";
import colors from "colors";
import web from "../../web";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import ffmpeg from "../../base/ffmpeg";
import lowEntry from "../../base/lowEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type TubeConfig from "../../interface/TubeConfig";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";

type VideoFormat = "mp4" | "avi" | "mov";
interface ListVideoLowestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: VideoFormat;
  filter?: keyof VideoFilters;
}
type ListVideoLowestType = true | StreamResult;

const ListVideoLowestInputSchema = z.object({
  filter: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string().min(1)),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
});

export default async function ListVideoLowest(
  input: ListVideoLowestOC
): Promise<ListVideoLowestType[] | any> {
  try {
    const {
      filter,
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4",
    } = ListVideoLowestInputSchema.parse(input);
    let parseList = [];
    let metaName: string = "";
    let results: ListVideoLowestType[] = [];
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
      const metaEntry: TubeConfig | undefined = await lowEntry(
        metaBody.VideoStore
      );
      if (metaEntry === undefined) continue;
      const proc = await ffmpeg();
      proc.addInput(metaEntry.meta_dl.mediaurl);
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
      switch (filter) {
        case "grayscale":
          proc.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
          break;
        case "invert":
          proc.withVideoFilter("negate");
          metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
          break;
        case "rotate90":
          proc.withVideoFilter("rotate=PI/2");
          metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
          break;
        case "rotate180":
          proc.withVideoFilter("rotate=PI");
          metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
          break;
        case "rotate270":
          proc.withVideoFilter("rotate=3*PI/2");
          metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
          break;
        case "flipHorizontal":
          proc.withVideoFilter("hflip");
          metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
          break;
        case "flipVertical":
          proc.withVideoFilter("vflip");
          metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
          break;
        default:
          metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
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
          proc.pipe(writeStream, { end: true });
          results.push({
            stream: readStream,
            filename: folderName
              ? path.join(metaFold, metaName.replace("-.", "."))
              : metaName.replace("-.", "."),
          });
          break;
        default:
          await new Promise<void>((resolve, reject) => {
            proc.output(path.join(metaFold, metaName));
            proc.on("end", () => resolve());
            proc.on("error", reject);
            proc.run();
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
