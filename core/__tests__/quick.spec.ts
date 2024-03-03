console.clear();
import ListVideoLowest from "../pipes/video/ListVideoLowest";

(async () => {
  await ListVideoLowest({
    query:
      "https://youtube.com/playlist?list=PLOGXbfrrYmuHaKdTvngShVfcfWDq3E6VR&si=FtaCNRNWtUtW00Fc",
    verbose: false,
    output: "temp",
  });
})();
