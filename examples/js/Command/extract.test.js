const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "Extract");
    await YouTube.default.info.extract({
      verbose: true,
      onionTor: true,
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
