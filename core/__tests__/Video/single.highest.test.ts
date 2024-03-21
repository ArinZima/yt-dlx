import ytdlx from "../../main";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Highest video");
    await ytdlx.VideoOnly.Single.Highest({
      stream: false,
      verbose: true,
      onionTor: true,
      output: "public/video",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
