import async from "async";
import colors from "colors";
import { chromium } from "playwright";
import YouTubeID from "../backend/util/YouTubeId";

async function YouTubePlaylist({ playlistLink }) {
  const playlistData = [];
  try {
    const browser = await chromium.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(playlistLink);
    const videoElements = await page.$$("ytd-playlist-video-renderer");
    for (const videoElement of videoElements) {
      const titleElement = await videoElement.$("h3");
      let title = await titleElement.textContent();
      title = title.trim();
      const urlElement = await videoElement.$("a");
      const url =
        "https://www.youtube.com" + (await urlElement.getAttribute("href"));
      const videoId = (await YouTubeID(url)) || undefined;
      const authorElement = await videoElement.$(
        ".yt-simple-endpoint.style-scope.yt-formatted-string"
      );
      const author = await authorElement.textContent();
      const viewsElement = await videoElement.$(
        ".style-scope.ytd-video-meta-block span:first-child"
      );
      const views = await viewsElement.textContent();
      const agoElement = await videoElement.$(
        ".style-scope.ytd-video-meta-block span:last-child"
      );
      const ago = await agoElement.textContent();
      playlistData.push({
        ago,
        url,
        title,
        author,
        videoId,
        views: views.replace(/ views/g, ""),
      });
    }
    await browser.close();
    return { playlistData };
  } catch (error) {
    console.error("Error scraping playlist:", error);
    return undefined;
  }
}

await async.waterfall([
  async function searchPlaylist() {
    const metaTube = await YouTubePlaylist({
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
    return metaTube;
  },
]);
