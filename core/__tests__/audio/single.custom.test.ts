import ytdlx from "../..";
import colors from "colors";

const quals = ["high", "medium", "low", "ultralow"] as const;

(async () => {
  for (const q of quals) {
    try {
      console.log(colors.blue("@test:"), "Custom audio", q);
      await ytdlx().AudioOnly().Single().Custom({
        quality: q,
        stream: false,
        verbose: false,
        output: "public/audio",
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      });
    } catch (error: any) {
      console.error(colors.red(error.message));
    }
  }
})();
