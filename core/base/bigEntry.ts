import axios from "axios";
import type TubeConfig from "../interface/TubeConfig";

async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url);
    return response.status === 200;
  } catch (error) {
    console.error("ERROR:", error);
    return false;
  }
}

export default async function bigEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig | null> {
  const sortedByFileSize = [...metaBody].sort(
    (a, b) => b.meta_info.filesizebytes - a.meta_info.filesizebytes
  );
  for (const item of sortedByFileSize) {
    console.log("CHECKING:", item.meta_dl.mediaurl);
    if ((await checkUrl(item.meta_dl.mediaurl)) === true) return item;
    else return null;
  }
  return null;
}
