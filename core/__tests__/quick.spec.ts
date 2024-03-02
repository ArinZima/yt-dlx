console.clear();
import ytdlx from "..";
import colors from "colors";

(async () => {
  try {
    await ytdlx.audio.highest({
      folderName: ".temp/audio",
      query: "sQEgklEwhSo",
      verbose: false,
      stream: false,
    });
    console.log(colors.bold.green("@pass:"), true);
  } catch (error: any) {
    throw new Error(colors.bold.red("@error:"), error);
  }
})();
