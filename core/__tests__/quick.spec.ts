console.clear();
import ytdlx from "..";

const options = {
  stream: false,
  verbose: false,
  output: "public",
  // torproxy: "socks5://127.0.0.1:9050",
  query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
};

(async () => {
  try {
    // await ytdlx.audio.single.lowest(options); // [AUDIO-ONLY]
    // await ytdlx.audio.single.highest(options); // [AUDIO-ONLY]
    // await ytdlx.video.single.lowest(options); // [VIDEO-ONLY]
    await ytdlx.video.single.highest(options); // [VIDEO-ONLY]
    // await ytdlx.audio_video.single.lowest(options); // [AUDIO_VIDEO]
    // await ytdlx.audio_video.single.highest(options); // [AUDIO_VIDEO]
  } catch (error) {
    console.error(error);
  }
})();
