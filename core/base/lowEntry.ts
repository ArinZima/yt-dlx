import colors from "colors";
import type TubeConfig from "../interface/TubeConfig";

async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export default async function lowEntry(
  metaBody: TubeConfig[]
): Promise<TubeConfig | undefined> {
  switch (true) {
    case !metaBody || metaBody.length === 0:
      console.log(colors.red("@error:"), "sorry no downloadable data found");
      return undefined;
    default:
      const sortedByFileSize = [...metaBody].sort(
        (a, b) => a.meta_info.filesizebytes - b.meta_info.filesizebytes
      );
      for (const item of sortedByFileSize) {
        const { mediaurl } = item.meta_dl;
        if (mediaurl && (await checkUrl(mediaurl))) return item;
      }
      console.log(colors.red("@error:"), "sorry no downloadable data found");
      return undefined;
  }
}
