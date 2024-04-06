const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch video multiple");
    const result = await YouTube.default.ytSearch.Video.Multiple({
      query: "8k dolby nature",
    });
    console.log(result);
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
