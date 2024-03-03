console.clear();
import web from "../web";
import colors from "colors";
import type {
  PlaylistInfoType,
  VideoInfoType,
  TypePlaylist,
  TypeVideo,
} from "../web";

(async () => {
  try {
    let metaTube:
      | TypeVideo[]
      | TypePlaylist[]
      | VideoInfoType
      | PlaylistInfoType;
    metaTube = (await web.search.SearchVideos({
      screenshot: false,
      query: "PERSONAL BY PLAZA",
      type: "video",
    })) as TypeVideo[];
    console.log(colors.green("@pass:"), "video search results received");
    metaTube = (await web.search.VideoInfo({
      query: metaTube[0]?.videoLink as string,
      screenshot: false,
    })) as VideoInfoType;
    console.log(colors.green("@pass:"), "single video data received");
    metaTube = (await web.search.SearchVideos({
      query: metaTube.title,
      screenshot: false,
      type: "playlist",
    })) as TypePlaylist[];
    console.log(colors.green("@pass:"), "playlist search results received");
    metaTube = (await web.search.PlaylistInfo({
      query: metaTube[0]?.playlistLink as string,
      screenshot: false,
    })) as PlaylistInfoType;
    console.log(colors.green("@pass:"), "single playlist data received");
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
  // try {
  // let metaTube:
  // | TypeVideo[]
  // | TypePlaylist[]
  // | VideoInfoType
  // | PlaylistInfoType;

  // metaTube = (await web.search.VideoInfo({
  // query: "dQw4w9WgXcQ",
  // screenshot: false,
  // })) as VideoInfoType;
  // if (metaTube) {
  // console.log(
  // colors.green("@pass:"),
  // "single video data received using video-id"
  // );
  // } else console.error(colors.red("@fail:"), metaTube);

  // metaTube = (await web.search.PlaylistInfo({
  // query: "PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph",
  // screenshot: false,
  // })) as PlaylistInfoType;
  // if (metaTube) {
  // console.log(
  // colors.green("@pass:"),
  // "single playlist data received using playlist-id"
  // );
  // } else console.error(colors.red("@fail:"), metaTube);

  // metaTube = (await web.search.VideoInfo({
  // query: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  // screenshot: false,
  // })) as VideoInfoType;
  // if (metaTube) {
  // console.log(
  // colors.green("@pass:"),
  // "single video data received using video-link"
  // );
  // } else console.error(colors.red("@fail:"), metaTube);

  // metaTube = (await web.search.PlaylistInfo({
  // query:
  // "https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph",
  // screenshot: false,
  // })) as PlaylistInfoType;
  // if (metaTube) {
  // console.log(
  // colors.green("@pass:"),
  // "single playlist data received using playlist-link"
  // );
  // } else console.error(colors.red("@fail:"), metaTube);
  // } catch (error: any) {
  // console.error(colors.red("@error:"), error.message);
  // }
})();
