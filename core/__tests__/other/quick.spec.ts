// console.clear();
// import fs from "fs";
// import Agent from "../../base/Agent";

// (async () => {
// const data = await Agent({
// autoSocks5: true,
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });
// const jsonData = JSON.stringify(data, null, 2);
// fs.writeFileSync("data.json", jsonData);
// console.log("Data saved to data.json");
// })();
// ===========================================================================
console.clear();
import AudioHighest from "../../pipes/audio/single/AudioHighest";
import AudioLowest from "../../pipes/audio/single/AudioLowest";
import VideoHighest from "../../pipes/video/single/VideoHighest";
import VideoLowest from "../../pipes/video/single/VideoLowest";

(async () => {
  try {
    await AudioHighest({
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
      autoSocks5: false,
      verbose: false,
      stream: false,
    });

    await AudioLowest({
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
      autoSocks5: false,
      verbose: false,
      stream: false,
    });

    await VideoHighest({
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
      autoSocks5: false,
      verbose: false,
      stream: false,
    });

    await VideoLowest({
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
      autoSocks5: false,
      verbose: false,
      stream: false,
    });
  } catch (error) {
    console.error(error);
  }
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
