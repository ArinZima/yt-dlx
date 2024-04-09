import colors from "colors";
import { Client } from "youtubei";
import EventEmitter from "eventemitter3";

export interface searchPlaylistsType {
  id: string;
  title: string;
  videoCount: number;
  thumbnails: string[];
}
class Emitter extends EventEmitter {}
export default async function searchPlaylists({ query }: { query: string }) {
  try {
    const youtube = new Client();
    const searchPlaylists = await youtube.search(query, { type: "playlist" });
    const result: searchPlaylistsType[] = searchPlaylists.items.map(
      (item: any) => ({
        id: item.id,
        title: item.title,
        videoCount: item.videoCount,
        thumbnails: item.thumbnails,
      })
    );
    return result;
  } catch (error: any) {
    throw new Error(colors.red("@error: ") + error.message);
  }
}
