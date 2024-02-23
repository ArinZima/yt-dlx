import YouTubeID from ".";
import colors from "colors";
import ytCore from "yt-core";

var VideoTest = [
  {
    expected: "-wtIMTCHWuI",
    url: "http://www.youtube.com/watch?v=-wtIMTCHWuI",
  },
  {
    expected: "-wtIMTCHWuI",
    url: "http://www.youtube.com/v/-wtIMTCHWuI?version=3&autohide=1",
  },
  { expected: "-wtIMTCHWuI", url: "http://youtu.be/-wtIMTCHWuI" },

  {
    expected: "-wtIMTCHWuI",
    url: "http://www.youtube.com/watch?v=-wtIMTCHWuI ",
  },
  {
    expected: "u8nQa1cJyX8",
    url: "http://www.youtube.com/watch?v=u8nQa1cJyX8&a=GxdCwVVULXctT2lYDEPllDR0LRTutYfW",
  },
  {
    expected: "u8nQa1cJyX8",
    url: "http://www.youtube.com/watch?v=u8nQa1cJyX8",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/embed/0zM3nApSvMg?rel=0",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/watch?v=0zM3nApSvMg",
  },
  { expected: "0zM3nApSvMg", url: "http://youtu.be/0zM3nApSvMg" },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/embed/0zM3nApSvMg?rel=0",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index",
  },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/watch?v=0zM3nApSvMg",
  },
  { expected: "0zM3nApSvMg", url: "http://youtu.be/0zM3nApSvMg" },
  {
    expected: "0zM3nApSvMg",
    url: "http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s",
  },
  {
    expected: "QdK8U-VIH_o",
    url: "http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o",
  },
  {
    expected: "u8nQa1cJyX8",
    url: "http://www.youtube.com/watch?argv=xyzxyzxyzxy&v=u8nQa1cJyX8",
  },
  {
    expected: "0zM3nApSvMg",
    url: "youtube.com/watch?feature=feedrec_grec_index&v=0zM3nApSvMg ",
  },
  {
    expected: "y_Rd2hByRyc",
    url: "http://www.youtube.com/watch?feature=player_embedded&v=y_Rd2hByRyc",
  },
];

var ListTest = [
  {
    expected: "PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM",
    url: "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
  },
];

async function runTests() {
  try {
    for (const T of VideoTest) {
      const videoId = await YouTubeID(T.url);
      if (videoId) {
        console.log(
          colors.bold.magenta("videoId:"),
          colors.italic(videoId),
          colors.bold.magenta("Expected:"),
          colors.italic(T.expected)
        );
        const metaTube = await ytCore.info.search_yt({ query: videoId });
        console.log(metaTube);
      }
    }
    console.log("\n\n");
    for (const T of ListTest) {
      const listId = await YouTubeID(T.url);
      if (listId) {
        console.log(
          colors.bold.magenta("listId:"),
          colors.italic(listId),
          colors.bold.magenta("Expected:"),
          colors.italic(T.expected)
        );
        const metaTube = await ytCore.info.search_yt({ query: listId });
        console.log(metaTube);
      }
    }
  } catch (metaError) {
    console.info(
      new Date().toLocaleString(),
      colors.bold.red("ERROR:"),
      metaError
    );
  }
}
runTests();
