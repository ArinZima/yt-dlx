import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import web from "../../../web";
import { z, ZodError } from "zod";
import ytdlx from "../../../base/Agent";
import proTube from "../../../base/ffmpeg";
import bigEntry from "../../../base/bigEntry";
import YouTubeID from "../../../web/YouTubeId";
import type { proTubeCommand } from "../../../base/ffmpeg";

const qconf = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  proxy: z.string().min(1).optional(),
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
export default async function ListAudioVideoHighest(input: {
  query: string[];
  output?: string;
  verbose?: boolean;
  proxy?: string;
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
  ffmpeg: proTubeCommand;
}> {
  try {
    const { query, verbose, output, filter, proxy } = await qconf.parseAsync(
      input
    );
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
        const pDATA = await web.search.PlaylistInfo({ query: pURL, proxy });
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
          proxy,
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
        const [AudioData, VideoData] = await Promise.all([
          bigEntry(engineData.AudioStore),
          bigEntry(engineData.VideoStore),
        ]);
        let filename: string = "yt-dlx_(AudioVideoHighest_";
        const ffmpeg: proTubeCommand = await proTube({
          adata: AudioData,
          vdata: VideoData,
          ipAddress: engineData.ipAddress ? engineData.ipAddress : undefined,
        });
        ffmpeg.withOutputFormat("matroska");
        switch (filter) {
          case "grayscale":
            ffmpeg.withVideoFilter(
              "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
            );
            filename += `grayscale)_${title}.mkv`;
            break;
          case "invert":
            ffmpeg.withVideoFilter("negate");
            filename += `invert)_${title}.mkv`;
            break;
          case "rotate90":
            ffmpeg.withVideoFilter("rotate=PI/2");
            filename += `rotate90)_${title}.mkv`;
            break;
          case "rotate180":
            ffmpeg.withVideoFilter("rotate=PI");
            filename += `rotate180)_${title}.mkv`;
            break;
          case "rotate270":
            ffmpeg.withVideoFilter("rotate=3*PI/2");
            filename += `rotate270)_${title}.mkv`;
            break;
          case "flipHorizontal":
            ffmpeg.withVideoFilter("hflip");
            filename += `flipHorizontal)_${title}.mkv`;
            break;
          case "flipVertical":
            ffmpeg.withVideoFilter("vflip");
            filename += `flipVertical)_${title}.mkv`;
            break;
          default:
            filename += `)_${title}.mkv`;
            break;
        }
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
