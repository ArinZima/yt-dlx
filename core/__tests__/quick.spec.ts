console.clear();
import ytdlx from "..";
import * as fs from "fs";

(async () => {
  const core = await ytdlx.audio.lowest({
    folderName: ".temp/audio",
    query: "sQEgklEwhSo",
    outputFormat: "mp3",
    stream: true,
  });
  if (!core) return;
  await core.stream
    .pipe(fs.createWriteStream(core.fileName))
    .on("finish", () => {
      console.log("finished successfully...");
    });
})();
