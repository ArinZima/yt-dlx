// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
import colors from "colors";
import YouTube from "../../";
(async () => {
    try {
        await YouTube.AudioOnly.Single.Highest({
            stream: false,
            verbose: true,
            onionTor: false,
            output: "public/audio",
            query: "video-NAME/ID/URL",
        });
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//
// =============================[ CORE TESTER ]=============================
//# sourceMappingURL=single.highest.test.js.map