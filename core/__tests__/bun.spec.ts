console.clear();
import path from "path";
import fs from "fs-extra";
import colors from "colors";
import * as bun from "bun:test";
import AudioVideoHighest from "../pipes/mix/AudioVideoHighest";

bun.test(colors.blue("\n\n@tesing: ") + "Quick-Tests()", async () => {
  try {
    const metaTube: any = await AudioVideoHighest({
      query: "sQEgklEwhSo",
      folderName: ".temp",
      verbose: false,
      stream: true,
    });
    const outputPath = path.join(metaTube.filename);
    const writeStream = fs.createWriteStream(outputPath);
    await metaTube.stream.pipe(writeStream);
    metaTube.stream.on("end", () => {
      console.log(colors.green("@info:"), "Download completed");
    });
    metaTube.stream.on("error", (error: any) => {
      console.error(colors.red("@error:"), error.message);
    });
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
});
