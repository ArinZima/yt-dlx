import axios from "axios";
import colors from "colors";
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
  switch (true) {
    case !metaBody || metaBody.length === 0:
      console.log(colors.bold.red("ERROR:"), "❗ no download data found.");
      return null;
    default:
      const sortedByFileSize = [...metaBody].sort(
        (a, b) => a.meta_info.filesizebytes - b.meta_info.filesizebytes
      );
      for (const item of sortedByFileSize) {
        const { mediaurl } = item.meta_dl;
        if (mediaurl && (await checkUrl(mediaurl))) return item;
      }
      console.log(colors.bold.red("ERROR:"), "❗ no download data found.");
      return null;
  }
}
