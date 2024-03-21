import colors from "colors";
import ytdlx from "../../base/Agent";
import type { EngineOutput } from "../../base/Engine";

export default async function list_formats({
  query,
  verbose,
  onionTor,
}: {
  query: string;
  verbose?: boolean;
  onionTor?: boolean;
}): Promise<void> {
  const metaBody: EngineOutput = await ytdlx({ query, verbose, onionTor });
  if (!metaBody) {
    throw new Error("@error: Unable to get response from YouTube.");
  } else {
    console.log("");
    printTable("AudioLow", metaBody.AudioLow);
    printTable("AudioLowDRC", metaBody.AudioLowDRC);
    printTable("AudioHigh", metaBody.AudioHigh);
    printTable("AudioHighDRC", metaBody.AudioHighDRC);
    printTable("VideoLow", metaBody.VideoLow);
    printTable("VideoLowHDR", metaBody.VideoLowHDR);
    printTable("VideoHigh", metaBody.VideoHigh);
    printTable("VideoHighHDR", metaBody.VideoHighHDR);
    printManifestTable("ManifestLow", metaBody.ManifestLow);
    printManifestTable("ManifestHigh", metaBody.ManifestHigh);
  }
}

function printTable(title: string, data: any[]) {
  console.log(colors.green(title) + ":");
  data.forEach((item) => {
    console.log(
      " ".repeat(4),
      item.filesizeP.padEnd(10),
      "|",
      item.format_note
    );
  });
  console.log("");
}

function printManifestTable(title: string, data: any[]) {
  console.log(colors.green(title) + ":");
  data.forEach((item) => {
    console.log(" ".repeat(4), item.format.padEnd(10), "|", item.tbr);
  });
  console.log("");
}
