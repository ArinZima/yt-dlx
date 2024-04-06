// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "Extract");
    await YouTube.default.info.extract({
      verbose: true,
      onionTor: true,
      query: "video-NAME/ID/URL",
    });
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
