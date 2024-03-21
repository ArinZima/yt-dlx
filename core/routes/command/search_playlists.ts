import colors from "colors";
import YouTubeID from "../../web/YouTubeId";
import web, { searchPlaylistsType } from "../../web";

interface ipop {
  query: string;
}
export default async function search_playlists({
  query,
}: ipop): Promise<searchPlaylistsType> {
  const isID = await YouTubeID(query);
  if (isID) {
    throw new Error(
      colors.red("@error: ") + "use playlist_data() for playlist link!"
    );
  } else {
    const metaData = await web.browserLess.searchPlaylists({ query });
    if (!metaData) {
      throw new Error(colors.red("@error: ") + "Unable to get response!");
    } else return metaData;
  }
}
