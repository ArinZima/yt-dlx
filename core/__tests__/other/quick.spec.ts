console.clear();
import * as async from "async";
import ListAudioHighest from "../../pipes/audio/playList/ListAudioHighest";
import ListAudioLowest from "../../pipes/audio/playList/ListAudioLowest";
import ListVideoHighest from "../../pipes/video/playList/ListVideoHighest";
import ListVideoLowest from "../../pipes/video/playList/ListVideoLowest";

async.series([
  async () => {
    await ListAudioHighest({
      output: "public/audio",
      verbose: false,
      query: [
        "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
        "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
      ],
    });
  },
  async () => {
    await ListAudioLowest({
      output: "public/audio",
      verbose: false,
      query: [
        "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
        "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
      ],
    });
  },
  async () => {
    await ListVideoHighest({
      output: "public/audio",
      verbose: false,
      query: [
        "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
        "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
      ],
    });
  },
  async () => {
    await ListVideoLowest({
      output: "public/audio",
      verbose: false,
      query: [
        "https://youtube.com/playlist?list=PLO7-VO1D0_6N2ePPlPE9NKCgUBA15aOk2&si=HgNC2GBt2KgAUk-t",
        "https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj&si=RP6NCtGFUkrKyDMo",
      ],
    });
  },
]);
