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
      const fprem = (data: any[]) =>
        data.filter(
          (out: { meta_dl: { originalformat: string | string[] } }) =>
            !out.meta_dl.originalformat.includes("Premium")
        );
      const EnBody = {
        AudioFormatsData: fprem(EnResp.AudioTube).map((out: any) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted,
        ]),
        VideoFormatsData: fprem(EnResp.VideoTube).map((out: any) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted,
        ]),
        HdrVideoFormatsData: fprem(EnResp.HDRVideoTube).map((out: any) => [
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
