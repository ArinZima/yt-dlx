import * as fs from "fs";
import colors from "colors";
import { ytdlx } from "../..";

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch video single");
    const result = await ytdlx.ytSearch.video.single({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    console.log(result);
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
