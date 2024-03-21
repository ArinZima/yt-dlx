// console.clear();
// import AudioLowest from "../../pipes/Audio/single/AudioLowest";
// import AudioHighest from "../../pipes/Audio/single/AudioHighest";
// import VideoLowest from "../../pipes/Video/single/VideoLowest";
// import VideoHighest from "../../pipes/Video/single/VideoHighest";

// (async () => {
// try {
// await AudioLowest({
// verbose: true,
// onionTor: true,
// output: "public/audio",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });

// await AudioHighest({
// verbose: true,
// onionTor: true,
// output: "public/audio",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });

// await VideoLowest({
// verbose: true,
// onionTor: true,
// output: "public/video",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });

// await VideoHighest({
// verbose: true,
// onionTor: true,
// output: "public/video",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });
// } catch (error) {
// console.error(error);
// }
// })();
// =====================================================================
console.clear();
import get_playlist from "../../pipes/command/get_playlist";
(async () => {
  try {
    const metaTube = await get_playlist({
      playlistUrls: [
        "https://youtube.com/playlist?list=PLl578ZPbYIlFcSxuka8Km37VgbUYUWI5p&si=omFLN4W00obX88sg",
      ],
    });
    console.log(metaTube);
  } catch (error) {
    console.error(error);
  }
})();
