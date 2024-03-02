import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import progressBar from "../../base/progressBar";
import type AudioFilters from "../../interface/AudioFilters";

const AudioQualityCustomZod = z.object({
  query: z.string().min(1),
  filter: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  quality: z.enum(["high", "medium", "low", "ultralow"]),
});
export default async function AudioQualityCustom(input: {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  filter?: keyof AudioFilters;
  quality: "high" | "medium" | "low" | "ultralow";
}): Promise<void | {
  fileName: string;
  stream: fluentffmpeg.FfprobeStreamDisposition;
}> {
  try {
    const { query, filter, stream, verbose, quality, folderName } =
      AudioQualityCustomZod.parse(input);
    const metaResp = await ytdlx({ query, verbose });
    if (!metaResp) {
      throw new Error("Unable to get response from YouTube...");
    }
    const metaBody = metaResp.AudioStore.filter(
      (op: { AVDownload: { formatnote: string } }) =>
        op.AVDownload.formatnote === quality
    );
    if (!metaBody) throw new Error("Unable to get response from YouTube...");
    let metaName: string = "";
    const title: string = metaResp.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await bigEntry(metaBody);
    if (metaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    const ffmpeg: fluentffmpeg.FfmpegCommand = fluentffmpeg();
    const outputFormat = "avi";
    ffmpeg.addInput(metaEntry.AVDownload.mediaurl);
    ffmpeg.addInput(metaResp.metaTube.thumbnail);
    ffmpeg.addOutputOption("-map", "1:0");
    ffmpeg.addOutputOption("-map", "0:a:0");
    ffmpeg.addOutputOption("-id3v2_version", "3");
    ffmpeg.outputFormat("avi");
    switch (filter) {
      case "bassboost":
        ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "flanger":
        ffmpeg.withAudioFilter(["flanger"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "panning":
        ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "phaser":
        ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "reverse":
        ffmpeg.withAudioFilter(["areverse"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "slow":
        ffmpeg.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "speed":
        ffmpeg.withAudioFilter(["atempo=2"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "subboost":
        ffmpeg.withAudioFilter(["asubboost"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        ffmpeg.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        ffmpeg.withAudioFilter(["atempo=3"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "surround":
        ffmpeg.withAudioFilter(["surround"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      default:
        ffmpeg.withAudioFilter([]);
        metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
        break;
    }
    ffmpeg.on("start", (command) => {
      if (verbose) console.log(command);
      progressBar({ timemark: undefined, percent: undefined });
    });
    ffmpeg.on("end", () => {
      progressBar({ timemark: undefined, percent: undefined });
    });
    ffmpeg.on("close", () => {
      progressBar({ timemark: undefined, percent: undefined });
    });
    ffmpeg.on("progress", ({ percent, timemark }) => {
      progressBar({ timemark, percent });
    });
    ffmpeg.on("error", (error) => {
      return error;
    });
    if (stream) {
      return {
        stream: ffmpeg,
        fileName: folderName
          ? path.join(metaFold, metaName.replace("-.", "."))
          : metaName.replace("-.", "."),
      };
    } else {
      await new Promise<void>((resolve, reject) => {
        ffmpeg.output(path.join(metaFold, metaName));
        ffmpeg.on("end", () => resolve());
        ffmpeg.on("error", reject);
        ffmpeg.run();
      });
    }
    console.log(
      colors.green("@info:"),
      "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
    );
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        colors.red("@error: ") +
          error.errors.map((error) => error.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors.red("@error: ") + error.message);
    } else throw new Error(colors.red("@error: ") + "internal server error");
  }
}
