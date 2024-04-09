// =============================[ CORE TESTER ]=============================
//
import colors from "colors";
import YouTube from "../../";
(async () => {
  try {
    const resolutions = [
      "144p",
      "240p",
      "360p",
      "480p",
      "720p",
      "1080p",
      "1440p",
      "2160p",
      "3072p",
      "4320p",
      "6480p",
      "8640p",
      "12000p",
    ] as const;
    for (const resolution of resolutions) {
      const proc = await YouTube.AudioVideo.Single.Custom({
        resolution,
        stream: false,
        verbose: true,
        onionTor: false,
        output: "public/mix",
        query: "21 savage - redrum",
      });
      proc.on("end", () => console.log("@finished."));
      proc.on("start", (comd) => console.log("@command:", comd));
      proc.on("error", (error) => console.error("@rror:", error));
      proc.on("progress", (progress) => console.log("@progress:", progress));
    }
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
//
// =============================[ CORE TESTER ]=============================
