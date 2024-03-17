console.clear();
import AudioHighest from "../../pipes/audio/single/AudioHighest";
import AudioLowest from "../../pipes/audio/single/AudioLowest";
import VideoHighest from "../../pipes/video/single/VideoHighest";
import VideoLowest from "../../pipes/video/single/VideoLowest";

(async () => {
  await AudioHighest({
    verbose: false,
    autoSocks5: true,
    query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
  });

  await AudioLowest({
    verbose: false,
    autoSocks5: true,
    query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
  });

  await VideoHighest({
    verbose: false,
    autoSocks5: true,
    query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
  });

  await VideoLowest({
    verbose: false,
    autoSocks5: true,
    query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
  });
})();
// ===========================================================================
// console.clear();
// import { Client } from "youtubei";
// (async () => {
// try {
// const youtube = new Client();
// const videos = await youtube.search("Houdini", {
// type: "video",
// });
// videos.items.forEach((item) => {
// console.log({
// id: item.id,
// title: item.title,
// thumbnails: item.thumbnails,
// uploadDate: item.uploadDate,
// description: item.description,
// duration: item.duration,
// isLive: item.isLive,
// viewCount: item.viewCount,
// channelid: item.channel?.id,
// channelname: item.channel?.name,
// });
// });
// const playlist = await youtube.search("Houdini", {
// type: "playlist",
// });
// playlist.items.forEach((item) => {
// console.log({
// id: item.id,
// title: item.title,
// videoCount: item.videoCount,
// thumbnails: item.thumbnails,
// });
// });
// } catch (error) {
// console.error("Error occurred:", error);
// }
// })();
