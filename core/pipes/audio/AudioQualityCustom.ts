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
type AudioQualities = "high" | "medium" | "low" | "ultralow";
interface AudioQualityCustomOC {
  query: string;
  stream?: boolean;
  folderName?: string;
  quality: AudioQualities;
  outputFormat?: AudioFormat;
  filter?: keyof AudioFilters;
}
type AudioQualityCustomType = Promise<
  SuccessResult | ErrorResult | StreamResult
>;
export default async function AudioQualityCustom({
  query,
  filter,
  quality,
  stream,
  folderName,
  outputFormat = "mp3",
}: AudioQualityCustomOC): AudioQualityCustomType {
  try {
    if (
      !query ||
      typeof query !== "string" ||
      !quality ||
      typeof quality !== "string"
    ) {
      return {
        message: "Invalid query or quality parameter",
        status: 500,
      };
    }
    const metaResp = await ytCore({ query });
    if (!metaResp) {
      return {
        message: "The specified quality was not found...",
        status: 500,
      };
    }
    const metaBody = metaResp.AudioTube.filter(
      (op: { meta_dl: { formatnote: string } }) =>
        op.meta_dl.formatnote === quality
    );
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
    }
    const title: string = metaResp.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg();
    const metaEntry = bigEntry(metaBody);
    ytc.input(metaEntry.meta_dl.mediaurl);
    ytc.input(metaResp.metaTube.thumbnail);
    ytc.addOutputOption("-map", "1:0");
    ytc.addOutputOption("-map", "0:a:0");
    ytc.addOutputOption("-id3v2_version", "3");
    ytc.withAudioBitrate(metaEntry.meta_audio.bitrate);
    ytc.withAudioChannels(metaEntry.meta_audio.channels);
    ytc.format(outputFormat);
    switch (filter) {
      case "bassboost":
        ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        break;
      case "echo":
        ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        break;
      case "flanger":
        ytc.withAudioFilter(["flanger"]);
        break;
      case "nightcore":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        break;
      case "panning":
        ytc.withAudioFilter(["apulsator=hz=0.08"]);
        break;
      case "phaser":
        ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
        break;
      case "reverse":
        ytc.withAudioFilter(["areverse"]);
        break;
      case "slow":
        ytc.withAudioFilter(["atempo=0.8"]);
        break;
      case "speed":
        ytc.withAudioFilter(["atempo=2"]);
        break;
      case "subboost":
        ytc.withAudioFilter(["asubboost"]);
        break;
      case "superslow":
        ytc.withAudioFilter(["atempo=0.5"]);
        break;
      case "superspeed":
        ytc.withAudioFilter(["atempo=3"]);
        break;
      case "surround":
        ytc.withAudioFilter(["surround"]);
        break;
      case "vaporwave":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        break;
      case "vibrato":
        ytc.withAudioFilter(["vibrato=f=6.5"]);
        break;
      default:
        ytc.withAudioFilter([]);
        break;
    }
    ytc.on("start", () => progressBar(0, metaSpin));
    ytc.on("end", () => progressBar(100, metaSpin));
    ytc.on("close", () => progressBar(100, metaSpin));
    ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin));
    ytc.on("error", (error) => {
      return error;
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
          readStream.push(null);
          callback();
        },
      });
      ytc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName
          ? path.join(metaFold, `yt-core-(${quality})-${title}.${outputFormat}`)
          : `yt-core-(${quality})-${title}.${outputFormat}`,
      };
    } else {
      await new Promise<void>((resolve, reject) => {
        ytc
          .output(
            path.join(metaFold, `yt-core-(${quality})-${title}.${outputFormat}`)
          )
          .on("error", reject)
          .on("end", () => {
            resolve();
          })
          .run();
      });
      return {
        message: "process ended...",
        status: 200,
      };
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
