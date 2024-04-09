import colors from "colors";
import { Client } from "youtubei";
import EventEmitter from "eventemitter3";

export interface relatedVideosType {
  id: string;
  title: string;
  isLive: boolean;
  duration: number;
  uploadDate: string;
  thumbnails: string[];
}
class Emitter extends EventEmitter {}
export default async function relatedVideos({ videoId }: { videoId: string }) {
  try {
    var youtube = new Client();
    var emitter = new Emitter();
    var relatedVideos: any = await youtube.getVideo(videoId);
    var result: relatedVideosType[] = relatedVideos.related.items.map(
      (item: any) => ({
        id: item.id,
        title: item.title,
        isLive: item.isLive,
        duration: item.duration,
        uploadDate: item.uploadDate,
        thumbnails: item.thumbnails,
      })
    );
    return result;
  } catch (error: any) {
    throw new Error(colors.red("@error: ") + error.message);
  }
}
