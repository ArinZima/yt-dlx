import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import fluentffmpeg from "fluent-ffmpeg";
import bigEntry from "../../base/bigEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type StreamResult from "../../interface/StreamResult";

type VideoFormat = "mp4" | "avi" | "mov";
interface AudioVideoHighestOC {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  outputFormat?: VideoFormat;
}
type AudioVideoHighest = Promise<true | StreamResult>;
const AudioVideoHighestInputSchema = z.object({
  query: z.string().min(1),
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

    const metaBody = await ytdlx({ query });
    if (!metaBody) {
      throw new Error("Unable to get response from YouTube...");
    }
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaName: string = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg();
    const AmetaEntry = await bigEntry(metaBody.AudioStore);
    const VmetaEntry = await bigEntry(metaBody.VideoStore);
    if (AmetaEntry === undefined || VmetaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    ytc.addInput(VmetaEntry.meta_dl.mediaurl);
    ytc.addInput(AmetaEntry.meta_dl.mediaurl);
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
          readStream.push(undefined);
          callback();
        },
      });
      ytc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName
          ? path.join(metaFold, metaName.replace("-.", "."))
          : metaName.replace("-.", "."),
      };
    } else {
      await new Promise<void>((resolve, reject) => {
        ytc
          .output(path.join(metaFold, metaName))
          .on("error", reject)
          .on("end", () => resolve())
          .run();
      });
      return true;
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
