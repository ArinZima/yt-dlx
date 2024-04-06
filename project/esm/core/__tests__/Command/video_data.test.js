import YouTube from "../../";
import colors from "colors";
(async () => {
    try {
        console.log(colors.blue("@test:"), "ytSearch video single");
        const result = await YouTube.ytSearch.Video.Single({
            query: "video-NAME/ID/URL",
        });
        console.log(result);
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//# sourceMappingURL=video_data.test.js.map