import * as fs from "fs";
import async from "async";
import colors from "colors";
import * as path from "path";
import { randomUUID } from "crypto";
import ytCore from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import lowEntry from "../../base/lowEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import get_playlist from "../command/get_playlist";
import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";

const metaSpin = randomUUID().toString();
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
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
interface ListAudioLowestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: AudioFormat;
  filter?: keyof AudioFilters;
}
type ListAudioLowestType = SuccessResult | ErrorResult | StreamResult;
export default async function ListAudioLowest({
  filter,
  stream,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp3",
}: ListAudioLowestOC): Promise<ListAudioLowestType[]> {
  try {
    if (
      !Array.isArray(playlistUrls) ||
      !playlistUrls.every((url) => typeof url === "string")
    ) {
      return [
        {
          message:
            "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500,
        },
      ];
    }
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
      const results: ListAudioLowestType[] = [];
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
            const metaEntry = lowEntry(metaBody.AudioTube);
            const ytc = fluentffmpeg();
            ytc.addInput(metaEntry.meta_dl.mediaurl);
            ytc.addInput(metaBody.metaTube.thumbnail);
            ytc.addOutputOption("-map", "1:0");
            ytc.addOutputOption("-map", "0:a:0");
            ytc.addOutputOption("-id3v2_version", "3");
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose) console.log(cmd);
              progressBar(0, metaSpin);
            });
            ytc.on("end", () => progressBar(100, metaSpin));
            ytc.on("close", () => progressBar(100, metaSpin));
            ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin));
            switch (filter) {
              case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                metaName = `yt-core-(AudioLowest_bassboost)-${title}.${outputFormat}`;
                break;
              case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                metaName = `yt-core-(AudioLowest_echo)-${title}.${outputFormat}`;
                break;
              case "flanger":
                ytc.withAudioFilter(["flanger"]);
                metaName = `yt-core-(AudioLowest_flanger)-${title}.${outputFormat}`;
                break;
              case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                metaName = `yt-core-(AudioLowest_nightcore)-${title}.${outputFormat}`;
                break;
              case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                metaName = `yt-core-(AudioLowest_panning)-${title}.${outputFormat}`;
                break;
              case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                metaName = `yt-core-(AudioLowest_phaser)-${title}.${outputFormat}`;
                break;
              case "reverse":
                ytc.withAudioFilter(["areverse"]);
                metaName = `yt-core-(AudioLowest_reverse)-${title}.${outputFormat}`;
                break;
              case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                metaName = `yt-core-(AudioLowest_slow)-${title}.${outputFormat}`;
                break;
              case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                metaName = `yt-core-(AudioLowest_speed)-${title}.${outputFormat}`;
                break;
              case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                metaName = `yt-core-(AudioLowest_subboost)-${title}.${outputFormat}`;
                break;
              case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                metaName = `yt-core-(AudioLowest_superslow)-${title}.${outputFormat}`;
                break;
              case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                metaName = `yt-core-(AudioLowest_superspeed)-${title}.${outputFormat}`;
                break;
              case "surround":
                ytc.withAudioFilter(["surround"]);
                metaName = `yt-core-(AudioLowest_surround)-${title}.${outputFormat}`;
                break;
              case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                metaName = `yt-core-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
                break;
              case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                metaName = `yt-core-(AudioLowest_vibrato)-${title}.${outputFormat}`;
                break;
              default:
                ytc.withAudioFilter([]);
                metaName = `yt-core-(AudioLowest)-${title}.${outputFormat}`;
                break;
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
                filename: folderName ? path.join(metaFold, metaName) : metaName,
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
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500,
          },
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500,
          },
        ];
    }
  }
}
