import cors from "cors";
import colors from "colors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import search from "yt-search";
import exAsync from "./exAsync";
import ngrok from "@ngrok/ngrok";
import YouTubeID from "@shovit/ytid";
import bodyParser from "body-parser";
import sizeFormat from "./sizeFormat";
import formatCount from "./formatCount";
import cookieParser from "cookie-parser";
import type TubeFormat from "../interface/TubeFormat";
import type TubeConfig from "../interface/TubeConfig";
import type metaTubeConfig from "../interface/metaTubeConfig";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/core", async (req, res) => {
  try {
    let pushTube: any[] = [];
    if (!req.query.query) return res.status(200).json(null);
    const query = decodeURIComponent(req.query.query as string);
    const proTube: string | null = await exAsync({
      retries: 2,
      query,
    });
    if (proTube === null) return res.status(200).json(null);
    const metaTube = await JSON.parse(proTube);
    await metaTube.formats.forEach((ipop: TubeFormat) => {
      const rmval = new Set(["storyboard", "Default"]);
      if (!rmval.has(ipop.format_note) && ipop.filesize !== null) {
        const reTube: TubeConfig = {
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
            originalformat: ipop.format
              .replace(/[-\s]+/g, "_")
              .replace(/_/g, "_"),
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
      }
    });
    return res.status(200).json({
      AudioTube:
        pushTube
          .filter((item) => item.Tube === "AudioTube")
          .map((item) => item.reTube) || null,
      VideoTube:
        pushTube
          .filter((item) => item.Tube === "VideoTube")
          .map((item) => item.reTube) || null,
      HDRVideoTube:
        pushTube
          .filter((item) => item.Tube === "HDRVideoTube")
          .map((item) => item.reTube) || null,
      metaTube:
        pushTube
          .filter((item) => item.Tube === "metaTube")
          .map((item) => item.reTube)[0] || null,
    });
  } catch (error) {
    console.log(new Date().toLocaleString(), colors.bold.red("ERROR:"), error);
    return res.status(200).json(null);
  }
});
app.get("/scrape", async (req, res) => {
  try {
    let meta: any;
    let videoId: string | null;
    let metaTube: metaTubeConfig[] = [];
    const query: string = decodeURIComponent(req.query.query as string);
    const PlaylistRegex =
      /(https?:\/\/(www\.)?youtube\.com(\/playlist\?list=[a-zA-Z0-9_-]+)|(\/channel\/[\w_\-]{2,}\/playlists))/;
    const VideoRegex =
      /(https?:\/\/(www\.)?youtube\.com\/watch\?(?!.*v=)[a-zA-Z0-9]+|https:\/\/youtu\.be\/[a-zA-Z0-9\-_])/;
    switch (true) {
      case !req.query.query:
        return res.status(400).json({ error: "Query parameter is missing." });
      case PlaylistRegex.test(query):
        const playlistId = await YouTubeID(query);
        if (playlistId) {
          meta = await search({ listId: playlistId });
          return res.status(200).json({
            Link: meta.url,
            Title: meta.title,
            UploadDate: meta.date,
            PlaylistSize: meta.size,
            PlayListId: meta.listId,
            Uploader: meta.author.name,
            ChannelLink: meta.author.url,
            ViewCount: formatCount(meta.views),
            ThumbnailLink: meta.image || meta.thumbnail,
            Videos: meta.videos.map((meta: { videoId: any; title: any }) => ({
              videoId: meta.videoId,
              Title: meta.title,
            })),
          });
        } else return res.status(200).json(null);
      case /^PL?[a-zA-Z0-9_-]+$/.test(query):
        meta = await search({ listId: query });
        if (meta) {
          return res.status(200).json({
            Link: meta.url,
            Title: meta.title,
            UploadDate: meta.date,
            PlaylistSize: meta.size,
            PlayListId: meta.listId,
            Uploader: meta.author.name,
            ChannelLink: meta.author.url,
            ViewCount: formatCount(meta.views),
            ThumbnailLink: meta.image || meta.thumbnail,
            Videos: meta.videos.map((meta: { videoId: any; title: any }) => ({
              videoId: meta.videoId,
              Title: meta.title,
            })),
          });
        } else return res.status(200).json(null);
      case VideoRegex.test(query):
        videoId = await YouTubeID(query);
        if (videoId) {
          meta = await search({ videoId });
          return res.status(200).json({
            Link: meta.url,
            Title: meta.title,
            UploadDate: meta.ago,
            videoId: meta.videoId,
            Length: meta.timestamp,
            Uploader: meta.author.name,
            ChannelLink: meta.author.url,
            Description: meta.description,
            ViewCount: formatCount(meta.views),
            ThumbnailLink: meta.image || meta.thumbnail,
          });
        } else return res.status(200).json(null);
      case /^[a-zA-Z0-9_-]{11}$/.test(query):
        meta = await search({ videoId: query });
        if (meta) {
          return res.status(200).json({
            Link: meta.url,
            Title: meta.title,
            UploadDate: meta.ago,
            videoId: meta.videoId,
            Length: meta.timestamp,
            Uploader: meta.author.name,
            ChannelLink: meta.author.url,
            Description: meta.description,
            ViewCount: formatCount(meta.views),
            ThumbnailLink: meta.image || meta.thumbnail,
          });
        } else return res.status(200).json(null);
      default:
        meta = await search(query);
        if (meta) {
          for (let i = 0; i < meta.videos.length; i++) {
            metaTube.push({
              Link: meta.videos[i].url,
              Title: meta.videos[i].title,
              UploadDate: meta.videos[i].ago,
              videoId: meta.videos[i].videoId,
              Length: meta.videos[i].timestamp,
              Uploader: meta.videos[i].author.name,
              ChannelLink: meta.videos[i].author.url,
              Description: meta.videos[i].description,
              ViewCount: formatCount(meta.videos[i].views),
              ThumbnailLink: meta.videos[i].image || meta.videos[i].thumbnail,
            });
          }
          return res.status(200).json(metaTube);
        } else return res.status(200).json(null);
    }
  } catch (error) {
    console.log(new Date().toLocaleString(), colors.bold.red("ERROR:"), error);
    return res.status(200).json(null);
  }
});
const port = process.env.PORT || 8080;
const server = app.listen(port, async () => {
  console.log(colors.green("express @port:"), port);
  const ng = await ngrok.connect({
    addr: port,
    domain: "casual-insect-sunny.ngrok-free.app",
    key: "2ciOiqJgbB4WYJLE5D2r7E69ZZc_3T1do81AnZCe2GRHWNKhn",
    authtoken: "2ciO4xagu003RCLd9oHR2kNwlu7_aAaBTHudAQV89KRri8RS",
  });
  console.log(colors.green("proxy @url:"), ng.url());
});
async function handleSIGINT() {
  await new Promise((resolve) => {
    server.close(resolve);
    ngrok.disconnect();
  });
  process.exit(0);
}
process.on("SIGINT", handleSIGINT);
