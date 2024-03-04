import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "highest audio_video");
    await ytdlx.audio_video.single.highest({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      output: "public/audio_video",
      verbose: false,
      stream: false,
    });
  } catch (error: any) {
    console.error(colors.red(error));
  }
})();
