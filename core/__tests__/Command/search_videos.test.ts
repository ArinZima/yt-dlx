import colors from "colors";
import * as fs from "fs";

import ytdlx from "../..";

(async () => {
	try {
		console.log(colors.blue("@test:"), "ytSearch video multiple");
		const result = await ytdlx.ytSearch.video.multiple({
			query: "8k dolby nature",
		});
		console.log(result);
	} catch (error: any) {
		console.error(colors.red(error.message));
	}
})();
