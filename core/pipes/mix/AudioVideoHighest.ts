import * as fs from "fs";
import * as path from "path";
import { z, ZodError } from "zod";
import ytCore from "../../base/agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type ErrorResult from "../../interface/ErrorResult";
import type StreamResult from "../../interface/StreamResult";
import type SuccessResult from "../../interface/SuccessResult";

type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoHighestOC {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  outputFormat?: VideoFormat;
}
type AudioVideoHighest = Promise<SuccessResult | ErrorResult | StreamResult>;

const AudioVideoHighestInputSchema = z.object({
  query: z.string(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  outputFormat: z.enum(["mp4", "avi", "mov"]).optional(),
});

export default async function AudioVideoHighest(
  input: AudioVideoHighestOC
): AudioVideoHighest {
  try {
    const {
      query,
      stream,
      verbose,
      folderName,
      outputFormat = "mp4",
    } = AudioVideoHighestInputSchema.parse(input);

    const metaBody = await ytCore({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
    }
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaName: string = `yt-core_(AudioVideoHighest)_${title}.${outputFormat}`;
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg();
    const AmetaEntry = await bigEntry(metaBody.AudioTube);
    const VmetaEntry = await bigEntry(metaBody.VideoTube);
    if (AmetaEntry === null || VmetaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
    }
    ytc.addInput(VmetaEntry.meta_dl.mediaurl);
    ytc.addInput(AmetaEntry.meta_dl.mediaurl);
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
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500,
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500,
      };
    } else {
      return {
        message: "Internal server error",
        status: 500,
      };
    }
  }
}
