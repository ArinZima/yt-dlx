import colors from "colors";
import EventEmitter from "eventemitter3";
import YouTubeID from "../../web/YouTubeId";
import web, { searchPlaylistsType } from "../../web";

/**
 * Searches for YouTube playlists based on the query.
 *
 * @param query - The search query for playlists.
 * @returns A Promise that resolves with the search results for playlists.
 * @throws An error if the input is a playlist link (use playlist_data instead) or if unable to get a response.
 */
class Emitter extends EventEmitter {}
export default async function search_playlists({
  query,
}: {
  query: string;
}): Promise<searchPlaylistsType[]> {
  var emitter = new Emitter();
  var isID = await YouTubeID(query);
  if (isID) {
    throw new Error(
      colors.red("@error: ") + "use playlist_data() for playlist link!"
    );
  } else {
    var metaData = await web.searchPlaylists({ query });
    if (!metaData) {
      throw new Error(colors.red("@error: ") + "Unable to get response!");
    } else return metaData;
  }
}
