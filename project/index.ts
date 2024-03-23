import ytdlx from "yt-dlx";
import colors from "colors";

(async () => {
  try {
    console.info(colors.blue("@info"), "running index.ts");
    var result = await ytdlx.info.extract({
      query: "smoke weed ' just relax",
    });
    console.info(colors.blue("@info"), result);
  } catch (error) {
    console.error(colors.yellow("@error"), error);
  }
})();
