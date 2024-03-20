import web from "./web";
import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
// import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";

import AudioLowest from "./pipes/audio/single/AudioLowest";
import AudioHighest from "./pipes/audio/single/AudioHighest";
import ListAudioLowest from "./pipes/audio/list/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/list/ListAudioHighest";

import VideoLowest from "./pipes/video/single/VideoLowest";
import VideoHighest from "./pipes/video/single/VideoHighest";
import ListVideoLowest from "./pipes/video/list/ListVideoLowest";
import ListVideoHighest from "./pipes/video/list/ListVideoHighest";

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
    // list_formats,
    extract_playlist_videos,
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
};
export default ytdlx;
