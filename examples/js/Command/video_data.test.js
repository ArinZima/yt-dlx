const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch video single");
    const result = await YouTube.ytSearch.Video.Single({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    console.log(result);
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
