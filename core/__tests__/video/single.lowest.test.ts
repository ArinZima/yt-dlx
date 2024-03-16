import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Lowest video");
    await ytdlx().VideoOnly().Single().Lowest({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      output: "public/video",
      autoSocks5: true,
      verbose: false,
      stream: false,
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
