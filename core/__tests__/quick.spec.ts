console.clear();
import ytDlx from "..";

(async () => {
  await ytDlx().audio().single().highest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    verbose: false,
    output: "temp",
  });
  await ytDlx().audio().single().lowest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    verbose: false,
    output: "temp",
  });

  await ytDlx().video().single().highest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    verbose: false,
    output: "temp",
  });
  await ytDlx().video().single().lowest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    verbose: false,
    output: "temp",
  });

  await ytDlx().audio_video().single().highest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    verbose: false,
    output: "temp",
  });
  await ytDlx().audio_video().single().lowest({
    query: "https://www.youtube.com/watch?v=7PIji8OubXU",
    torproxy: "socks5://127.0.0.1:9050",
    verbose: false,
    output: "temp",
  });
})();

// torproxy: "socks5://127.0.0.1:9050",
