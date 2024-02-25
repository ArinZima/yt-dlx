import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import sizeFormat from "./sizeFormat";

export default async function ytxc(
  query: string,
  port?: number,
  proxy?: string,
  username?: string,
  password?: string
): Promise<any> {
  let pushTube: any[] = [];
  let proLoc = path.join(__dirname, "util", "Engine");
  if (proxy && port && username && password) {
    proLoc += ` --proxy 'http://${username}:${password}@${proxy}:${port}'`;
  }
  proLoc += ` --dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
  proLoc += ` --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'`;
  proLoc += ` '${query}'`;
  const result = await promisify(exec)(proLoc);
  const metaTube = await JSON.parse(result.stdout.toString());
  await metaTube.formats.forEach((ipop: any) => {
    const rmval = new Set(["storyboard", "Default"]);
    if (rmval.has(ipop.format_note) && ipop.filesize === null) return;
    const reTube: any = {
      meta_audio: {
        samplerate: ipop.asr,
        channels: ipop.audio_channels,
        codec: ipop.acodec,
        extension: ipop.audio_ext,
        bitrate: ipop.abr,
      },
      meta_video: {
        height: ipop.height,
        width: ipop.width,
        codec: ipop.vcodec,
        resolution: ipop.resolution,
        aspectratio: ipop.aspect_ratio,
        extension: ipop.video_ext,
        bitrate: ipop.vbr,
      },
      meta_dl: {
        formatid: ipop.format_id,
        formatnote: ipop.format_note,
        originalformat: ipop.format.replace(/[-\s]+/g, "_").replace(/_/g, "_"),
        mediaurl: ipop.url,
      },
      meta_info: {
        filesizebytes: ipop.filesize,
        filesizeformatted: sizeFormat(ipop.filesize),
        framespersecond: ipop.fps,
        totalbitrate: ipop.tbr,
        qriginalextension: ipop.ext,
        dynamicrange: ipop.dynamic_range,
        extensionconatainer: ipop.container,
      },
    };
    pushTube.push({
      Tube: "metaTube",
      reTube: {
        id: metaTube.id,
        title: metaTube.title,
        channel: metaTube.channel,
        uploader: metaTube.uploader,
        duration: metaTube.duration,
        thumbnail: metaTube.thumbnail,
        age_limit: metaTube.age_limit,
        channel_id: metaTube.channel_id,
        categories: metaTube.categories,
        display_id: metaTube.display_id,
        Description: metaTube.Description,
        channel_url: metaTube.channel_url,
        webpage_url: metaTube.webpage_url,
        live_status: metaTube.live_status,
        upload_date: metaTube.upload_date,
        uploader_id: metaTube.uploader_id,
        original_url: metaTube.original_url,
        uploader_url: metaTube.uploader_url,
        duration_string: metaTube.duration_string,
      },
    });
    if (reTube.meta_dl.formatnote) {
      switch (true) {
        case (reTube.meta_dl.formatnote.includes("ultralow") ||
          reTube.meta_dl.formatnote.includes("medium") ||
          reTube.meta_dl.formatnote.includes("high") ||
          reTube.meta_dl.formatnote.includes("low")) &&
          reTube.meta_video.resolution &&
          reTube.meta_video.resolution.includes("audio"):
          pushTube.push({ Tube: "AudioTube", reTube });
          break;
        case reTube.meta_dl.formatnote.includes("HDR"):
          pushTube.push({ Tube: "HDRVideoTube", reTube });
          break;
        default:
          pushTube.push({ Tube: "VideoTube", reTube });
          break;
      }
    }
  });
  return JSON.stringify({
    AudioTube:
      pushTube
        .filter((item: { Tube: string }) => item.Tube === "AudioTube")
        .map((item: { reTube: any }) => item.reTube) || null,
    VideoTube:
      pushTube
        .filter((item: { Tube: string }) => item.Tube === "VideoTube")
        .map((item: { reTube: any }) => item.reTube) || null,
    HDRVideoTube:
      pushTube
        .filter((item: { Tube: string }) => item.Tube === "HDRVideoTube")
        .map((item: { reTube: any }) => item.reTube) || null,
    metaTube:
      pushTube
        .filter((item: { Tube: string }) => item.Tube === "metaTube")
        .map((item: { reTube: any }) => item.reTube)[0] || null,
  });
}
