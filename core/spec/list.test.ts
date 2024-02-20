import ytCore from "..";
import colors from "colors";
const playlistUrls = [
  "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
];

(async () => {
  try {
    // ===========================================[ AUDIO :: ONLY ]===========================================
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.audio.playlist.custom() )>"
    );
    await ytCore.audio.playlist.custom({
      outputFormat: "mp3",
      folderName: "temp",
      quality: "medium",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.audio.playlist.highest() )>"
    );
    await ytCore.audio.playlist.highest({
      outputFormat: "mp3",
      folderName: "temp",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.audio.playlist.lowest() )>"
    );
    await ytCore.audio.playlist.lowest({
      outputFormat: "mp3",
      filter: "nightcore",
      folderName: "temp",
      playlistUrls,
    });
    // ===========================================[ VIDEO :: ONLY ]===========================================
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.video.playlist.custom() )>"
    );
    await ytCore.video.playlist.custom({
      outputFormat: "mp4",
      folderName: "temp",
      quality: "720p",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.video.playlist.highest() )>"
    );
    await ytCore.video.playlist.highest({
      outputFormat: "mp4",
      folderName: "temp",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.video.playlist.lowest() )>"
    );
    await ytCore.video.playlist.lowest({
      outputFormat: "mp4",
      filter: "grayscale",
      folderName: "temp",
      playlistUrls,
    });
    // ===========================================[ AUDIO :: VIDEO ]===========================================
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.audio_video.playlist.highest() )>"
    );
    await ytCore.audio_video.playlist.highest({
      outputFormat: "mp4",
      folderName: "temp",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytCore.audio_video.playlist.lowest() )>"
    );
    await ytCore.audio_video.playlist.lowest({
      outputFormat: "mp4",
      folderName: "temp",
      playlistUrls,
    });
  } catch (metaError) {
    console.error(
      new Date().toLocaleString() + " " + colors.bold.red("ERROR:"),
      metaError
    );
  }
})();
