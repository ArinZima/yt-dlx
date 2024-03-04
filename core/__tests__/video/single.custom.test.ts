import ytdlx from "../..";
import colors from "colors";

const quals = [
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
] as const;

(async () => {
  try {
    for (const q of quals) {
      try {
        await ytdlx.video.single.custom({
          quality: q,
          stream: false,
          verbose: true,
          output: "public/video",
          query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        console.log(colors.bold.green("@pass:"), true);
      } catch (error: any) {
        console.error(colors.red(error));
      }
    }
  } catch (error: any) {
    console.error(colors.red(error));
  }
})();
