import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
(async () => {
    try {
        const resolutions = [
            "144p",
            "240p",
            "360p",
            "480p",
            "720p",
            "1080p",
            "1440p",
            "2160p",
            "3072p",
            "4320p",
            "6480p",
            "8640p",
            "12000p",
        ];
        for (const resolution of resolutions) {
            console.log(colors.blue("@test:"), "Download Custom audio");
            await ytdlx.AudioVideo.Single.Custom({
                resolution,
                stream: false,
                verbose: true,
                onionTor: false,
                output: "public/audio",
                query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
            });
            console.log(colors.blue("@test:"), "(stream) Download Custom audio");
            const result = await ytdlx.AudioVideo.Single.Custom({
                resolution,
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
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
