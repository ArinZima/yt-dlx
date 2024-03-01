import get_playlist_info from "../pipes/command/get_playlist_info";
(async () => {
  const metaTube = await get_playlist_info({
    playlistUrls: [
      "https://www.youtube.com/playlist?list=PLRBp0Fe2GpgnIh0AiYKh7o7HnYAej-5ph",
    ],
  });
  console.log(metaTube);
})();
