import ytdlx from "../../main";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Lowest video");
    await ytdlx.AudioVideo.Single.Lowest({
      stream: false,
      verbose: true,
      onionTor: true,
      output: "public/mix",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
