import ytdlx from "../..";
import colors from "colors";

const AQuals: (
  | "high"
  | "medium"
  | "low"
  | "ultralow"
  | "high"
  | "high"
  | "high"
  | "high"
  | "high"
  | "high"
  | "high"
  | "high"
  | "high"
)[] = [
  "high",
  "medium",
  "low",
  "ultralow",
  "high",
  "high",
  "high",
  "high",
  "high",
  "high",
  "high",
  "high",
  "high",
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

VQuals.map((VQuality) => async () => {
  AQuals.map((AQuality) => async () => {
    try {
      await ytdlx().audio_video().single().custom({
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        output: "public/audio_video",
        verbose: false,
        stream: false,
        AQuality,
        VQuality,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      console.error(colors.red(error));
    }
  });
});
