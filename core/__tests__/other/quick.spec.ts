console.clear();
import * as async from "async";

import ListVideoLowest from "../../pipes/video/playList/ListVideoLowest";
import ListAudioLowest from "../../pipes/audio/playList/ListAudioLowest";
import ListAudioVideoLowest from "../../pipes/mix/playList/ListAudioVideoLowest";
import ListVideoHighest from "../../pipes/video/playList/ListVideoHighest";
import ListAudioHighest from "../../pipes/audio/playList/ListAudioHighest";
import ListAudioVideoHighest from "../../pipes/mix/playList/ListAudioVideoHighest";

async.waterfall(
  [
    (callback: any) => {
      async.series(
        [
          async () => {
            try {
              await ListAudioVideoHighest({
                verbose: false,
                output: "public/audio",
                query: [
                  "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
                  "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
                ],
              });
            } catch (error) {
              callback(error);
            }
          },
          async () => {
            try {
              await ListAudioHighest({
                verbose: false,
                output: "public/audio",
                query: [
                  "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
                  "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
                ],
              });
            } catch (error) {
              callback(error);
            }
          },
          async () => {
            try {
              await ListVideoHighest({
                verbose: false,
                output: "public/video",
                query: [
                  "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
                  "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
                ],
              });
            } catch (error) {
              callback(error);
            }
          },
        ],
        (error) => callback(error)
      );
    },
    (callback: any) => {
      async.series(
        [
          async () => {
            try {
              await ListAudioVideoLowest({
                verbose: false,
                output: "public/audio",
                query: [
                  "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
                  "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
                ],
              });
            } catch (error) {
              callback(error);
            }
          },
          async () => {
            try {
              await ListAudioLowest({
                verbose: false,
                output: "public/audio",
                query: [
                  "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
                  "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
                ],
              });
            } catch (error) {
              callback(error);
            }
          },
          async () => {
            try {
              await ListVideoLowest({
                verbose: false,
                output: "public/video",
                query: [
                  "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
                  "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
                ],
              });
            } catch (error) {
              callback(error);
            }
          },
        ],
        (error) => callback(error)
      );
    },
  ],
  (error) => {
    if (error) console.error(error);
  }
);
