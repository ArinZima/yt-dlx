import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    await ytdlx().audio_video().single().lowest({
      query: "https://www.youtube.com/watch?v=EUshgvt7I8U",
      output: "temp/audio_video",
      verbose: false,
      stream: false,
    });
    console.log(colors.bold.green("@pass:"), true);
  } catch (error: any) {
    console.error(colors.red(error));
  }
})();
