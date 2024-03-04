import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "lowest audio_video");
    await ytdlx.audio_video.single.lowest({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      output: "public/audio_video",
      verbose: false,
      stream: false,
    });
    console.log(colors.green("@pass:"), true);
  } catch (error: any) {
    console.error(colors.red(error));
  }
})();
