import YouTube from "../../";
import colors from "colors";
(async () => {
    try {
        console.log(colors.blue("@test:"), "Extract");
        await YouTube.info.extract({
            verbose: true,
            onionTor: true,
            query: "video-NAME/ID/URL",
        });
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//# sourceMappingURL=extract.test.js.map