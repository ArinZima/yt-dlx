import web from "./web";
import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";

import AudioLowest from "./pipes/audio/AudioLowest";
import AudioHighest from "./pipes/audio/AudioHighest";
import VideoLowest from "./pipes/video/VideoLowest";
import VideoHighest from "./pipes/video/VideoHighest";
import AudioVideoLowest from "./pipes/mix/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/AudioVideoHighest";
import AudioQualityCustom from "./pipes/audio/AudioQualityCustom";
import VideoQualityCustom from "./pipes/video/VideoQualityCustom";

import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/ListAudioQualityCustom";

const ytdlx = {
  search: {
    PlaylistInfo: web.search.PlaylistInfo,
    SearchVideos: web.search.SearchVideos,
    VideoInfo: web.search.VideoInfo,
  },
  info: {
    help,
    extract,
    list_formats,
    extract_playlist_videos,
  },
  audio: {
    single: {
      lowest: AudioLowest,
      highest: AudioHighest,
      custom: AudioQualityCustom,
    },
    playlist: {
      lowest: ListAudioLowest,
      highest: ListAudioHighest,
      custom: ListAudioQualityCustom,
    },
  },
  video: {
    single: {
      lowest: VideoLowest,
      highest: VideoHighest,
      custom: VideoQualityCustom,
    },
    playlist: {},
  },
  audio_video: {
    single: {
      lowest: AudioVideoLowest,
      highest: AudioVideoHighest,
    },
    playlist: {},
  },
};

export default ytdlx;
