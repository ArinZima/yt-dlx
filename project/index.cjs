const ytdlx = require("yt-dlx");
const colors = require("colors");

console.info(colors.yellow("@info"), "running index.cjs");
console.info(colors.yellow("@info"), ytdlx.default);

(async () => {
  try {
    console.info(colors.yellow("@info"), "running index.cjs");
    var result = await ytdlx.default.info.extract({
      query: "smoke weed ' just relax",
    });
    console.info(colors.yellow("@info"), result);
  } catch (error) {
    console.error(colors.yellow("@error"), error);
  }
})();
