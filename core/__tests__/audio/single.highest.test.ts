import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Highest audio");
    await ytdlx().AudioOnly().Single().Highest({
      stream: false,
      verbose: false,
      output: "public/audio",
      proxy: "socks5://127.0.0.1:9050",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
