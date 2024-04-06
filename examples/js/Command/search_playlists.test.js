const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch playlist multiple");
    const result = await YouTube.ytSearch.Playlist.Multiple({
      query: "8k dolby nature",
    });
    console.log(result);
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
