import * as z from "zod";
import Engine from "../../base/Agent";

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
      const EnResp = await Engine(zval);
      if (!EnResp) return reject("Unable to get response from YouTube...");
      const metaTube = (data: any[]) =>
        data.filter((out) => !out.meta_dl.originalformat.includes("Premium"));
      const EnBody = {
        AudioFormatsData: metaTube(EnResp.AudioStore).map((out) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted,
        ]),
        VideoFormatsData: metaTube(EnResp.VideoStore).map((out) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted,
        ]),
        HdrVideoFormatsData: metaTube(EnResp.HDRVideoStore).map((out) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted,
        ]),
      };
      resolve(EnBody);
    } catch (error) {
      reject(error instanceof z.ZodError ? error.errors : error);
    }
  });
}
