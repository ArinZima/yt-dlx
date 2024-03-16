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
  for (const q of quals) {
    try {
      console.log(colors.blue("@test:"), "Custom video", q);
      await ytdlx().VideoOnly().Single().Custom({
        quality: q,
        stream: false,
        verbose: false,
        autoSocks5: true,
        output: "public/video",
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      });
    } catch (error: any) {
      console.error(colors.red(error.message));
    }
  }
})();
