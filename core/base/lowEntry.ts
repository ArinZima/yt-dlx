import axios from "axios";
import colors from "colors";
import type TubeConfig from "../interface/TubeConfig";

async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url);
    console.log("CHECKING:", url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export default async function bigEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig | null> {
  const sortedByFileSize = [...metaBody].sort(
    (a, b) => a.meta_info.filesizebytes - b.meta_info.filesizebytes
  );
  for (const item of sortedByFileSize) {
    const { mediaurl } = item.meta_dl;
    if (mediaurl && (await checkUrl(mediaurl))) return item;
  }
  console.log(colors.bold.red("ERROR:"), "❗sorry no downloadable data found");
  return null;
}
