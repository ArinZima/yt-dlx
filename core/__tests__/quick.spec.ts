console.clear();
import web from "../web";
import * as fs from "fs";
import colors from "colors";
import * as async from "async";
import { Readable } from "stream";
import { z, ZodError } from "zod";
import AudioHighest from "../pipes/audio/AudioHighest";
import type AudioFilters from "../interface/AudioFilters";

interface StreamResult {
  stream: Readable;
  filename: string;
}
type ListAudioHighestType = void | StreamResult;
const ListAudioHighestZod = z.object({
  filter: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string().min(1)),
  outputFormat: z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});
export default async function ListAudioHighest(input: {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  filter?: keyof AudioFilters;
  outputFormat?: "mp3" | "ogg" | "flac" | "aiff";
}): Promise<ListAudioHighestType[] | any> {
  try {
    const {
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp3",
    } = ListAudioHighestZod.parse(input);
    let parseList = [];
    const uniqueVideoIds = new Set();
    for (const videoLink of playlistUrls) {
      const metaList = await web.search.PlaylistInfo({ query: videoLink });
      if (!metaList) throw new Error("Unable to get response from YouTube...");
      const uniqueVideos = metaList.playlistVideos.filter(
        (video) => !uniqueVideoIds.has(video.videoId)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach((video) => uniqueVideoIds.add(video.videoId));
    }
    console.log(
      colors.bold.green("@info:"),
      "total unique videos",
      parseList.length
    );
    await async.eachSeries(parseList, async (vid) => {
      const TubeBody = await web.search.VideoInfo({
        query: vid.videoLink,
      });
      await AudioHighest({
        query: TubeBody?.videoLink as string,
        outputFormat,
        folderName,
        verbose,
        stream,
      });
    });
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

async.series([
  async () => {
    try {
      let holder: any = await ListAudioHighest({
        playlistUrls: [
          "https://www.youtube.com/playlist?list=PLyORnIW1xT6xVg7z_D1ZdvgihU6W1fLhQ",
          "https://youtube.com/playlist?list=PLChOO_ZAB22WuyDODJ3kjJiU0oQzWOTyb&si=9w8lSyPKWz9ULS-z",
        ],
        folderName: ".temp",
        verbose: false,
        stream: true,
      });
      const writeStream = fs.createWriteStream(holder.filename);
      writeStream.on("open", () => {
        console.log(colors.bold.green("@info:"), "writestream opened.");
      });
      writeStream.on("error", (err) => {
        console.error(colors.bold.red("@error:"), "writestream", err.message);
      });
      writeStream.on("finish", () => {
        console.log(colors.bold.green("@pass:"), "filename", holder.filename);
      });
      holder.stream.pipe(writeStream);

      await ListAudioHighest({
        playlistUrls: [
          "https://www.youtube.com/playlist?list=PLyORnIW1xT6xVg7z_D1ZdvgihU6W1fLhQ",
          "https://youtube.com/playlist?list=PLChOO_ZAB22WuyDODJ3kjJiU0oQzWOTyb&si=9w8lSyPKWz9ULS-z",
        ],
        folderName: ".temp",
        verbose: false,
        stream: false,
      });
      console.log(colors.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
