import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Lowest audio");
    await ytdlx().AudioOnly().Single().Lowest({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      output: "public/audio",
      verbose: false,
      stream: false,
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
