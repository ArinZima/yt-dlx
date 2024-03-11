console.clear();
import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    await ytdlx().AudioOnly().Single().Highest({
      stream: false,
      verbose: true,
      autoSocks5: false,
      output: "public/audio",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
