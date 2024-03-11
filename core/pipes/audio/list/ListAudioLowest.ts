import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import web from "../../../web";
import { z, ZodError } from "zod";
import ytdlx from "../../../base/Agent";
import proTube from "../../../base/ffmpeg";
import lowEntry from "../../../base/lowEntry";
import YouTubeID from "../../../web/YouTubeId";
import type { proTubeCommand } from "../../../base/ffmpeg";

const qconf = z.object({
  output: z.string().optional(),
  verbose: z.boolean().optional(),
  autoSocks5: z.boolean().optional(),
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
      "echo",
      "slow",
      "speed",
      "phaser",
      "flanger",
      "panning",
      "reverse",
      "vibrato",
      "subboost",
      "surround",
      "bassboost",
      "nightcore",
      "superslow",
      "vaporwave",
      "superspeed",
    ])
    .optional(),
});
export default async function ListAudioLowest(input: {
  query: string[];
  output?: string;
  verbose?: boolean;
  autoSocks5?: boolean;
  filter?:
    | "echo"
    | "slow"
    | "speed"
    | "phaser"
    | "flanger"
    | "panning"
    | "reverse"
    | "vibrato"
    | "subboost"
    | "surround"
    | "bassboost"
    | "nightcore"
    | "superslow"
    | "vaporwave"
    | "superspeed";
}): Promise<void> {
  try {
    const { query, output, verbose, filter, autoSocks5 } =
      await qconf.parseAsync(input);
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
          autoSocks5,
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
          autoSocks5,
          verbose,
        });
        if (engineData === undefined) {
          console.log(
            colors.red("@error:"),
            "unable to get response from youtube for",
            video.videoLink
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
        let filename: string = "yt-dlx_(AudioLowest_";
        const ffmpeg: proTubeCommand = await proTube({
          adata: await lowEntry(engineData.AudioStore),
          ipAddress: engineData.ipAddress,
        });
        ffmpeg.withOutputFormat("avi");
        switch (filter) {
          case "bassboost":
            ffmpeg.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
            filename += `bassboost)_${title}.avi`;
            break;
          case "echo":
            ffmpeg.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
            filename += `echo)_${title}.avi`;
            break;
          case "flanger":
            ffmpeg.withAudioFilter(["flanger"]);
            filename += `flanger)_${title}.avi`;
            break;
          case "nightcore":
            ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
            filename += `nightcore)_${title}.avi`;
            break;
          case "panning":
            ffmpeg.withAudioFilter(["apulsator=hz=0.08"]);
            filename += `panning)_${title}.avi`;
            break;
          case "phaser":
            ffmpeg.withAudioFilter(["aphaser=in_gain=0.4"]);
            filename += `phaser)_${title}.avi`;
            break;
          case "reverse":
            ffmpeg.withAudioFilter(["areverse"]);
            filename += `reverse)_${title}.avi`;
            break;
          case "slow":
            ffmpeg.withAudioFilter(["atempo=0.8"]);
            filename += `slow)_${title}.avi`;
            break;
          case "speed":
            ffmpeg.withAudioFilter(["atempo=2"]);
            filename += `speed)_${title}.avi`;
            break;
          case "subboost":
            ffmpeg.withAudioFilter(["asubboost"]);
            filename += `subboost)_${title}.avi`;
            break;
          case "superslow":
            ffmpeg.withAudioFilter(["atempo=0.5"]);
            filename += `superslow)_${title}.avi`;
            break;
          case "superspeed":
            ffmpeg.withAudioFilter(["atempo=3"]);
            filename += `superspeed)_${title}.avi`;
            break;
          case "surround":
            ffmpeg.withAudioFilter(["surround"]);
            filename += `surround)_${title}.avi`;
            break;
          case "vaporwave":
            ffmpeg.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
            filename += `vaporwave)_${title}.avi`;
            break;
          case "vibrato":
            ffmpeg.withAudioFilter(["vibrato=f=6.5"]);
            filename += `vibrato)_${title}.avi`;
            break;
          default:
            filename += `)_${title}.avi`;
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
      "Consider",
      colors.green("🌟starring"),
      "the github repo",
      colors.green("https://github.com/yt-dlx\n")
    );
  } catch (error) {
    switch (true) {
      case error instanceof ZodError:
        throw error.errors.map((err) => err.message).join(", ");
      case error instanceof Error:
        throw error.message;
      default:
        throw "Internal server error";
    }
  }
}
