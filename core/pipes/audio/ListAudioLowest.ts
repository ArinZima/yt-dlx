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
import type AudioFilters from "../../interface/AudioFilters";

type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
interface ListAudioLowestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: AudioFormat;
  filter?: keyof AudioFilters;
}
type ListAudioLowestType = true | StreamResult;
const ListAudioLowestInputSchema = z.object({
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string().min(1)),
  outputFormat: z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
  filter: z.string().optional(),
});

export default async function ListAudioLowest(
  input: ListAudioLowestOC
): Promise<ListAudioLowestType[] | any> {
  try {
    const {
      filter,
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp3",
    } = ListAudioLowestInputSchema.parse(input);
    let parseList = [];
    let metaName: string = "";
    let results: ListAudioLowestType[] = [];
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
      const title: string = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName
        ? path.join(process.cwd(), folderName)
        : process.cwd();
      if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
      const metaEntry: TubeConfig | undefined = await lowEntry(
        metaBody.AudioStore
      );
      if (metaEntry === undefined) continue;
      const proc = await ffmpeg();
      proc.addInput(metaEntry.meta_dl.mediaurl);
      proc.addInput(metaBody.metaTube.thumbnail);
      proc.addOutputOption("-map", "1:0");
      proc.addOutputOption("-map", "0:a:0");
      proc.addOutputOption("-id3v2_version", "3");
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
        case "bassboost":
          proc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          metaName = `yt-dlp-(AudioLowest_bassboost)-${title}.${outputFormat}`;
          break;
        case "echo":
          proc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          metaName = `yt-dlp-(AudioLowest_echo)-${title}.${outputFormat}`;
          break;
        case "flanger":
          proc.withAudioFilter(["flanger"]);
          metaName = `yt-dlp-(AudioLowest_flanger)-${title}.${outputFormat}`;
          break;
        case "nightcore":
          proc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          metaName = `yt-dlp-(AudioLowest_nightcore)-${title}.${outputFormat}`;
          break;
        case "panning":
          proc.withAudioFilter(["apulsator=hz=0.08"]);
          metaName = `yt-dlp-(AudioLowest_panning)-${title}.${outputFormat}`;
          break;
        case "phaser":
          proc.withAudioFilter(["aphaser=in_gain=0.4"]);
          metaName = `yt-dlp-(AudioLowest_phaser)-${title}.${outputFormat}`;
          break;
        case "reverse":
          proc.withAudioFilter(["areverse"]);
          metaName = `yt-dlp-(AudioLowest_reverse)-${title}.${outputFormat}`;
          break;
        case "slow":
          proc.withAudioFilter(["atempo=0.8"]);
          metaName = `yt-dlp-(AudioLowest_slow)-${title}.${outputFormat}`;
          break;
        case "speed":
          proc.withAudioFilter(["atempo=2"]);
          metaName = `yt-dlp-(AudioLowest_speed)-${title}.${outputFormat}`;
          break;
        case "subboost":
          proc.withAudioFilter(["asubboost"]);
          metaName = `yt-dlp-(AudioLowest_subboost)-${title}.${outputFormat}`;
          break;
        case "superslow":
          proc.withAudioFilter(["atempo=0.5"]);
          metaName = `yt-dlp-(AudioLowest_superslow)-${title}.${outputFormat}`;
          break;
        case "superspeed":
          proc.withAudioFilter(["atempo=3"]);
          metaName = `yt-dlp-(AudioLowest_superspeed)-${title}.${outputFormat}`;
          break;
        case "surround":
          proc.withAudioFilter(["surround"]);
          metaName = `yt-dlp-(AudioLowest_surround)-${title}.${outputFormat}`;
          break;
        case "vaporwave":
          proc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          metaName = `yt-dlp-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
          break;
        case "vibrato":
          proc.withAudioFilter(["vibrato=f=6.5"]);
          metaName = `yt-dlp-(AudioLowest_vibrato)-${title}.${outputFormat}`;
          break;
        default:
          proc.withAudioFilter([]);
          metaName = `yt-dlp-(AudioLowest)-${title}.${outputFormat}`;
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
