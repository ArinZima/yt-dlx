import colors from "colors";
import type TubeConfig from "../interface/TubeConfig";

export default async function bigEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig | undefined> {
  if (!metaBody || metaBody.length === 0) {
    console.log(colors.red("@error:"), "sorry no downloadable data found");
    return undefined;
  }
  const sortedByFileSize = [...metaBody].sort(
    (a, b) => b.meta_info.filesizebytes - a.meta_info.filesizebytes
  );
  return sortedByFileSize[0];
}
