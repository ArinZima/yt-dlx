import ytdlx from "../..";
import colors from "colors";
(async () => {
    try {
        console.log(colors.blue("@test:"), "ytSearch video multiple");
        const result = await ytdlx.ytSearch.video.multiple({
            query: "8k dolby nature",
        });
        console.log(result);
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
