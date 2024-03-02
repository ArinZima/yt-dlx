import colors from "colors";
import type TubeConfig from "../interface/TubeConfig";

export default async function bigEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig | undefined> {
  if (!metaBody || metaBody.length === 0) {
    console.log(colors.red("@error:"), "sorry no downloadable data found");
    return undefined;
  }
  if (metaBody.length === 1) return metaBody[0];
  const validEntries = metaBody.filter(
    (entry) =>
      entry.AVInfo.filesizebytes !== null &&
      entry.AVInfo.filesizebytes !== undefined &&
      !isNaN(entry.AVInfo.filesizebytes)
  );
  if (validEntries.length === 0) {
    console.log(colors.red("@error:"), "sorry no downloadable data found");
    return undefined;
  }
  const sortedByFileSize = [...validEntries].sort(
    (a, b) => b.AVInfo.filesizebytes - a.AVInfo.filesizebytes
  );
  return sortedByFileSize[0];
}
