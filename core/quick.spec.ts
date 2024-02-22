console.clear();
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListVideoLowest from "./pipes/video/ListVideoLowest";
import ListVideoHighest from "./pipes/video/ListVideoHighest";
const playlistUrls: string[] = [
  "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
];

(async () => {
  try {
    await ListAudioLowest({
      folderName: "temp",
      verbose: false,
      playlistUrls,
    });
    await ListAudioHighest({
      folderName: "temp",
      verbose: false,
      playlistUrls,
    });
    await ListVideoLowest({
      folderName: "temp",
      verbose: false,
      playlistUrls,
    });
    await ListVideoHighest({
      folderName: "temp",
      verbose: false,
      playlistUrls,
    });
  } catch (error) {
    console.error(error);
  }
})();
