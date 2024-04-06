// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
import colors from "colors";
import YouTube from "../../";
(async () => {
    try {
        await YouTube.AudioVideo.Single.Lowest({
            stream: false,
            verbose: true,
            onionTor: false,
            output: "public/mix",
            query: "video-NAME/ID/URL",
        });
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//
// =============================[ CORE TESTER ]=============================
//# sourceMappingURL=single.lowest.test.js.map