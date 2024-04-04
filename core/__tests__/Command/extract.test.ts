import colors from "colors";
import * as fs from "fs";

import ytdlx from "../..";

(async () => {
	try {
		console.log(colors.blue("@test:"), "Extract");
		await ytdlx.info.extract({
			verbose: true,
			onionTor: true,
			query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
		});
	} catch (error: any) {
		console.error(colors.red(error.message));
	}
})();
