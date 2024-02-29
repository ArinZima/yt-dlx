import colors from "colors";
import type {
  TypeVideo,
  TypePlaylist,
  VideoInfoType,
  PlaylistInfoType,
} from "../../";
import * as vitest from "vitest";
import core from "../../";

vitest.test(colors.blue("\n\n@tesing: ") + "using vitest", async () => {
  try {
    let metaTube:
      | TypeVideo[]
      | TypePlaylist[]
      | VideoInfoType
      | PlaylistInfoType;

    metaTube = (await core.search.SearchVideos({
      screenshot: false,
      query: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      type: "video",
    })) as TypeVideo[];
    console.log(colors.green("@pass:"), "video search results received");

    metaTube = (await core.search.VideoInfo({
      query: metaTube[0]?.videoLink as string,
      screenshot: false,
    })) as VideoInfoType;
    console.log(colors.green("@pass:"), "single video data received");

    metaTube = (await core.search.SearchVideos({
      query: metaTube.title,
      screenshot: false,
      type: "playlist",
    })) as TypePlaylist[];
    console.log(colors.green("@pass:"), "playlist search results received");

    metaTube = (await core.search.PlaylistInfo({
      query: metaTube[0]?.playlistLink as string,
      screenshot: false,
    })) as PlaylistInfoType;
    console.log(colors.green("@pass:"), "single playlist data received");
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
});

vitest.test(colors.blue("\n\n@tesing: ") + "using vitest", async () => {
  try {
    let metaTube:
      | TypeVideo[]
      | TypePlaylist[]
      | VideoInfoType
      | PlaylistInfoType;

    metaTube = (await core.search.VideoInfo({
      query: "dQw4w9WgXcQ",
      screenshot: false,
    })) as VideoInfoType;
    if (metaTube) {
      console.log(
        colors.green("@pass:"),
        "single video data received using video-id"
      );
    } else console.error(colors.red("@fail:"), metaTube);

    metaTube = (await core.search.PlaylistInfo({
      query: "PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph",
      screenshot: false,
    })) as PlaylistInfoType;
    if (metaTube) {
      console.log(
        colors.green("@pass:"),
        "single playlist data received using playlist-id"
      );
    } else console.error(colors.red("@fail:"), metaTube);

    metaTube = (await core.search.VideoInfo({
      query: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      screenshot: false,
    })) as VideoInfoType;
    if (metaTube) {
      console.log(
        colors.green("@pass:"),
        "single video data received using video-link"
      );
    } else console.error(colors.red("@fail:"), metaTube);

    metaTube = (await core.search.PlaylistInfo({
      query:
        "https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph",
      screenshot: false,
    })) as PlaylistInfoType;
    if (metaTube) {
      console.log(
        colors.green("@pass:"),
        "single playlist data received using playlist-link"
      );
    } else console.error(colors.red("@fail:"), metaTube);
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
});
