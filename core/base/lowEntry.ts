import type TubeConfig from "../interface/TubeConfig";

export default async function lowEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig> {
  const validEntries = metaBody.filter(
    (entry) =>
      entry.AVInfo.filesizebytes !== null &&
      entry.AVInfo.filesizebytes !== undefined &&
      !isNaN(entry.AVInfo.filesizebytes)
  );
  const sortedByFileSize = [...validEntries].sort(
    (a, b) => a.AVInfo.filesizebytes - b.AVInfo.filesizebytes
  );
  if (!sortedByFileSize[0]) throw new Error("sorry no downloadable data found");
  else return sortedByFileSize[0]!;
}
