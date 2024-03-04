import ytdlx from "../..";
import colors from "colors";

const quals = ["high", "medium", "low", "ultralow"] as const;

(async () => {
  try {
    for (const q of quals) {
      try {
        console.log(colors.blue("@test:"), "custom audio", q);
        await ytdlx.audio.single.custom({
          quality: q,
          stream: false,
          verbose: false,
          output: "public/audio",
          query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        console.log(colors.green("@pass:"), true);
      } catch (error: any) {
        console.error(colors.red(error));
      }
    }
  } catch (error: any) {
    console.error(colors.red(error));
  }
})();
