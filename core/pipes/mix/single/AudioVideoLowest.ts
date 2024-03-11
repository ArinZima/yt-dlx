import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { z, ZodError } from "zod";
import ytdlx from "../../../base/Agent";
import proTube from "../../../base/ffmpeg";
import lowEntry from "../../../base/lowEntry";
import type { proTubeCommand } from "../../../base/ffmpeg";
/**
 * AudioVideoHighest function is designed for fetching lowest audio & video content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply video filters like invert, rotate90, grayscale, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio & video manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  proxy: z.string().min(1).optional(),
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
export default async function AudioVideoLowest(input: {
  query: string;
  output?: string;
  stream?: boolean;
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
    const { query, stream, verbose, output, filter, proxy } =
      await qconf.parseAsync(input);
    const engineData = await ytdlx({ query, verbose, proxy });
    if (engineData === undefined) {
      throw new Error(
        colors.red("@error: ") + "unable to get response from youtube."
      );
    } else {
      const title: string = engineData.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "_"
      );
      const folder = output ? path.join(process.cwd(), output) : process.cwd();
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      const [AudioData, VideoData] = await Promise.all([
        lowEntry(engineData.AudioStore),
        lowEntry(engineData.VideoStore),
      ]);
      const ffmpeg: proTubeCommand = await proTube({
        adata: AudioData,
        vdata: VideoData,
        ipAddress: engineData.ipAddress,
      });
      ffmpeg.addInput(AudioData.AVDownload.mediaurl);
      ffmpeg.withOutputFormat("matroska");
      let filename: string = "yt-dlx_(AudioVideoLowest_";
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
      if (stream) {
        return {
          ffmpeg,
          filename: output
            ? path.join(folder, filename)
            : filename.replace("_)_", ")_"),
        };
      } else {
        await new Promise<void>((resolve, _reject) => {
          ffmpeg.output(path.join(folder, filename.replace("_)_", ")_")));
          ffmpeg.on("end", () => resolve());
          ffmpeg.on("error", (error) => {
            throw new Error(colors.red("@error: ") + error.message);
          });
          ffmpeg.run();
        });
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
    }
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
