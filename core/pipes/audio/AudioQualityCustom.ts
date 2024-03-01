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
  outputFormat: z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
export default async function AudioQualityCustom(input: {
  query: string;
  stream?: boolean;
  folderName?: string;
  quality: "high" | "medium" | "low" | "ultralow";
  outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
  filter?: keyof AudioFilters;
}): Promise<void | {
  fileName: string;
  stream: fluentffmpeg.FfprobeStreamDisposition;
}> {
  try {
    const {
      query,
      filter,
      stream,
      verbose,
      quality,
      folderName,
      outputFormat = "mp3",
    } = AudioQualityCustomZod.parse(input);
    const metaResp = await ytdlx({ query });
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
    const proc: fluentffmpeg.FfmpegCommand = fluentffmpeg();
    const metaEntry = await bigEntry(metaBody);
    if (metaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    proc.addInput(metaEntry.AVDownload.mediaurl);
    proc.addInput(metaResp.metaTube.thumbnail);
    proc.addOutputOption("-map", "1:0");
    proc.addOutputOption("-map", "0:a:0");
    proc.addOutputOption("-id3v2_version", "3");
    proc.format(outputFormat);
    switch (filter) {
      case "bassboost":
        proc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        proc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "flanger":
        proc.withAudioFilter(["flanger"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "panning":
        proc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "phaser":
        proc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "reverse":
        proc.withAudioFilter(["areverse"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "slow":
        proc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "speed":
        proc.withAudioFilter(["atempo=2"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "subboost":
        proc.withAudioFilter(["asubboost"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        proc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        proc.withAudioFilter(["atempo=3"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "surround":
        proc.withAudioFilter(["surround"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        proc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        proc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
        break;
      default:
        proc.withAudioFilter([]);
        metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
        break;
    }
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
    proc.on("error", (error) => {
      return error;
    });
    if (stream) {
      return {
        stream: proc,
        fileName: folderName
          ? path.join(metaFold, metaName.replace("-.", "."))
          : metaName.replace("-.", "."),
      };
    } else {
      await new Promise<void>((resolve, reject) => {
        proc.output(path.join(metaFold, metaName));
        proc.on("end", () => resolve());
        proc.on("error", reject);
        proc.run();
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
