import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import ytCore from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type AudioFilters from "../../interface/AudioFilters";
import type SuccessResult from "../../interface/SuccessResult";
import type StreamResult from "../../interface/StreamResult";
import type ErrorResult from "../../interface/ErrorResult";

const metaSpin = randomUUID().toString();
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
type AudioHighestOC = {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  outputFormat?: AudioFormat;
  filter?: keyof AudioFilters;
};
type AudioHighestType = Promise<SuccessResult | ErrorResult | StreamResult>;
export default async function AudioHighest({
  query,
  filter,
  stream,
  verbose,
  folderName,
  outputFormat = "mp3",
}: AudioHighestOC): AudioHighestType {
  try {
    switch (true) {
      case !query:
        return {
          message: "Query parameter is missing",
          status: 500,
        };
      case typeof query !== "string":
        return {
          message: "Query parameter must be a string",
          status: 500,
        };
      case query.trim().length === 0:
        return {
          message: "Query parameter cannot be empty",
          status: 500,
        };
      default:
        const metaBody = await ytCore({ query });
        if (!metaBody) {
          return {
            message: "Unable to get response from YouTube...",
            status: 500,
          };
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
        const metaEntry = bigEntry(metaBody.AudioTube);
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
        ytc.on("error", (error) => {
          return error;
        });
        switch (filter) {
          case "bassboost":
            ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
            metaName = `yt-core-(AudioHighest_bassboost)-${title}.${outputFormat}`;
            break;
          case "echo":
            ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
            metaName = `yt-core-(AudioHighest_echo)-${title}.${outputFormat}`;
            break;
          case "flanger":
            ytc.withAudioFilter(["flanger"]);
            metaName = `yt-core-(AudioHighest_flanger)-${title}.${outputFormat}`;
            break;
          case "nightcore":
            ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
            metaName = `yt-core-(AudioHighest_nightcore)-${title}.${outputFormat}`;
            break;
          case "panning":
            ytc.withAudioFilter(["apulsator=hz=0.08"]);
            metaName = `yt-core-(AudioHighest_panning)-${title}.${outputFormat}`;
            break;
          case "phaser":
            ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
            metaName = `yt-core-(AudioHighest_phaser)-${title}.${outputFormat}`;
            break;
          case "reverse":
            ytc.withAudioFilter(["areverse"]);
            metaName = `yt-core-(AudioHighest_reverse)-${title}.${outputFormat}`;
            break;
          case "slow":
            ytc.withAudioFilter(["atempo=0.8"]);
            metaName = `yt-core-(AudioHighest_slow)-${title}.${outputFormat}`;
            break;
          case "speed":
            ytc.withAudioFilter(["atempo=2"]);
            metaName = `yt-core-(AudioHighest_speed)-${title}.${outputFormat}`;
            break;
          case "subboost":
            ytc.withAudioFilter(["asubboost"]);
            metaName = `yt-core-(AudioHighest_subboost)-${title}.${outputFormat}`;
            break;
          case "superslow":
            ytc.withAudioFilter(["atempo=0.5"]);
            metaName = `yt-core-(AudioHighest_superslow)-${title}.${outputFormat}`;
            break;
          case "superspeed":
            ytc.withAudioFilter(["atempo=3"]);
            metaName = `yt-core-(AudioHighest_superspeed)-${title}.${outputFormat}`;
            break;
          case "surround":
            ytc.withAudioFilter(["surround"]);
            metaName = `yt-core-(AudioHighest_surround)-${title}.${outputFormat}`;
            break;
          case "vaporwave":
            ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
            metaName = `yt-core-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
            break;
          case "vibrato":
            ytc.withAudioFilter(["vibrato=f=6.5"]);
            metaName = `yt-core-(AudioHighest_vibrato)-${title}.${outputFormat}`;
            break;
          default:
            ytc.withAudioFilter([]);
            metaName = `yt-core-(AudioHighest)-${title}.${outputFormat}`;
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
          return {
            stream: readStream,
            filename: folderName ? path.join(metaFold, metaName) : metaName,
          };
        } else {
          await new Promise<void>((resolve, reject) => {
            ytc
              .output(path.join(metaFold, metaName))
              .on("error", reject)
              .on("end", () => {
                resolve();
                return {
                  status: 200,
                  message: "process ended...",
                };
              })
              .run();
          });
          return {
            status: 200,
            message: "process ended...",
          };
        }
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500,
        };
      default:
        return {
          message: "Internal server error",
          status: 500,
        };
    }
  }
}
