const ytdlx = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.info(colors.yellow("@info"), "running index.cjs");
    var result = await ytdlx.info.extract({
      query: "smoke weed ' just relax",
    });
    console.info(colors.yellow("@info"), result);
  } catch (error) {
    console.error(colors.yellow("@error"), error);
  }
})();
