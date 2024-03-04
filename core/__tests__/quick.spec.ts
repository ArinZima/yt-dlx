console.clear();
import proTube from "..";
import async from "async";

async.series(
  [
    // =================================[AUDIO-ONLY]=================================
    async () => {
      await proTube().audio().single().highest({
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        torproxy: "socks5://127.0.0.1:9050",
        output: "public/audio",
        verbose: false,
        stream: false,
      });
    },
    async () => {
      await proTube().audio().single().lowest({
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        torproxy: "socks5://127.0.0.1:9050",
        output: "public/audio",
        verbose: false,
        stream: false,
      });
    },
    // =================================[VIDEO-ONLY]=================================
    async () => {
      await proTube().video().single().highest({
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        torproxy: "socks5://127.0.0.1:9050",
        output: "public/video",
        verbose: false,
        stream: false,
      });
    },
    async () => {
      await proTube().video().single().lowest({
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        torproxy: "socks5://127.0.0.1:9050",
        output: "public/video",
        verbose: false,
        stream: false,
      });
    },
    // =================================[AUDIO_VIDEO]=================================
    async () => {
      await proTube().audio_video().single().highest({
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        torproxy: "socks5://127.0.0.1:9050",
        output: "public/mix",
        verbose: false,
        stream: false,
      });
    },
    async () => {
      await proTube().audio_video().single().lowest({
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        torproxy: "socks5://127.0.0.1:9050",
        output: "public/mix",
        verbose: false,
        stream: false,
      });
    },
  ],
  (err) => console.error("@error:", err)
);
