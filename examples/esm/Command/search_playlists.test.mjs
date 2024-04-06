import ytdlx from "yt-dlx";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch playlist multiple");
    const result = await ytdlx.ytSearch.Playlist.Multiple({
      query: "8k dolby nature",
    });
    console.log(result);
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
