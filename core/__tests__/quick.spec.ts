console.clear();
import ListAudioHighest from "../pipes/audio/ListAudioHighest";

(async () => {
  await ListAudioHighest({
    query:
      "https://youtube.com/playlist?list=PLOGXbfrrYmuHaKdTvngShVfcfWDq3E6VR&si=FtaCNRNWtUtW00Fc",
    output: "temp/audio",
    verbose: false,
  });
})();
