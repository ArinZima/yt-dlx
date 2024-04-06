// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch video single");
    const result = await YouTube.default.ytSearch.Video.Single({
      query: "video-NAME/ID/URL",
    });
    console.log(result);
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
