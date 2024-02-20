console.clear();
import ytCore from "..";
import scrape from "./base/scrape";

let metaTube;
(async () => {
  try {
    metaTube = await scrape("SuaeRys5tTc");
    const stdoutAny = metaTube.stdout as any;
    if (stdoutAny && typeof stdoutAny === "object" && stdoutAny !== null) {
      console.log(stdoutAny.Link);
    } else console.log("stdout is not a valid object.");
    metaTube = await ytCore.audio_video.single.highest({
      query: "SuaeRys5tTc",
      outputFormat: "mp4",
      folderName: "temp",
      stream: false,
    });
    console.log(metaTube);
  } catch (error) {
    console.error(error);
  }
})();
