console.clear();
import proTube from "..";
import async from "async";

const options = {
  stream: false,
  verbose: false,
  output: "public",
  torproxy: "socks5://127.0.0.1:9050",
  query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
};

async.series(
  [
    // =================================[AUDIO-ONLY]=================================
    async () => await proTube().audio().single().lowest(options),
    async () => await proTube().audio().single().highest(options),
    // =================================[VIDEO-ONLY]=================================
    async () => await proTube().video().single().lowest(options),
    async () => await proTube().video().single().highest(options),
    // =================================[AUDIO_VIDEO]=================================
    async () => await proTube().audio_video().single().lowest(options),
    async () => await proTube().audio_video().single().highest(options),
  ],
  (error) => console.error("@error:", error)
);
