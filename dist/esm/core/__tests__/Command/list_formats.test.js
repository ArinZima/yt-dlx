import ytdlx from "../..";
import colors from "colors";
(async () => {
    try {
        console.log(colors.blue("@test:"), "List Formats");
        await ytdlx.info.list_formats({
            verbose: true,
            onionTor: true,
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//# sourceMappingURL=list_formats.test.js.map