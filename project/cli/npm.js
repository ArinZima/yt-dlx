'use strict';

var child_process = require('child_process');

// package.json
var version = "4.4.0";
child_process.exec("npm show yt-core version", (_error, stdout) => {
  let logger = "";
  const latestVersion = stdout.trim();
  const currentVersionNum = version.split(".").map(Number).join("");
  const latestVersionNum = latestVersion.split(".").map(Number).join("");
  if (latestVersionNum > currentVersionNum) {
    console.clear();
    logger += `\x1B[31mUsing outdated version of yt-core@${version}
`;
    logger += `\x1B[31mPlease update to the latest version yt-core@${latestVersion}\x1B[0m`;
    console.error(logger);
  }
});
