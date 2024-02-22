console.clear();
import ytCore from ".";
// import * as async from "async";
// import ListAudioLowest from "./pipes/audio/ListAudioLowest";
// import ListAudioHighest from "./pipes/audio/ListAudioHighest";
// import ListVideoLowest from "./pipes/video/ListVideoLowest";
// import ListVideoHighest from "./pipes/video/ListVideoHighest";
// import ListAudioQualityCustom from "./pipes/audio/ListAudioQualityCustom";
// import ListVideoQualityCustom from "./pipes/video/ListVideoQualityCustom";
// const playlistUrls: string[] = [
// "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
// ];

(async () => {
  try {
    await ytCore.audio.single.lowest({
      query: "wWR0VD6qgt8",
      folderName: "temp",
      verbose: false,
    });
  } catch (error) {
    console.error(error);
  }
})();

// async.waterfall(
// [
// async (callback: any) => {
// try {
// await ytCore.audio.playlist.custom({
// folderName: "temp",
// quality: "medium",
// verbose: false,
// playlistUrls,
// });
// await ytCore.audio.playlist.highest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });
// await ytCore.audio.playlist.lowest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });

// await ytCore.video.playlist.custom({
// folderName: "temp",
// quality: "720p",
// verbose: false,
// playlistUrls,
// });
// await ytCore.video.playlist.highest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });
// await ytCore.video.playlist.lowest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });
// callback(null);
// } catch (error) {
// callback(error);
// }
// },
// async (callback: any) => {
// try {
// await ListAudioLowest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });
// await ListAudioHighest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });
// await ListAudioQualityCustom({
// folderName: "temp",
// quality: "medium",
// verbose: false,
// playlistUrls,
// });
// await ListVideoLowest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });
// await ListVideoHighest({
// folderName: "temp",
// verbose: false,
// playlistUrls,
// });
// await ListVideoQualityCustom({
// folderName: "temp",
// quality: "720p",
// verbose: false,
// playlistUrls,
// });
// callback(null);
// } catch (error) {
// callback(error);
// }
// },
// ],
// (err) => {
// if (err) console.error(err);
// }
// );
