import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../base/Agent";
import ffmpeg from "../../base/ffmpeg";
import lowEntry from "../../base/lowEntry";
import { Readable, Writable } from "stream";
import progressBar from "../../base/progressBar";
import type StreamResult from "../../interface/StreamResult";

type VideoFormat = "webm" | "avi" | "mov";
interface AudioVideoLowestOC {
  query: string;
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  outputFormat?: VideoFormat;
}
type AudioVideoLowestType = Promise<true | StreamResult>;
const AudioVideoLowestInputSchema = z.object({
  query: z.string().min(1),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  outputFormat: z.enum(["webm", "avi", "mov"]).optional(),
});

export default async function AudioVideoLowest(
  input: AudioVideoLowestOC
): AudioVideoLowestType {
  try {
    const {
      query,
      stream,
      verbose,
      folderName,
      outputFormat = "webm",
    } = AudioVideoLowestInputSchema.parse(input);
    const metaBody = await ytdlx({ query });
    if (!metaBody) {
      throw new Error("Unable to get response from YouTube...");
    }
    const title: string = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaName: string = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
    const metaFold = folderName
      ? path.join(process.cwd(), folderName)
      : process.cwd();
    if (!fs.existsSync(metaFold)) fs.mkdirSync(metaFold, { recursive: true });
    const proc = await ffmpeg();
    const AmetaEntry = await lowEntry(metaBody.AudioStore);
    const VmetaEntry = await lowEntry(metaBody.VideoStore);
    if (AmetaEntry === undefined || VmetaEntry === undefined) {
      throw new Error("Unable to get response from YouTube...");
    }
    proc.addInput(VmetaEntry.AVDownload.mediaurl);
    proc.addInput(AmetaEntry.AVDownload.mediaurl);
    proc.addOption("-spatial-aq", "1");
    proc.addOption("-preset", "slow");
    proc.addOption("-level:v", "4.2");
    proc.addOption("-rc", "vbr_hq");
    proc.addOption("-b:v", "10M");
    proc.addOption("-shortest");
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
    proc.on("error", (error) => {
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
      proc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName
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
