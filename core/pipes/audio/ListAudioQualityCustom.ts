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
import type StreamResult from "../../interface/StreamResult";
import type AudioFilters from "../../interface/AudioFilters";

type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
type AudioQualities = "high" | "medium" | "low" | "ultralow";
interface ListAudioQualityCustomOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  quality: AudioQualities;
  outputFormat?: AudioFormat;
  filter?: keyof AudioFilters;
}
type ListAudioQualityCustomType = 200 | StreamResult;
const ListAudioQualityCustomInputSchema = z.object({
  filter: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string().min(1)),
  quality: z.enum(["high", "medium", "low", "ultralow"]),
  outputFormat: z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});

export default async function ListAudioQualityCustom(
  input: ListAudioQualityCustomOC
): Promise<ListAudioQualityCustomType[] | any> {
  try {
    const {
      filter,
      stream,
      quality,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp3",
    } = ListAudioQualityCustomInputSchema.parse(input);
    let parseList = [];
    let metaName: string = "";
    let results: ListAudioQualityCustomType[] = [];
    const uniqueVideoIds = new Set();
    for (const videoLink of playlistUrls) {
      const metaList = await web.search.PlaylistInfo({ query: videoLink });
      if (metaList === undefined || !metaList) {
        throw new Error("Unable to get response from YouTube...");
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
      const newBody = metaBody.AudioStore.filter(
        (op: { meta_dl: { formatnote: string } }) =>
          op.meta_dl.formatnote === quality
      );
      if (!newBody || newBody === undefined) continue;
      const title: string = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName
        ? path.join(process.cwd(), folderName)
        : process.cwd();
      if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
      const metaEntry: TubeConfig | undefined = await bigEntry(newBody);
      if (metaEntry === undefined) continue;
      const ytc = fluentffmpeg();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.addInput(metaBody.metaTube.thumbnail);
      ytc.addOutputOption("-map", "1:0");
      ytc.addOutputOption("-map", "0:a:0");
      ytc.addOutputOption("-id3v2_version", "3");
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
        case "bassboost":
          ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
          break;
        case "echo":
          ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          metaName = `yt-dlp-(AudioQualityCustom_echo)-${title}.${outputFormat}`;
          break;
        case "flanger":
          ytc.withAudioFilter(["flanger"]);
          metaName = `yt-dlp-(AudioQualityCustom_flanger)-${title}.${outputFormat}`;
          break;
        case "nightcore":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          metaName = `yt-dlp-(AudioQualityCustom_nightcore)-${title}.${outputFormat}`;
          break;
        case "panning":
          ytc.withAudioFilter(["apulsator=hz=0.08"]);
          metaName = `yt-dlp-(AudioQualityCustom_panning)-${title}.${outputFormat}`;
          break;
        case "phaser":
          ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
          metaName = `yt-dlp-(AudioQualityCustom_phaser)-${title}.${outputFormat}`;
          break;
        case "reverse":
          ytc.withAudioFilter(["areverse"]);
          metaName = `yt-dlp-(AudioQualityCustom_reverse)-${title}.${outputFormat}`;
          break;
        case "slow":
          ytc.withAudioFilter(["atempo=0.8"]);
          metaName = `yt-dlp-(AudioQualityCustom_slow)-${title}.${outputFormat}`;
          break;
        case "speed":
          ytc.withAudioFilter(["atempo=2"]);
          metaName = `yt-dlp-(AudioQualityCustom_speed)-${title}.${outputFormat}`;
          break;
        case "subboost":
          ytc.withAudioFilter(["asubboost"]);
          metaName = `yt-dlp-(AudioQualityCustom_subboost)-${title}.${outputFormat}`;
          break;
        case "superslow":
          ytc.withAudioFilter(["atempo=0.5"]);
          metaName = `yt-dlp-(AudioQualityCustom_superslow)-${title}.${outputFormat}`;
          break;
        case "superspeed":
          ytc.withAudioFilter(["atempo=3"]);
          metaName = `yt-dlp-(AudioQualityCustom_superspeed)-${title}.${outputFormat}`;
          break;
        case "surround":
          ytc.withAudioFilter(["surround"]);
          metaName = `yt-dlp-(AudioQualityCustom_surround)-${title}.${outputFormat}`;
          break;
        case "vaporwave":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          metaName = `yt-dlp-(AudioQualityCustom_vaporwave)-${title}.${outputFormat}`;
          break;
        case "vibrato":
          ytc.withAudioFilter(["vibrato=f=6.5"]);
          metaName = `yt-dlp-(AudioQualityCustom_vibrato)-${title}.${outputFormat}`;
          break;
        default:
          ytc.withAudioFilter([]);
          metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
          break;
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
