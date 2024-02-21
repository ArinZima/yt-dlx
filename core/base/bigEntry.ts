import colors from "colors";
import type TubeConfig from "../interface/TubeConfig";

export default async function bigEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig | null> {
  switch (true) {
    case !metaBody || metaBody.length === 0:
      console.log(
        colors.bold.red("ERROR:"),
        "❗sorry no downloadable data found"
      );
      return null;
    default:
      const sortedByFileSize = [...metaBody].sort(
        (a, b) => b.meta_info.filesizebytes - a.meta_info.filesizebytes
      );
      for (const item of sortedByFileSize) {
        const { mediaurl } = item.meta_dl;
        if (mediaurl) return item;
      }
      return null;
  }
}
