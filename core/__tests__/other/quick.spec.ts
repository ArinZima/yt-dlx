console.clear();
import fluent from "fluent-ffmpeg";
import Agent from "../../base/Agent";

async function ffmpeg(url: any, filename: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const ff = fluent(url);
    ff.outputOptions("-c copy");
    ff.output(filename);
    ff.on("end", () => {
      resolve();
      process.stdout.write("\n");
    });
    ff.on("start", (command) => {
      console.log("@command:", command);
    });
    ff.on("error", (error) => reject(error));
    ff.on("progress", ({ percent }) => {
      if (isNaN(percent)) return;
      process.stdout.write(`\r@progress: ${filename} | ${percent.toFixed(2)}%`);
    });
    ff.run();
  });
}

(async () => {
  const Tube = await Agent({
    query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    autoSocks5: true,
  });
  const videoArrays = [Tube.HighVideo, Tube.LowVideo];
  for (const videoArray of videoArrays) {
    for (const video of videoArray) {
      if (video?.url && video?.format) {
        const filename = `${video.format}.mp4`;
        await ffmpeg(video.url, filename);
      }
    }
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
