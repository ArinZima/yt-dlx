import * as z from "zod";
import colors from "colors";
import ytdlx from "../../base/Agent";

export default function list_formats({
  query,
  verbose,
}: {
  query: string;
  verbose?: boolean;
}): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const zval = z
        .object({
          query: z.string().min(1),
        })
        .parse({ query, verbose });
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
        "❣️ Thank you for using",
        colors.green("yt-dlx."),
        "Consider",
        colors.green("🌟starring"),
        "the github repo",
        colors.green("https://github.com/yt-dlx\n")
      );
    } catch (error) {
      reject(error instanceof z.ZodError ? error.errors : error);
    }
  });
}
