console.clear();
import web from "../../web";
import colors from "colors";
import type {
  PlaylistInfoType,
  VideoInfoType,
  TypePlaylist,
  TypeVideo,
} from "../../web";

(async () => {
  try {
    let metaTube:
      | TypeVideo[]
      | TypePlaylist[]
      | VideoInfoType
      | PlaylistInfoType;
    metaTube = (await web.search.VideoInfo({
      query: "https://www.youtube.com/watch?v=pBYx_dT3xS8",
      screenshot: false,
      autoSocks5: true,
      verbose: true,
    })) as VideoInfoType;
    console.log(metaTube);
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
})();
