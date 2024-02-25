import async from "async";
import colors from "colors";
import metaGrab from "./metaGrab";

async.waterfall([
  async function searchPlaylist() {
    const metaTube = await metaGrab.YouTubePlaylist({
      playlistLink:
        "https://youtube.com/playlist?list=PL3oW2tjiIxvQ60uIjLdo7vrUe4ukSpbKl&si=Z6SMzOT_2xNMfGlg",
    });
    if (!metaTube) {
      console.log(
        colors.red("@error:"),
        "no data found from YouTubePlaylist()"
      );
      process.exit(500);
    }
    console.log(colors.magenta("@playlist:"), metaTube);
    console.log(colors.magenta("@total-views:"), metaTube.views);
    console.log(colors.magenta("@count:"), metaTube.videos.length);
    return metaTube;
  },
  async function searchYouTube() {
    const metaTube = await metaGrab.YouTubeSearch({
      query: "Ek chaturnar",
      number: 10,
    });
    if (!metaTube) {
      console.log(colors.red("@error:"), "no data found from YouTubeSearch()");
      process.exit(500);
    }
    console.log(colors.blue("@count:"), metaTube.length);
    return metaTube;
  },
  async function getVideoInfo(metaTube: any) {
    if (!metaTube) {
      console.log(colors.red("@error:"), "no data found from YouTubeSearch()");
      process.exit(500);
    }
    const videoData = await metaGrab.YouTubeVideo({
      videoLink: metaTube[0].videoLink,
    });
    if (!videoData) {
      console.log(colors.red("@error:"), "no data found from YouTubeVideo()");
      process.exit(500);
    }
    console.log(colors.green("@video:"), videoData);
    return videoData;
  },
]);
