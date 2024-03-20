import { z } from "zod";
import * as os from "os";
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import ytdlx from "../../../base/Agent";
import formatTime from "../../../base/formatTime";
import type { FfmpegCommand } from "fluent-ffmpeg";
import calculateETA from "../../../base/calculateETA";

/**
 * AudioLowest function is designed for fetching lowest audio content from YouTube with various customization options.
 * It allows users to specify their search query, choose output format and apply audio filters like echo, flanger, nightcore, and more.
 * It also allows user to specify verbose output and adding proxies.
 * Users can opt to stream the content or save it locally. This function seamlessly integrates YouTube downloading capabilities,
 * audio manipulation using FFmpeg, and error handling for a smooth user experience.
 */
const qconf = z.object({
  query: z.string().min(1),
  output: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  onionTor: z.boolean().optional(),
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

export default async function AudioLowest(input: {
  query: string;
  output?: string;
  stream?: boolean;
  verbose?: boolean;
  onionTor?: boolean;
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
}): Promise<void | { filename: string; ffmpeg: FfmpegCommand }> {
  let startTime: Date;
  const { query, output, stream, verbose, filter, onionTor } =
    await qconf.parseAsync(input);
  const engineData = await ytdlx({ query, verbose, onionTor });
  if (engineData === undefined) {
    throw new Error(
      colors.red("@error: ") + "unable to get response from YouTube."
    );
  } else {
    const title: string = engineData.metaData.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "_"
    );
    const folder = output ? path.join(process.cwd(), output) : process.cwd();
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    let filename: string = "yt-dlx_(AudioLowest_";
    const numThreads = os.cpus().length * 2;
    const ff: FfmpegCommand = ffmpeg();
    ff.addInput(engineData.AudioLowF.url);
    ff.addInput(engineData.metaData.thumbnail);
    ff.addOption("-threads", numThreads.toString());
    ff.addOption("-headers", "X-Forwarded-For: " + engineData.ipAddress);
    switch (filter) {
      case "bassboost":
        ff.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        filename += `bassboost)_${title}.mp3`;
        break;
      case "echo":
        ff.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        filename += `echo)_${title}.mp3`;
        break;
      case "flanger":
        ff.withAudioFilter(["flanger"]);
        filename += `flanger)_${title}.mp3`;
        break;
      case "nightcore":
        ff.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        filename += `nightcore)_${title}.mp3`;
        break;
      case "panning":
        ff.withAudioFilter(["apulsator=hz=0.08"]);
        filename += `panning)_${title}.mp3`;
        break;
      case "phaser":
        ff.withAudioFilter(["aphaser=in_gain=0.4"]);
        filename += `phaser)_${title}.mp3`;
        break;
      case "reverse":
        ff.withAudioFilter(["areverse"]);
        filename += `reverse)_${title}.mp3`;
        break;
      case "slow":
        ff.withAudioFilter(["atempo=0.8"]);
        filename += `slow)_${title}.mp3`;
        break;
      case "speed":
        ff.withAudioFilter(["atempo=2"]);
        filename += `speed)_${title}.mp3`;
        break;
      case "subboost":
        ff.withAudioFilter(["asubboost"]);
        filename += `subboost)_${title}.mp3`;
        break;
      case "superslow":
        ff.withAudioFilter(["atempo=0.5"]);
        filename += `superslow)_${title}.mp3`;
        break;
      case "superspeed":
        ff.withAudioFilter(["atempo=3"]);
        filename += `superspeed)_${title}.mp3`;
        break;
      case "surround":
        ff.withAudioFilter(["surround"]);
        filename += `surround)_${title}.mp3`;
        break;
      case "vaporwave":
        ff.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        filename += `vaporwave)_${title}.mp3`;
        break;
      case "vibrato":
        ff.withAudioFilter(["vibrato=f=6.5"]);
        filename += `vibrato)_${title}.mp3`;
        break;
      default:
        filename += `)_${title}.mp3`;
        break;
    }
    ff.on("error", (error) => {
      throw new Error(error.message);
    });
    ff.on("start", (command) => {
      startTime = new Date();
      if (verbose) console.info(colors.green("@command:"), command);
    });
    ff.on("end", () => process.stdout.write("\n"));
    ff.on("progress", ({ percent, timemark }) => {
      let color = colors.green;
      if (isNaN(percent)) percent = 0;
      if (percent > 98) percent = 100;
      if (percent < 25) color = colors.red;
      else if (percent < 50) color = colors.yellow;
      const width = Math.floor(process.stdout.columns / 4);
      const scomp = Math.round((width * percent) / 100);
      const progb = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
      process.stdout.write(
        `\r${color("@prog:")} ${progb}` +
          ` ${color("| @percent:")} ${percent.toFixed(2)}%` +
          ` ${color("| @timemark:")} ${timemark}` +
          ` ${color("| @eta:")} ${formatTime(calculateETA(startTime, percent))}`
      );
    });
    if (stream) {
      return {
        ffmpeg: ff,
        filename: output
          ? path.join(folder, filename)
          : filename.replace("_)_", ")_"),
      };
    } else {
      await new Promise<void>((resolve, reject) => {
        ff.output(path.join(folder, filename.replace("_)_", ")_")));
        ff.on("end", () => resolve());
        ff.on("error", (error) => {
          reject(new Error(colors.red("@error: ") + error.message));
        });
        ff.run();
      });
    }
    console.log(
      colors.green("@info:"),
      "❣️ Thank you for using",
      colors.green("yt-dlx."),
      "Consider",
      colors.green("🌟starring"),
      "the GitHub repo",
      colors.green("https://github.com/yt-dlx\n")
    );
  }
}
