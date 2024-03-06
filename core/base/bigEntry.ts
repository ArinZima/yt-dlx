import type TubeConfig from "../interface/TubeConfig";
import runFunc from "./runFunc";

export default async function bigEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig> {
  const response = await runFunc(async () => {
    const validEntries = metaBody.filter(
      (entry) =>
        entry.AVInfo.filesizebytes !== null &&
        entry.AVInfo.filesizebytes !== undefined &&
        !isNaN(entry.AVInfo.filesizebytes)
    );
    const sortedByFileSize = [...validEntries].sort(
      (a, b) => b.AVInfo.filesizebytes - a.AVInfo.filesizebytes
    );
    if (!sortedByFileSize[0]) {
      throw new Error("sorry no downloadable data found");
    } else return sortedByFileSize[0]!;
  });
  return response;
}
