console.clear();
import ytDlx from "..";

(async () => {
  await ytDlx.video.single.highest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    verbose: false,
    output: "temp",
  });
})();
