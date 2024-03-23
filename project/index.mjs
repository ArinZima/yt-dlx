import ytdlx from "yt-dlx";
import colors from "colors";

(async () => {
  try {
    console.info(colors.green("@info"), "running index.mjs");
    var result = await ytdlx.info.extract({
      query: "smoke weed ' just relax",
    });
    console.info(colors.green("@info"), result);
  } catch (error) {
    console.error(colors.yellow("@error"), error);
  }
})();
