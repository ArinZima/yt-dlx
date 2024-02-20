import { version } from "../../package.json";
import { exec } from "child_process";

exec("npm show yt-core version", (_error, stdout) => {
  let logger = "";
  const latestVersion = stdout.trim();
  const currentVersionNum = version.split(".").map(Number).join("");
  const latestVersionNum = latestVersion.split(".").map(Number).join("");
  if (latestVersionNum > currentVersionNum) {
    console.clear();
    logger += `\x1b[31mUsing outdated version of yt-core@${version}\n`;
    logger += `\x1b[31mPlease update to the latest version yt-core@${latestVersion}\x1b[0m`;
    console.error(logger);
  }
});
