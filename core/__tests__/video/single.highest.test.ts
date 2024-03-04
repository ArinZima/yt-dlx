import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "highest video");
    await ytdlx.video.single.highest({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      output: "public/video",
      verbose: false,
      stream: false,
    });
    console.log(colors.green("@pass:"), true);
  } catch (error: any) {
    console.error(colors.red(error));
  }
})();
