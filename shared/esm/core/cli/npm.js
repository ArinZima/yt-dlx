import { version } from "../../package.json";
import { exec } from "child_process";
exec("npm show yt-dlx version", function (_error, stdout) {
    var logger = "";
    var latestVersion = stdout.trim();
    var currentVersionNum = version.split(".").map(Number).join("");
    var latestVersionNum = latestVersion.split(".").map(Number).join("");
    if (latestVersionNum > currentVersionNum) {
        console.clear();
        logger += "\u001B[31mUsing outdated version of yt-dlx@".concat(version, "\n");
        logger += "\u001B[31mPlease update to the latest version yt-dlx@".concat(latestVersion, "\u001B[0m");
        console.error(logger);
    }
});
