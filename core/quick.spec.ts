console.clear();
import ytCore from ".";
import * as async from "async";
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListVideoLowest from "./pipes/video/ListVideoLowest";
import ListVideoHighest from "./pipes/video/ListVideoHighest";
const playlistUrls: string[] = [
  "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=9U7vYacjbIfSOKr3",
];

async.waterfall(
  [
    async (callback: (arg0: unknown) => void) => {
      try {
        await ytCore.audio.playlist.highest({
          folderName: "temp",
          verbose: false,
          playlistUrls,
        });
        await ytCore.audio.playlist.lowest({
          folderName: "temp",
          verbose: false,
          playlistUrls,
        });
        await ytCore.video.playlist.highest({
          folderName: "temp",
          verbose: false,
          playlistUrls,
        });
        await ytCore.video.playlist.lowest({
          folderName: "temp",
          verbose: false,
          playlistUrls,
        });
        callback(null);
      } catch (error) {
        callback(error);
      }
    },
    async (callback: (arg0: unknown) => void) => {
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
        callback(null);
      } catch (error) {
        callback(error);
      }
    },
  ],
  (err) => {
    if (err) console.error(err);
  }
);
