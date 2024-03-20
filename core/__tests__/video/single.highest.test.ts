import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Highest video");
    await ytdlx.VideoOnly.Single.Highest({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      output: "public/video",
      onionTor: true,
      verbose: false,
      stream: false,
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
