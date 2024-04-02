import colors from "colors";
import * as fs from "fs";

import ytdlx from "../..";

(async () => {
	try {
		console.log(colors.blue("@test:"), "ytSearch playlist single");
		const result = await ytdlx.ytSearch.playlist.single({
			query: "https://youtube.com/playlist?list=PL06diOotXAJLAAHBY7kIUm5GQwm2ZinOz&si=raalOwdBLBtmJ9s5",
		});
		console.log(result);
	} catch (error: any) {
		console.error(colors.red(error.message));
	}
})();
