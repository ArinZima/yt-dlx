import * as vitest from "vitest";
import core from "./ytdlx_web";
import colors from "colors";
import type {
  TypeVideo,
  TypePlaylist,
  VideoInfoType,
  PlaylistInfoType,
} from "./ytdlx_web";

// =======================================================[PASS-TEST]=======================================================
vitest.test(colors.blue("@tesing: ") + "using vitest", async () => {
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
      query: metaTube[0].videoLink,
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
      query: metaTube[0].playlistLink,
      screenshot: false,
    })) as PlaylistInfoType;
    console.log(colors.green("@pass:"), "single playlist data received");
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
});
// =======================================================[ERROR-TEST]=======================================================
vitest.test(
  colors.blue("@tesing: ") + "must throw error SearchVideos(video)",
  async () => {
    try {
      let metaTube: TypeVideo[];
      metaTube = (await core.SearchVideos({
        screenshot: false,
        query: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video",
      })) as TypeVideo[];
      console.log(metaTube);
    } catch (error: any) {
      console.error(colors.red("@error:"), error.message);
    }
  }
);

vitest.test(
  colors.blue("@tesing: ") + "must throw error SearchVideos(playlist)",
  async () => {
    try {
      let metaTube: TypePlaylist[];
      metaTube = (await core.SearchVideos({
        screenshot: false,
        query:
          "https://www.youtube.com/playlist?list=PLJXKw9a0YAwCdVo4Yy9o5zLK25p-0xTX0",
        type: "playlist",
      })) as TypePlaylist[];
      console.log(metaTube);
    } catch (error: any) {
      console.error(colors.red("@error:"), error.message);
    }
  }
);
