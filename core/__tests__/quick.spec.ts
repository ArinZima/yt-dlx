console.clear();
import * as fs from "fs";
import colors from "colors";
import * as async from "async";
import AudioHighest from "../pipes/audio/AudioHighest";

async.series([
  async () => {
    try {
      const { ffmpeg, filename } = await AudioHighest({
        query: "sQEgklEwhSo",
        folderName: "audio",
        verbose: false,
        stream: true,
      });
      ffmpeg.pipe(fs.createWriteStream(filename), {
        end: true,
      });
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
