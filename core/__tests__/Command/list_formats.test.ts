import colors from "colors";
import * as fs from "fs";

import ytdlx from "../..";

(async () => {
	try {
		console.log(colors.blue("@test:"), "List Formats");
		await ytdlx.info.list_formats({
			verbose: true,
			onionTor: true,
			query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
		});
	} catch (error: any) {
		console.error(colors.red(error.message));
	}
})();
