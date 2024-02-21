import axios from "axios";
import type TubeConfig from "../interface/TubeConfig";

async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export default async function bigEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig | null> {
  if (!metaBody || metaBody.length === 0) return null;
  const sortedByFileSize = [...metaBody].sort(
    (a, b) => b.meta_info.filesizebytes - a.meta_info.filesizebytes
  );
  for (const item of sortedByFileSize) {
    const { mediaurl } = item.meta_dl;
    if (mediaurl && (await checkUrl(mediaurl))) return item;
  }
  return null;
}
