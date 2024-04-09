import colors from "colors";
import { Client } from "youtubei";
import EventEmitter from "eventemitter3";

export interface playlistVideosType {
  id: string;
  title: string;
  videoCount: number;
  result: {
    id: string;
    title: string;
    isLive: boolean;
    duration: number;
    thumbnails: string[];
  };
}
class Emitter extends EventEmitter {}
export default async function playlistVideos({
  playlistId,
}: {
  playlistId: string;
}) {
  try {
    var youtube = new Client();
    var emitter = new Emitter();
    var playlistVideos: any = await youtube.getPlaylist(playlistId);
    var result = playlistVideos.videos.items.map((item: any) => ({
      id: item.id,
      title: item.title,
      isLive: item.isLive,
      duration: item.duration,
      thumbnails: item.thumbnails,
    }));
    return {
      id: playlistVideos.id,
      title: playlistVideos.title,
      videoCount: playlistVideos.videoCount,
      result,
    };
  } catch (error: any) {
    throw new Error(colors.red("@error: ") + error.message);
  }
}
