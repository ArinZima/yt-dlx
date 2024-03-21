import web from "./web";
import help from "./routes/command/help";
import extract from "./routes/command/extract";
import list_formats from "./routes/command/list_formats";

import AudioLowest from "./routes/Audio/single/AudioLowest";
import AudioHighest from "./routes/Audio/single/AudioHighest";
import ListAudioLowest from "./routes/Audio/list/ListAudioLowest";
import ListAudioHighest from "./routes/Audio/list/ListAudioHighest";

import VideoLowest from "./routes/Video/single/VideoLowest";
import VideoHighest from "./routes/Video/single/VideoHighest";
import ListVideoLowest from "./routes/Video/list/ListVideoLowest";
import ListVideoHighest from "./routes/Video/list/ListVideoHighest";

import AudioVideoHighest from "./routes/AudioVideo/single/AudioVideoHighest";
import AudioVideoLowest from "./routes/AudioVideo/single/AudioVideoLowest";
import ListAudioVideoHighest from "./routes/AudioVideo/list/ListAudioVideoHighest";
import ListAudioVideoLowest from "./routes/AudioVideo/list/ListAudioVideoLowest";

const ytdlx = {
  search: {
    browser: {
      SearchVideos: web.browser.SearchVideos,
      PlaylistInfo: web.browser.PlaylistInfo,
      VideoInfo: web.browser.VideoInfo,
    },
    browserLess: {
      playlistVideos: web.browserLess.playlistVideos,
      relatedVideos: web.browserLess.relatedVideos,
      searchPlaylists: web.browserLess.searchPlaylists,
      searchVideos: web.browserLess.searchVideos,
      singleVideo: web.browserLess.singleVideo,
    },
  },
  info: {
    help,
    extract,
    list_formats,
  },
  AudioOnly: {
    Single: {
      Lowest: AudioLowest,
      Highest: AudioHighest,
    },
    List: {
      Lowest: ListAudioLowest,
      Highest: ListAudioHighest,
    },
  },
  VideoOnly: {
    Single: {
      Lowest: VideoLowest,
      Highest: VideoHighest,
    },
    List: {
      Lowest: ListVideoLowest,
      Highest: ListVideoHighest,
    },
  },
  AudioVideo: {
    Single: {
      Lowest: AudioVideoLowest,
      Highest: AudioVideoHighest,
    },
    List: {
      Lowest: ListAudioVideoLowest,
      Highest: ListAudioVideoHighest,
    },
  },
};
export default ytdlx;
