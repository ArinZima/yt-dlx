import colors from "colors";
import type {
  TypeVideo,
  TypePlaylist,
  VideoInfoType,
  PlaylistInfoType,
} from "../../web/ytdlx_web";
import * as bun from "bun:test";
import core from "../../web/ytdlx_web";

bun.test(colors.blue("\n\n@tesing: ") + "using bun", async () => {
  try {
    let metaTube:
      | TypeVideo[]
      | TypePlaylist[]
      | VideoInfoType
      | PlaylistInfoType;

    metaTube = (await core.SearchVideos({
      screenshot: false,
      query: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      type: "video",
    })) as TypeVideo[];
    console.log(colors.green("@pass:"), "video search results received");

    metaTube = (await core.VideoInfo({
      query: metaTube[0]?.videoLink as string,
      screenshot: false,
    })) as VideoInfoType;
    console.log(colors.green("@pass:"), "single video data received");

    metaTube = (await core.SearchVideos({
      query: metaTube.title,
      screenshot: false,
      type: "playlist",
    })) as TypePlaylist[];
    console.log(colors.green("@pass:"), "playlist search results received");

    metaTube = (await core.PlaylistInfo({
      query: metaTube[0]?.playlistLink as string,
      screenshot: false,
    })) as PlaylistInfoType;
    console.log(colors.green("@pass:"), "single playlist data received");
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
});
