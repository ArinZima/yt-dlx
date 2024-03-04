console.clear();
import ListAudioQualityCustom from "../pipes/audio/ListAudioQualityCustom";

(async () => {
  await ListAudioQualityCustom({
    query:
      "https://youtube.com/playlist?list=PLOGXbfrrYmuHaKdTvngShVfcfWDq3E6VR&si=FtaCNRNWtUtW00Fc",
    quality: "high",
    verbose: false,
    output: "temp",
  });
})();
