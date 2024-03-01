console.clear();
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import * as async from "async";
import AudioVideoLowest from "../pipes/mix/AudioVideoLowest";

async.series(
  {
    first: async () => {
      try {
        let metaTube: any = await AudioVideoLowest({
          query: "sQEgklEwhSo",
          folderName: ".temp",
          verbose: false,
          stream: false,
        });
        console.log(colors.green("@info:"), metaTube);
        return metaTube;
      } catch (error: any) {
        throw new Error(colors.red("@error:"), error.message);
      }
    },
    second: async () => {
      try {
        let metaTube: any = await AudioVideoLowest({
          query: "sQEgklEwhSo",
          folderName: ".temp",
          verbose: false,
          stream: true,
        });
        const outputPath = path.join(metaTube.filename);
        const writeStream = fs.createWriteStream(outputPath);
        console.log(colors.green("@info:"), metaTube.filename);
        metaTube.stream.on("end", () => {
          console.log(colors.green("@info:"), "download completed");
        });
        metaTube.stream.on("error", (error: any) => {
          console.error(colors.red("@error:"), error.message);
        });
        metaTube.stream.pipe(writeStream);
      } catch (error: any) {
        throw new Error(colors.red("@error:"), error.message);
      }
    },
  },
  (error) => {
    if (error) console.error(colors.red("@error:"), error.message);
  }
);
