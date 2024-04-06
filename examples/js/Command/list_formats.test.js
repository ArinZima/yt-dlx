const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "List Formats");
    await YouTube.info.list_formats({
      verbose: true,
      onionTor: true,
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
