import colors from "colors";

import { version } from "../../package.json";
import web from "../web";
import YouTubeID from "../web/YouTubeId";
import Engine from "./Engine";
import type { EngineOutput } from "./Engine";
import niptor from "./niptor";

export default async function Agent({
  query,
  verbose,
  onionTor,
}: {
  query: string;
  verbose?: boolean;
  onionTor?: boolean;
}): Promise<EngineOutput> {
  console.log(
    colors.green("@info:"),
    "using",
    colors.green("yt-dlx"),
    "version",
    colors.green(version)
  );
  let ipAddress: any;
  let nipTor: { stdout: any; stderr?: string };
  nipTor = await niptor(["curl https://checkip.amazonaws.com --insecure"]);
  console.log(colors.green("@info:"), "verbose", colors.green(`${verbose}`));
  console.log(
    colors.green("@info:"),
    "system",
    colors.green("ipAddress"),
    nipTor.stdout.trim()
  );
  ipAddress = nipTor.stdout.trim();
  if (onionTor) {
    nipTor = await niptor([
      "systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure",
    ]);
    if (nipTor.stdout.trim().length > 0) {
      console.log(
        colors.green("@info:"),
        "socks5",
        colors.green("ipAddress"),
        nipTor.stdout.trim()
      );
      ipAddress = nipTor.stdout.trim();
    } else throw new Error("Unable to connect to Tor.");
  }
  let TubeBody: any;
  let respEngine: EngineOutput | undefined = undefined;
  let videoId: string | undefined = await YouTubeID(query);
  if (!videoId) {
    TubeBody = await web.browserLess.searchVideos({ query });
    if (!TubeBody[0]) throw new Error("Unable to get response!");
    console.log(
      colors.green("@info:"),
      `preparing payload for`,
      colors.green(TubeBody[0].title)
    );
    respEngine = await Engine({
      onionTor,
      ipAddress,
      query: `https://www.youtube.com/watch?v=${TubeBody[0].id}`,
    });
    return respEngine;
  } else {
    TubeBody = await web.browserLess.singleVideo({ videoId });
    if (!TubeBody) throw new Error("Unable to get response!");
    console.log(
      colors.green("@info:"),
      `preparing payload for`,
      colors.green(TubeBody.title)
    );
    respEngine = await Engine({
      onionTor,
      ipAddress,
      query: `https://www.youtube.com/watch?v=${TubeBody.id}`,
    });
    return respEngine;
  }
}
