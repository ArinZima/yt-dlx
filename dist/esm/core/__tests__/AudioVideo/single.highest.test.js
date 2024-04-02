// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
import ytdlx from "../..";
import colors from "colors";
(async () => {
    try {
        await ytdlx.AudioVideo.Single.Highest({
            stream: false,
            verbose: true,
            onionTor: false,
            output: "public/mix",
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//
// =============================[ USING STREAMING TO SAVE THE FILE ]=============================
//
import * as fs from "fs";
(async () => {
    try {
        const result = await ytdlx.AudioVideo.Single.Highest({
            stream: true,
            verbose: true,
            onionTor: false,
            output: "public/mix",
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        if (result && result.filename && result.ffmpeg) {
            result.ffmpeg.pipe(fs.createWriteStream(result.filename), {
                end: true,
            });
        }
        else {
            console.error(colors.red("@error:"), "ffmpeg or filename not found!");
        }
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//
// =============================[ USING STREAMING TO PIPE THE FILE ]=============================
//
import express from "express";
(async () => {
    try {
        const server = express();
        server.get("/mix/:query", async (req, res) => {
            try {
                const queryParam = req.params.query;
                const result = await ytdlx.AudioVideo.Single.Highest({
                    stream: true,
                    verbose: true,
                    onionTor: false,
                    query: queryParam,
                });
                if (result && result.filename && result.ffmpeg) {
                    result.ffmpeg.pipe(res, { end: true });
                }
                else
                    res.status(404).send("ffmpeg or filename not found!");
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
        server.listen(3000, () => {
            console.log(colors.blue("@server:"), "running on port 3000");
        });
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//
// ========================================================================================
//# sourceMappingURL=single.highest.test.js.map