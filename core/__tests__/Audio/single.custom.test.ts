// =============================[ CORE TESTER ]=============================
//
import colors from "colors";
import YouTube from "../../";
(async () => {
  try {
    const resolutions = ["high", "medium", "low", "ultralow"] as const;
    for (const resolution of resolutions) {
      const proc = await YouTube.AudioOnly.Single.Custom({
        resolution,
        stream: false,
        verbose: true,
        onionTor: false,
        output: "public/audio",
        query: "21 savage - redrum",
      });
      proc.on("end", () => console.log("\n@finished."));
      proc.on("start", (comd) => console.log("\n@command:", comd));
      proc.on("error", (error) => console.error("\n@error:", error));
      proc.on("progress", (progress) => {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write("@progress: " + progress);
      });
    }
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
//
// =============================[ CORE TESTER ]=============================
