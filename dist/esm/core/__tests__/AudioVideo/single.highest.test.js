import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
(async () => {
    try {
        console.log(colors.blue("@test:"), "Download Highest audio");
        await ytdlx.AudioVideo.Single.Highest({
            stream: false,
            verbose: true,
            onionTor: false,
            output: "public/audio",
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        console.log(colors.blue("@test:"), "(stream) Download Highest audio");
        const result = await ytdlx.AudioVideo.Single.Highest({
            stream: true,
            verbose: true,
            onionTor: false,
            output: "public/audio",
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        if (result && result.filename && result.ffmpeg) {
            result.ffmpeg.pipe(fs.createWriteStream(result.filename));
        }
        else {
            console.error(colors.red("@error:"), "ffmpeg or filename not found!");
        }
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//# sourceMappingURL=single.highest.test.js.map