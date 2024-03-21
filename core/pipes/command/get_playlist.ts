import colors from "colors";
import web from "../../web";
import YouTubeID from "../../web/YouTubeId";

export default async function get_playlist({
  playlistUrls,
}: {
  playlistUrls: string[];
}): Promise<any> {
  const result = [];
  for (const videoLink of playlistUrls) {
    const playlistId = await YouTubeID(videoLink);
    if (!playlistId) {
      console.error(
        colors.red("@error:"),
        "Incorrect playlist url",
        colors.red(videoLink)
      );
      continue;
    } else {
      const resp = await web.browserLess.playlistVideos({ playlistId });
      if (!resp) {
        console.error(
          colors.red("@error:"),
          "Invalid Data Found For",
          videoLink
        );
        continue;
      } else {
        console.log(
          colors.green("@info:"),
          "total videos in playlist",
          videoLink,
          colors.green(resp.length)
        );
        for (let i = 0; i < resp.length; i++) {
          try {
            const videoId = resp[i].id;
            if (videoId) {
              const vid = await web.browserLess.singleVideo({ videoId });
              if (vid) {
                console.log(
                  colors.green("@info:"),
                  "extracted data for",
                  colors.green(vid.title)
                );
                result.push({ ...vid });
              } else continue;
            } else continue;
          } catch (error: any) {
            console.error(colors.red("@error:"), error.message, "skipping");
          }
        }
      }
    }
  }
  console.log(
    colors.green("@info:"),
    "❣️ Thank you for using",
    colors.green("yt-dlx."),
    "Consider",
    colors.green("🌟starring"),
    "the github repo",
    colors.green("https://github.com/yt-dlx\n")
  );
  return result;
}
