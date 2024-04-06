// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "help");
    await YouTube.default.info.help();
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
