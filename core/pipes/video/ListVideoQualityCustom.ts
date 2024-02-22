import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytDlp from "../../base/agent";
import scrape from "../../base/scrape";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type TubeConfig from "../../interface/TubeConfig";
import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type VideoFilters from "../../interface/VideoFilters";
import type SuccessResult from "../../interface/SuccessResult";

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

const ListVideoQualityCustomInputSchema = z.object({
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string()),
  quality: z.enum([
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "1440p",
    "2160p",
    "2880p",
    "4320p",
    "5760p",
    "8640p",
    "12000p",
  ]),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
  filter: z.string().optional(),
});

export default async function ListVideoQualityCustom(
  input: ListVideoQualityCustomOC
): Promise<ListVideoQualityCustomType[] | any> {
  try {
    const {
      filter,
      stream,
      quality,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4",
    } = ListVideoQualityCustomInputSchema.parse(input);
    let parseList = [];
    let metaName: string = "";
    let results: ListVideoQualityCustomType[] = [];
    const uniqueVideoIds = new Set();
    for (const url of playlistUrls) {
      const metaList = await scrape(url);
      if (metaList === null || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500,
        };
      }
      const parsedMetaList = await JSON.parse(metaList);
      const uniqueVideos = parsedMetaList.Videos.filter(
        (video: { id: unknown }) => !uniqueVideoIds.has(video.id)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach((video: { id: unknown }) =>
        uniqueVideoIds.add(video.id)
      );
    }
    console.log(
      colors.bold.green("INFO:"),
      "🎁Total Unique Videos:",
      parseList.length
    );

    for (const i of parseList) {
      const TubeBody: string | null = await scrape(i.videoId);
      if (TubeBody === null) continue;
      const parseTube = await JSON.parse(TubeBody);
      const metaBody = await ytDlp({
        query: parseTube.Link,
      });
      if (metaBody === null) continue;
      const newBody = metaBody.VideoTube.filter(
        (op: { meta_dl: { formatnote: string } }) =>
          op.meta_dl.formatnote === quality
      );
      if (!newBody || newBody === null) continue;
      const title: string = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName
        ? path.join(process.cwd(), folderName)
        : process.cwd();
      if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
      const metaEntry: TubeConfig | null = await bigEntry(newBody);
      if (metaEntry === null) continue;
      const ytc = fluentffmpeg();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.format(outputFormat);
      ytc.on("start", (command) => {
        if (verbose) console.log(command);
        progressBar({
          currentKbps: undefined,
          timemark: undefined,
          percent: undefined,
        });
      });
      ytc.on("end", () => {
        progressBar({
          currentKbps: undefined,
          timemark: undefined,
          percent: undefined,
        });
      });
      ytc.on("close", () => {
        progressBar({
          currentKbps: undefined,
          timemark: undefined,
          percent: undefined,
        });
      });
      ytc.on("progress", (prog) => {
        progressBar({
          currentKbps: prog.currentKbps,
          timemark: prog.timemark,
          percent: prog.percent,
        });
      });
      switch (filter) {
        case "grayscale":
          ytc.withVideoFilter([
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3",
          ]);
          metaName = `yt-dlp_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
          break;
        case "invert":
          ytc.withVideoFilter(["negate"]);
          metaName = `yt-dlp_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
          break;
        case "rotate90":
          ytc.withVideoFilter(["rotate=PI/2"]);
          metaName = `yt-dlp_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
          break;
        case "rotate180":
          ytc.withVideoFilter(["rotate=PI"]);
          metaName = `yt-dlp_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
          break;
        case "rotate270":
          ytc.withVideoFilter(["rotate=3*PI/2"]);
          metaName = `yt-dlp_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
          break;
        case "flipHorizontal":
          ytc.withVideoFilter(["hflip"]);
          metaName = `yt-dlp_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
          break;
        case "flipVertical":
          ytc.withVideoFilter(["vflip"]);
          metaName = `yt-dlp_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
          break;
        default:
          ytc.withVideoFilter([]);
          metaName = `yt-dlp_(VideoQualityCustom)_${title}.${outputFormat}`;
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
              readStream.push(null);
              callback();
            },
          });
          ytc.pipe(writeStream, { end: true });
          results.push({
            stream: readStream,
            filename: folderName ? path.join(metaFold, metaName) : metaName,
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
