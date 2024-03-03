import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
const AQuals: ("high" | "medium" | "low" | "ultralow")[] = [
  "high",
  "medium",
  "low",
  "ultralow",
];

const VQuals: (
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
  | "12000p"
)[] = [
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
];

async.series(
  VQuals.map((VQuality) => async () => {
    try {
      holder = await ytdlx.audio_video.custom({
        output: "temp/audio_video",
        query: "inyjMXHZyw4",
        AQuality: "high",
        verbose: false,
        stream: false,
        VQuality,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      console.error(colors.red(error));
    }
  }),
  async () => {
    AQuals.map((AQuality) => async () => {
      try {
        holder = await ytdlx.audio_video.custom({
          output: "temp/audio_video",
          query: "inyjMXHZyw4",
          VQuality: "1080p",
          verbose: false,
          stream: true,
          AQuality,
        });
        if (holder) {
          await holder.ffmpeg
            .pipe(fs.createWriteStream(holder.filename))
            .on("finish", () => {
              console.log(
                colors.bold.green("\n@pass:"),
                "filename",
                holder.filename
              );
            });
        } else console.error(colors.red(holder));
      } catch (error: any) {
        console.error(colors.red(error));
      }
    });
  }
);
