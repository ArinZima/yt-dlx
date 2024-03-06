import * as fs from "fs";
import * as path from "path";
import runFunc from "./runFunc";
import { promisify } from "util";
import { exec } from "child_process";
import type TubeConfig from "../interface/TubeConfig";
import type TubeFormat from "../interface/TubeFormat";
import type EngineResult from "../interface/EngineResult";

export function sizeFormat(filesize: number) {
  if (isNaN(filesize) || filesize < 0) return filesize;
  const bytesPerMegabyte = 1024 * 1024;
  const bytesPerGigabyte = bytesPerMegabyte * 1024;
  const bytesPerTerabyte = bytesPerGigabyte * 1024;
  if (filesize < bytesPerMegabyte) return filesize + " B";
  else if (filesize < bytesPerGigabyte) {
    return (filesize / bytesPerMegabyte).toFixed(2) + " MB";
  } else if (filesize < bytesPerTerabyte) {
    return (filesize / bytesPerGigabyte).toFixed(2) + " GB";
  } else return (filesize / bytesPerTerabyte).toFixed(2) + " TB";
}

export default async function Engine({
  query,
  torproxy,
}: {
  query: string;
  torproxy?: string;
}): Promise<EngineResult> {
  try {
    const response = await runFunc(async () => {
      let pushTube: any[] = [];
      let proLoc: string = "";
      let maxTries: number = 6;
      let currentDir: string = __dirname;
      while (maxTries > 0) {
        const enginePath = path.join(currentDir, "util", "engine");
        if (fs.existsSync(enginePath)) {
          proLoc = enginePath;
          break;
        } else {
          currentDir = path.join(currentDir, "..");
          maxTries--;
        }
      }
      if (proLoc !== "") {
        if (torproxy) proLoc += ` --proxy ${torproxy}`;
        proLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
        proLoc += ` --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'`;
        proLoc += ` --dump-single-json '${query}'`;
      } else throw new Error("could not find the engine file.");
      const result = await promisify(exec)(proLoc);
      const metaTube = await JSON.parse(result.stdout.toString());
      await metaTube.formats.forEach((io: TubeFormat) => {
        const rmval = new Set(["storyboard", "Default"]);
        if (rmval.has(io.format_note) && io.filesize === undefined) return;
        const reTube: TubeConfig = {
          Audio: {
            bitrate: io.abr,
            codec: io.acodec,
            samplerate: io.asr,
            extension: io.audio_ext,
            channels: io.audio_channels,
          },
          Video: {
            bitrate: io.vbr,
            width: io.width,
            codec: io.vcodec,
            height: io.height,
            extension: io.video_ext,
            resolution: io.resolution,
            aspectratio: io.aspect_ratio,
          },
          AVDownload: {
            mediaurl: io.url,
            formatid: io.format_id,
            formatnote: io.format_note,
            originalformat: io.format
              .replace(/[-\s]+/g, "_")
              .replace(/_/g, "_"),
          },
          AVInfo: {
            totalbitrate: io.tbr,
            framespersecond: io.fps,
            qriginalextension: io.ext,
            filesizebytes: io.filesize,
            dynamicrange: io.dynamic_range,
            extensionconatainer: io.container,
            filesizeformatted: sizeFormat(io.filesize),
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
            description: metaTube.description,
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
        if (reTube.AVDownload.formatnote) {
          switch (true) {
            case (reTube.AVDownload.formatnote.includes("ultralow") ||
              reTube.AVDownload.formatnote.includes("medium") ||
              reTube.AVDownload.formatnote.includes("high") ||
              reTube.AVDownload.formatnote.includes("low")) &&
              reTube.Video.resolution &&
              reTube.Video.resolution.includes("audio"):
              pushTube.push({ Tube: "AudioStore", reTube });
              break;
            case reTube.AVDownload.formatnote.includes("HDR"):
              pushTube.push({ Tube: "HDRVideoStore", reTube });
              break;
            default:
              pushTube.push({ Tube: "VideoStore", reTube });
              break;
          }
        }
      });
      return {
        AudioStore:
          pushTube
            .filter((item: { Tube: string }) => item.Tube === "AudioStore")
            .map((item: { reTube: any }) => item.reTube) || undefined,
        VideoStore:
          pushTube
            .filter((item: { Tube: string }) => item.Tube === "VideoStore")
            .map((item: { reTube: any }) => item.reTube) || undefined,
        HDRVideoStore:
          pushTube
            .filter((item: { Tube: string }) => item.Tube === "HDRVideoStore")
            .map((item: { reTube: any }) => item.reTube) || undefined,
        metaTube:
          pushTube
            .filter((item: { Tube: string }) => item.Tube === "metaTube")
            .map((item: { reTube: any }) => item.reTube)[0] || undefined,
      };
    });
    return response;
  } catch (error: any) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("internal server error");
  }
}
