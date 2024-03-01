import * as z from "zod";
import colors from "colors";
import ytdlx from "../../base/Agent";

export default function list_formats({
  query,
}: {
  query: string;
}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const zval = z
        .object({
          query: z.string().min(1),
        })
        .parse({ query });
      const EnResp = await ytdlx(zval);
      if (!EnResp) return reject("Unable to get response from YouTube...");
      const metaTube = (data: any[]) =>
        data.filter(
          (out) => !out.AVDownload.originalformat.includes("Premium")
        );
      const EnBody = {
        AudioFormatsData: metaTube(EnResp.AudioStore).map((out) => [
          out.AVDownload.originalformat,
          out.AVInfo.filesizebytes,
          out.AVInfo.filesizeformatted,
        ]),
        VideoFormatsData: metaTube(EnResp.VideoStore).map((out) => [
          out.AVDownload.originalformat,
          out.AVInfo.filesizebytes,
          out.AVInfo.filesizeformatted,
        ]),
        HdrVideoFormatsData: metaTube(EnResp.HDRVideoStore).map((out) => [
          out.AVDownload.originalformat,
          out.AVInfo.filesizebytes,
          out.AVInfo.filesizeformatted,
        ]),
      };
      resolve(EnBody);
      console.log(
        colors.green("@info:"),
        "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
      );
    } catch (error) {
      reject(error instanceof z.ZodError ? error.errors : error);
    }
  });
}
