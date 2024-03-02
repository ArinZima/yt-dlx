import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
async.series([
  async () => {
    try {
      holder = await ytdlx.video.highest({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        verbose: true,
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.video.highest({
        query: "sQEgklEwhSo",
        folderName: ".temp/video",
        filter: "grayscale",
        verbose: true,
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.video.highest({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        verbose: true,
        stream: true,
      });
      if (holder) {
        await holder.stream
          .pipe(fs.createWriteStream(holder.filename))
          .on("finish", () => {
            console.log(
              colors.bold.green("@pass:"),
              "filename",
              holder.filename
            );
          });
      } else throw new Error(colors.bold.red("@error:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.video.highest({
        query: "sQEgklEwhSo",
        folderName: ".temp/video",
        filter: "invert",
        verbose: true,
        stream: true,
      });
      if (holder) {
        await holder.stream
          .pipe(fs.createWriteStream(holder.filename))
          .on("finish", () => {
            console.log(
              colors.bold.green("@pass:"),
              "filename",
              holder.filename
            );
          });
      } else throw new Error(colors.bold.red("@error:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
