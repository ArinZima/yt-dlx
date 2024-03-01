console.clear();
import extract_playlist_videos from "../pipes/command/extract_playlist_videos";

(async () => {
  const metaTube = await extract_playlist_videos({
    playlistUrls: [
      "https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph",
    ],
  });
  metaTube.forEach((v) => console.log(JSON.parse(JSON.stringify(v))));
})();
