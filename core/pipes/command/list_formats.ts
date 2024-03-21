import colors from "colors";
import ytdlx from "../../base/Agent";
import type { EngineOutput } from "../../base/Engine";

function pTable(title: string, data: any[]) {
  console.log(colors.green(title));
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
function pManifestTable(title: string, data: any[]) {
  console.log(colors.green(title));
  data.forEach((item) => {
    console.log(" ".repeat(4), item.format.padEnd(10), "|", item.tbr);
  });
  console.log("");
}

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
    pTable("@AudioLow:", metaBody.AudioLow);
    pTable("@AudioLowDRC:", metaBody.AudioLowDRC);
    pTable("@AudioHigh:", metaBody.AudioHigh);
    pTable("@AudioHighDRC:", metaBody.AudioHighDRC);
    pTable("@VideoLow:", metaBody.VideoLow);
    pTable("@VideoLowHDR:", metaBody.VideoLowHDR);
    pTable("@VideoHigh:", metaBody.VideoHigh);
    pTable("@VideoHighHDR:", metaBody.VideoHighHDR);
    pManifestTable("@ManifestLow:", metaBody.ManifestLow);
    pManifestTable("@ManifestHigh:", metaBody.ManifestHigh);
  }
}
