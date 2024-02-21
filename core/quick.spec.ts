console.clear();
import ytCore from ".";

(async () => {
  try {
    await ytCore.audio.playlist.highest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ytCore.audio.playlist.lowest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ytCore.audio.playlist.custom({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      quality: "medium",
      verbose: false,
    });

    await ytCore.video.playlist.highest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ytCore.video.playlist.lowest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ytCore.video.playlist.custom({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      quality: "720p",
      verbose: false,
    });
  } catch (error) {
    console.error(error);
  }
})();
