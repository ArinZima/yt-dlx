'use strict';

var child_process = require('child_process');

// package.json
var version = "1.0.4";
child_process.exec("npm show yt-dlx version", (_error, stdout) => {
  let logger = "";
  const latestVersion = stdout.trim();
  const currentVersionNum = version.split(".").map(Number).join("");
  const latestVersionNum = latestVersion.split(".").map(Number).join("");
  if (latestVersionNum > currentVersionNum) {
    console.clear();
    logger += `\x1B[31mUsing outdated version of yt-dlx@${version}
`;
    logger += `\x1B[31mPlease update to the latest version yt-dlx@${latestVersion}\x1B[0m`;
    console.error(logger);
  }
});
