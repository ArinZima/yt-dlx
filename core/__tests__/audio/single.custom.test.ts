import ytdlx from "../..";
import colors from "colors";

const quals: ("high" | "medium" | "low" | "ultralow")[] = [
  "high",
  "medium",
  "low",
  "ultralow",
];

quals.map((quality) => async () => {
  try {
    await ytdlx.audio.custom({
      query: "https://www.youtube.com/watch?v=7PIji8OubXU",
      output: "temp/audio",
      verbose: false,
      stream: false,
      quality,
    });
    console.log(colors.bold.green("@pass:"), true);
  } catch (error: any) {
    console.error(colors.red(error));
  }
});
