import colors from "colors";
import ytdlx from "../..";
(async () => {
    try {
        console.log(colors.blue("@test:"), "Extract");
        await ytdlx.info.extract({
            verbose: true,
            onionTor: true,
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
})();
//# sourceMappingURL=extract.test.js.map