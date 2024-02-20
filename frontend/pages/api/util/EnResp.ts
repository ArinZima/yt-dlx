import ytdlp from "yt-dlp";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.body || !req.body.yturl) {
      return res
        .status(400)
        .send("Invalid request. yturl parameter is missing.");
    }
    const yturl = decodeURIComponent(req.body.yturl as string);
    const EnResp = await ytdlp.info.getRaw({
      url: yturl,
    });
    const fprem = (data: any[]) =>
      data.filter((prm) => !prm.meta_dl.originalformat.includes("Premium"));
    const EnBody = {
      AudioFormatsData: fprem(EnResp.audio_data).map((prm) => [
        prm.meta_dl.originalformat,
        prm.meta_info.filesizebytes,
        prm.meta_info.filesizeformatted,
      ]),
      VideoFormatsData: fprem(EnResp.video_data).map((prm) => [
        prm.meta_dl.originalformat,
        prm.meta_info.filesizebytes,
        prm.meta_info.filesizeformatted,
      ]),
      HdrVideoFormatsData: fprem(EnResp.hdrvideo_data).map((prm) => [
        prm.meta_dl.originalformat,
        prm.meta_info.filesizebytes,
        prm.meta_info.filesizeformatted,
      ]),
    };
    return res.status(200).json({
      TubeUrl: yturl,
      EnBody,
      EnResp,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing the stream.");
  }
}
