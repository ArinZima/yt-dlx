import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import * as async from "async";
import AudioVideoLowest from "../pipes/mix/AudioVideoLowest";
import AudioVideoHighest from "../pipes/mix/AudioVideoHighest";

async.series(
  {
    first: async () => {
      try {
        let metaTube: any = await AudioVideoLowest({
          query: "PRATEEK KUHAD - MULAQAT (OFFICIAL MUSIC VIDEO)",
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
        let metaTube: any = await AudioVideoHighest({
          query: "pRLOXUlIUG0",
          folderName: ".temp",
          verbose: false,
          stream: true,
        });
        console.log(colors.green("@info:"), metaTube.filename);
        return metaTube;
      } catch (error: any) {
        throw new Error(colors.red("@error:"), error.message);
      }
    },
    getAndsave: async ({ second }: any) => {
      try {
        const outputPath = path.join(second.filename);
        const writeStream = fs.createWriteStream(outputPath);
        second.stream.on("end", () => {
          console.log(colors.green("@info:"), "download completed");
        });
        second.stream.on("error", (error: any) => {
          console.error(colors.red("@error:"), error.message);
        });
        second.stream.pipe(writeStream);
      } catch (error: any) {
        throw new Error(colors.red("@error:"), error.message);
      }
    },
  },
  (error) => {
    if (error) console.error(colors.red("@error:"), error.message);
  }
);
