console.clear();
import ytCore from ".";

(async () => {
  try {
    await ytCore.audio.playlist.custom({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      quality: "medium",
      verbose: false,
    });
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

    await ytCore.video.playlist.custom({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      quality: "720p",
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
  } catch (error) {
    console.error(error);
  }
})();
// ===========================================================================================================================
console.clear();
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/ListAudioQualityCustom";

import ListVideoLowest from "./pipes/video/ListVideoLowest";
import ListVideoHighest from "./pipes/video/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/ListVideoQualityCustom";

(async () => {
  try {
    await ListAudioLowest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ListAudioHighest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ListAudioQualityCustom({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      quality: "medium",
      verbose: false,
    });
    await ListVideoLowest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ListVideoHighest({
      playlistUrls: [
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
      ],
      folderName: "temp",
      verbose: false,
    });
    await ListVideoQualityCustom({
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
