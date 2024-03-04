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
    await ytdlx.audio.single.custom({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
      output: "public/audio",
      verbose: false,
      stream: false,
      quality,
    });
    console.log(colors.bold.green("@pass:"), true);
  } catch (error: any) {
    console.error(colors.red(error));
  }
});
