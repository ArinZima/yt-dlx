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
import { green } from "colors";
import { Client } from "youtubei";

(async () => {
  const youtube = new Client();
  try {
    const VideosSearch = await youtube.search("Houdini", { type: "video" });
    const videoItems = VideosSearch.items.map((item) => ({
      id: item.id,
      title: item.title,
      isLive: item.isLive,
      duration: item.duration,
      viewCount: item.viewCount,
      uploadDate: item.uploadDate,
      channelid: item.channel?.id,
      channelname: item.channel?.name,
      description: item.description,
      thumbnails: item.thumbnails,
    }));
    console.log(green("videoItems:"), videoItems);
    // ==================================================
    const ListsSearch = await youtube.search("Houdini", { type: "playlist" });
    const playlistItems = ListsSearch.items.map((item) => ({
      id: item.id,
      title: item.title,
      videoCount: item.videoCount,
      thumbnails: item.thumbnails,
    }));
    console.log(green("playlistItems:"), playlistItems);
    // ==================================================
    const VideoSingle: any = await youtube.getVideo("dQw4w9WgXcQ");
    console.log(green("VideoSingle:"), {
      id: VideoSingle.id,
      title: VideoSingle.title,
      thumbnails: VideoSingle.thumbnails,
      uploadDate: VideoSingle.uploadDate,
      description: VideoSingle.description,
      duration: VideoSingle.duration,
      isLive: VideoSingle.isLiveContent,
      viewCount: VideoSingle.viewCount,
      channelid: VideoSingle.channel.id,
      channelname: VideoSingle.channel.name,
      tags: VideoSingle.tags,
      likeCount: VideoSingle.likeCount,
    });
    // ==================================================
    const VideosRelated: any = await youtube.getVideo("dQw4w9WgXcQ");
    const relatedItems = VideosRelated.related.items.map((item: any) => ({
      id: item.id,
      title: item.title,
      isLive: item.isLive,
      duration: item.duration,
      uploadDate: item.uploadDate,
      thumbnails: item.thumbnails,
    }));
    console.log(green("relatedItems:"), relatedItems);
    // ==================================================
    const SingleList: any = await youtube.getPlaylist(
      "PLY50G60VnAbyeVmUyGjXdBy0LjleYsjys"
    );
    const playlistVideos = SingleList.videos.items.map((item: any) => ({
      id: item.id,
      title: item.title,
      isLive: item.isLive,
      duration: item.duration,
      thumbnails: item.thumbnails,
    }));
    console.log(
      green("playlist.id: ") + SingleList.id,
      green("playlist.title: ") + SingleList.title,
      green("playlist.videoCount: ") + SingleList.videoCount,
      green("playlistVideos"),
      playlistVideos
    );
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
