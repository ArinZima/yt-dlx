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
    metaTube = (await web.search.SearchVideos({
      query: "PERSONAL BY PLAZA",
      screenshot: false,
      verbose: true,
      type: "video",
    })) as TypeVideo[];
    console.log(colors.green("@pass:"), "video search results received");
    metaTube = (await web.search.VideoInfo({
      query: metaTube[0]?.videoLink as string,
      screenshot: false,
      verbose: true,
    })) as VideoInfoType;
    console.log(colors.green("@pass:"), "single video data received");
    metaTube = (await web.search.SearchVideos({
      query: metaTube.title,
      screenshot: false,
      type: "playlist",
      verbose: true,
    })) as TypePlaylist[];
    console.log(colors.green("@pass:"), "playlist search results received");
    metaTube = (await web.search.PlaylistInfo({
      query: metaTube[0]?.playlistLink as string,
      screenshot: false,
      verbose: true,
    })) as PlaylistInfoType;
    console.log(colors.green("@pass:"), "single playlist data received");
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
})();
