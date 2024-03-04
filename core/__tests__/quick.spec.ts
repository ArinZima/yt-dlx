console.clear();
import proTube from "..";

const options = {
  stream: false,
  verbose: false,
  output: "public",
  torproxy: "socks5://127.0.0.1:9050",
  query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
};

async () => {
  // [AUDIO-ONLY]
  await proTube.audio.single.lowest(options);
  await proTube.audio.single.highest(options);
  // [VIDEO-ONLY]
  await proTube.video.single.lowest(options);
  await proTube.video.single.highest(options);
  // [AUDIO_VIDEO]
  await proTube.audio_video.single.lowest(options);
  await proTube.audio_video.single.highest(options);
};
