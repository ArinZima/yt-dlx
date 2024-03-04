console.clear();
import proTube from "..";

(async () => {
  // =================================[AUDIO-ONLY]=================================
  await proTube().audio().single().highest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    output: "public/audio",
    verbose: false,
  });
  await proTube().audio().single().lowest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    output: "public/audio",
    verbose: false,
  });
  // =================================[VIDEO-ONLY]=================================
  await proTube().video().single().highest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    output: "public/video",
    verbose: false,
  });
  await proTube().video().single().lowest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    output: "public/video",
    verbose: false,
  });
  // =================================[AUDIO_VIDEO]=================================
  await proTube().audio_video().single().highest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    output: "public/mix",
    verbose: false,
  });
  await proTube().audio_video().single().lowest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    output: "public/mix",
    verbose: false,
  });
})();
