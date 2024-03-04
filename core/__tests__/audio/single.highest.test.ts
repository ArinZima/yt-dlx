import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    await ytdlx().audio().single().highest({
      query: "https://www.youtube.com/watch?v=7PIji8OubXU",
      output: "public/audio",
      verbose: false,
      stream: false,
    });
    console.log(colors.bold.green("@pass:"), true);
  } catch (error: any) {
    console.error(colors.red(error));
  }
})();
