console.clear();
import * as fs from "fs";
import colors from "colors";
import * as async from "async";
import AudioVideoLowest from "../pipes/mix/AudioVideoLowest";

async.series([
  async () => {
    try {
      await AudioVideoLowest({
        query: "sQEgklEwhSo",
        folderName: ".temp",
        verbose: false,
        stream: false,
      });
      console.log(colors.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  async () => {
    try {
      let holder: any = await AudioVideoLowest({
        query: "sQEgklEwhSo",
        folderName: ".temp",
        verbose: false,
        stream: true,
      });
      const writeStream = fs.createWriteStream(holder.filename);
      writeStream.on("open", () => {
        console.log(colors.bold.green("@info:"), "writestream opened.");
      });
      writeStream.on("error", (err) => {
        console.error(colors.bold.red("@error:"), "writestream", err.message);
      });
      writeStream.on("finish", () => {
        console.log(colors.bold.green("@pass:"), "filename", holder.filename);
      });
      holder.stream.pipe(writeStream);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
