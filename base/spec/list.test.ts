import ytDlp from "..";
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
        " 🔬running test for <( ytDlp.audio.playlist.custom() )>"
    );
    await ytDlp.audio.playlist.custom({
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
        " 🔬running test for <( ytDlp.audio.playlist.highest() )>"
    );
    await ytDlp.audio.playlist.highest({
      outputFormat: "mp3",
      folderName: "temp",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytDlp.audio.playlist.lowest() )>"
    );
    await ytDlp.audio.playlist.lowest({
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
        " 🔬running test for <( ytDlp.video.playlist.custom() )>"
    );
    await ytDlp.video.playlist.custom({
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
        " 🔬running test for <( ytDlp.video.playlist.highest() )>"
    );
    await ytDlp.video.playlist.highest({
      outputFormat: "mp4",
      folderName: "temp",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytDlp.video.playlist.lowest() )>"
    );
    await ytDlp.video.playlist.lowest({
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
        " 🔬running test for <( ytDlp.audio_video.playlist.highest() )>"
    );
    await ytDlp.audio_video.playlist.highest({
      outputFormat: "mp4",
      folderName: "temp",
      playlistUrls,
    });
    console.info(
      "\n\n" +
        new Date().toLocaleString() +
        " " +
        colors.bold.blue("INFO:") +
        " 🔬running test for <( ytDlp.audio_video.playlist.lowest() )>"
    );
    await ytDlp.audio_video.playlist.lowest({
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
