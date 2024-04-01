import { writeFileSync } from "fs";
import { Innertube, UniversalCache } from "youtubei.js";

(async () => {
  const yt = await Innertube.create({
    cache: new UniversalCache(true, "./.cache"),
  });
  //
  //
  const getBasicInfo = await yt.getBasicInfo("AbFnsaDQMYQ");
  writeFileSync("getBasicInfo.json", JSON.stringify(getBasicInfo, null, 2));
  //
  //
  const search = await yt.search("city of starts");
  writeFileSync("search.json", JSON.stringify(search, null, 2));
  //
  //
  const getSearchSuggestions = await yt.getSearchSuggestions("city of starts");
  writeFileSync(
    "getSearchSuggestions.json",
    JSON.stringify(getSearchSuggestions, null, 2)
  );
  //
  //
  const getComments = await yt.getComments("fQLAyvDNmUU");
  writeFileSync("getComments.json", JSON.stringify(getComments, null, 2));
  //
  //
  const getPlaylist = await yt.getPlaylist(
    "PLz6H3RqQFdcwFwQECBcZVYAmXVhc0gPR1"
  );
  writeFileSync("getPlaylist.json", JSON.stringify(getPlaylist, null, 2));
  //
  //
  const getHomeFeed = await yt.getHomeFeed();
  writeFileSync("getHomeFeed.json", JSON.stringify(getHomeFeed, null, 2));
  //
  //
  const getTrending = await yt.getTrending();
  writeFileSync("getTrending.json", JSON.stringify(getTrending, null, 2));
})();
