import server from "../app";
import colors from "colors";
import search from "yt-search";
import exAsync from "./exAsync";
import YouTubeID from "@shovit/ytid";
import sizeFormat from "./sizeFormat";
import formatCount from "./formatCount";
import TubeFormat from "../interface/TubeFormat";
import TubeConfig from "../interface/TubeConfig";
import metaTubeConfig from "../interface/metaTubeConfig";

server.get("/core", async (req, res) => {
  try {
    let pushTube: any[] = [];
    if (!req.query.query) return res.status(200).send(null);
    const query = decodeURIComponent(req.query.query as string);
    const proTube: string | null = await exAsync({
      retries: 2,
      query,
    });
    if (proTube === null) return res.status(200).send(null);
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
    return res.status(200).send({
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
    return res.status(200).send(null);
  }
});

server.get("/scrape", async (req, res) => {
  try {
    let videoId: string | null;
    let meta:
      | search.PlaylistMetadataResult
      | search.VideoMetadataResult
      | search.SearchResult;
    let metaTube: metaTubeConfig[] = [];
    const query: string = decodeURIComponent(req.query.query as string);
    const PlaylistRegex =
      /(https?:\/\/(www\.)?youtube\.com(\/playlist\?list=[a-zA-Z0-9_-]+)|(\/channel\/[\w_\-]{2,}\/playlists))/;
    const VideoRegex =
      /(https?:\/\/(www\.)?youtube\.com\/watch\?(?!.*v=)[a-zA-Z0-9]+|https:\/\/youtu\.be\/[a-zA-Z0-9\-_])/;
    switch (true) {
      case !req.query.query:
        return res.status(200).send(null);
      case PlaylistRegex.test(query):
        console.info(
          new Date().toLocaleString(),
          colors.bold.yellow("INFO:"),
          "is a playlist link"
        );
        const playlistId = await YouTubeID(query);
        if (playlistId) {
          meta = await search({ listId: playlistId });
          return res.status(200).send({
            Link: meta.url,
            Title: meta.title,
            UploadDate: meta.date,
            PlaylistSize: meta.size,
            PlayListId: meta.listId,
            Uploader: meta.author.name,
            ChannelLink: meta.author.url,
            ViewCount: formatCount(meta.views),
            ThumbnailLink: meta.image || meta.thumbnail,
            Videos: meta.videos.map((meta) => ({
              videoId: meta.videoId,
              Title: meta.title,
            })),
          });
        } else return res.status(200).send(null);
      case /^PL?[a-zA-Z0-9_-]+$/.test(query):
        console.info(
          new Date().toLocaleString(),
          colors.bold.yellow("INFO:"),
          "is a playlist id"
        );
        meta = await search({ listId: query });
        if (meta) {
          return res.status(200).send({
            Link: meta.url,
            Title: meta.title,
            UploadDate: meta.date,
            PlaylistSize: meta.size,
            PlayListId: meta.listId,
            Uploader: meta.author.name,
            ChannelLink: meta.author.url,
            ViewCount: formatCount(meta.views),
            ThumbnailLink: meta.image || meta.thumbnail,
            Videos: meta.videos.map((meta) => ({
              videoId: meta.videoId,
              Title: meta.title,
            })),
          });
        } else return res.status(200).send(null);
      case VideoRegex.test(query):
        console.info(
          new Date().toLocaleString(),
          colors.bold.yellow("INFO:"),
          "is a video link"
        );
        videoId = await YouTubeID(query);
        if (videoId) {
          meta = await search({ videoId });
          return res.status(200).send({
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
        } else return res.status(200).send(null);
      case /^[a-zA-Z0-9_-]{11}$/.test(query):
        console.info(
          new Date().toLocaleString(),
          colors.bold.yellow("INFO:"),
          "is a video id"
        );
        meta = await search({ videoId: query });
        if (meta) {
          return res.status(200).send({
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
        } else return res.status(200).send(null);
      default:
        console.info(
          new Date().toLocaleString(),
          colors.bold.yellow("INFO:"),
          "is query"
        );
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
          return res.status(200).send(metaTube);
        } else return res.status(200).send(null);
    }
  } catch (error) {
    console.log(new Date().toLocaleString(), colors.bold.red("ERROR:"), error);
    return res.status(200).send(null);
  }
});
