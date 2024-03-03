console.clear();
import ListVideoQualityCustom from "../pipes/video/ListVideoQualityCustom";

(async () => {
  await ListVideoQualityCustom({
    query:
      "https://youtube.com/playlist?list=PLOGXbfrrYmuHaKdTvngShVfcfWDq3E6VR&si=FtaCNRNWtUtW00Fc",
    quality: "1080p",
    verbose: false,
    output: "temp",
  });
})();
