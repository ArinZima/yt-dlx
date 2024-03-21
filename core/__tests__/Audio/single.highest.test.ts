import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Highest audio");
    await ytdlx.AudioOnly.Single.Highest({
      stream: false,
      verbose: true,
      onionTor: true,
      output: "public/audio",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
