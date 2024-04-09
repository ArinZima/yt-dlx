import colors from "colors";
import { Client } from "youtubei";
import EventEmitter from "eventemitter3";

export interface searchVideosType {
  id: string;
  title: string;
  isLive: boolean;
  duration: number;
  viewCount: number;
  uploadDate: string;
  channelid: string;
  channelname: string;
  description: string;
  thumbnails: string[];
}
class Emitter extends EventEmitter {}
export default async function searchVideos({ query }: { query: string }) {
  try {
    var youtube = new Client();
    var emitter = new Emitter();
    var searchVideos = await youtube.search(query, { type: "video" });
    var result: searchVideosType[] = searchVideos.items.map((item: any) => ({
      id: item.id,
      title: item.title,
      isLive: item.isLive,
      duration: item.duration,
      viewCount: item.viewCount,
      uploadDate: item.uploadDate,
      channelid: item.channel.id,
      channelname: item.channel.name,
      description: item.description,
      thumbnails: item.thumbnails,
    }));
    return result;
  } catch (error: any) {
    throw new Error(colors.red("@error: ") + error.message);
  }
}
