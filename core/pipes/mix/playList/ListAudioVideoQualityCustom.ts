import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import web from "../../../web";
import { z, ZodError } from "zod";
import ytdlx from "../../../base/Agent";
import gpuffmpeg from "../../../base/ffmpeg";
import bigEntry from "../../../base/bigEntry";
import YouTubeID from "../../../web/YouTubeId";
import { sizeFormat } from "../../../base/Engine";
import type { gpuffmpegCommand } from "../../../base/ffmpeg";
import runFunc from "../../../base/runFunc";

const qconf = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  torproxy: z.string().min(1).optional(),
  query: z
    .array(
      z
        .string()
        .min(1)
        .refine(
          async (input) => {
            switch (true) {
              case /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist\?|embed\/|v\/|channel\/)(list=)?)([a-zA-Z0-9_-]+)/.test(
                input
              ):
                const resultLink = await YouTubeID(input);
                if (resultLink !== undefined) return true;
                break;
              default:
                const resultId = await YouTubeID(
                  `https://www.youtube.com/playlist?list=${input}`
                );
                if (resultId !== undefined) return true;
                break;
            }
            return false;
          },
          {
            message: "Query must be a valid YouTube Playlist Link or ID.",
          }
        )
    )
    .min(1),
  AQuality: z.enum(["high", "medium", "low", "ultralow"]),
  VQuality: z.enum([
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "1440p",
    "2160p",
    "2880p",
    "4320p",
    "5760p",
    "8640p",
    "12000p",
  ]),
  filter: z
    .enum([
      "invert",
      "rotate90",
      "rotate270",
      "grayscale",
      "rotate180",
      "flipVertical",
      "flipHorizontal",
    ])
    .optional(),
});
export default async function ListAudioVideoQualityCustom(input: {
  query: string[];
  output?: string;
  verbose?: boolean;
  torproxy?: string;
  AQuality: "high" | "medium" | "low" | "ultralow";
  VQuality:
    | "144p"
    | "240p"
    | "360p"
    | "480p"
    | "720p"
    | "1080p"
    | "1440p"
    | "2160p"
    | "2880p"
    | "4320p"
    | "5760p"
    | "8640p"
    | "12000p";
  filter?:
    | "invert"
    | "rotate90"
    | "rotate270"
    | "grayscale"
    | "rotate180"
    | "flipVertical"
    | "flipHorizontal";
}): Promise<void | {
  filename: string;
  ffmpeg: gpuffmpegCommand;
}> {
  try {
    const { query, verbose, output, VQuality, AQuality, filter, torproxy } =
      await qconf.parseAsync(input);
    const response = await runFunc(async () => {
      const vDATA = new Set<{
        ago: string;
        title: string;
        views: string;
        author: string;
        videoId: string;
        videoLink: string;
        authorUrl: string;
        thumbnailUrls: string[];
      }>();
      for (const pURL of query) {
        try {
          const pDATA = await web.search.PlaylistInfo({
            query: pURL,
            torproxy,
          });
          if (pDATA === undefined) {
            console.log(
              colors.red("@error:"),
              "unable to get response from youtube for",
              pURL
            );
            continue;
          }
          for (const video of pDATA.playlistVideos) vDATA.add(video);
        } catch (error) {
          console.log(colors.red("@error:"), error);
          continue;
        }
      }
      console.log(
        colors.green("@info:"),
        "total number of uncommon videos:",
        colors.yellow(vDATA.size.toString())
      );
      for (const video of vDATA) {
        try {
          const engineData = await ytdlx({
            query: video.videoLink,
            torproxy,
            verbose,
          });
          if (engineData === undefined) {
            console.log(
              colors.red("@error:"),
              "unable to get response from youtube."
            );
            continue;
          }
          const title: string = engineData.metaTube.title.replace(
            /[^a-zA-Z0-9_]+/g,
            "_"
          );
          const folder = output
            ? path.join(process.cwd(), output)
            : process.cwd();
          if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
          const ACustomData = engineData.AudioStore.filter(
            (op) => op.AVDownload.formatnote === AQuality
          );
          const VCustomData = engineData.VideoStore.filter(
            (op) => op.AVDownload.formatnote === VQuality
          );
          const [AudioData, VideoData] = await Promise.all([
            await bigEntry(ACustomData),
            await bigEntry(VCustomData),
          ]);
          let filename: string = "yt-dlx_(AudioVideoQualityCustom_";
          const ffmpeg: gpuffmpegCommand = await gpuffmpeg({
            size: sizeFormat(
              AudioData.AVInfo.filesizebytes + VideoData.AVInfo.filesizebytes
            ).toString(),
            input: VideoData.AVDownload.mediaurl,
            verbose,
          });
          ffmpeg.addInput(AudioData.AVDownload.mediaurl);
          ffmpeg.withOutputFormat("matroska");
          if (filter === "grayscale") {
            ffmpeg.withVideoFilter(
              "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
            );
            filename += `grayscale)_${title}.mkv`;
          } else if (filter === "invert") {
            ffmpeg.withVideoFilter("negate");
            filename += `invert)_${title}.mkv`;
          } else if (filter === "rotate90") {
            ffmpeg.withVideoFilter("rotate=PI/2");
            filename += `rotate90)_${title}.mkv`;
          } else if (filter === "rotate180") {
            ffmpeg.withVideoFilter("rotate=PI");
            filename += `rotate180)_${title}.mkv`;
          } else if (filter === "rotate270") {
            ffmpeg.withVideoFilter("rotate=3*PI/2");
            filename += `rotate270)_${title}.mkv`;
          } else if (filter === "flipHorizontal") {
            ffmpeg.withVideoFilter("hflip");
            filename += `flipHorizontal)_${title}.mkv`;
          } else if (filter === "flipVertical") {
            ffmpeg.withVideoFilter("vflip");
            filename += `flipVertical)_${title}.mkv`;
          } else filename += `)_${title}.mkv`;
          await new Promise<void>((resolve, _reject) => {
            ffmpeg.output(path.join(folder, filename.replace("_)_", ")_")));
            ffmpeg.on("end", () => resolve());
            ffmpeg.on("error", (error) => {
              throw new Error(colors.red("@error: ") + error.message);
            });
            ffmpeg.run();
          });
        } catch (error) {
          console.log(colors.red("@error:"), error);
          continue;
        }
      }
      console.log(
        colors.green("@info:"),
        "❣️ Thank you for using",
        colors.green("yt-dlx."),
        "If you enjoy the project, consider",
        colors.green("🌟starring"),
        "the github repo",
        colors.green("https://github.com/yt-dlx")
      );
    });
    return response;
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
