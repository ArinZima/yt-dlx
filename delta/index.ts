import help from "./pipes/command/help";
import search from "./pipes/command/search";
import extract from "./pipes/command/extract";
import get_playlist from "./pipes/command/get_playlist";
import list_formats from "./pipes/command/list_formats";
import get_video_data from "./pipes/command/get_video_data";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";

import AudioLowest from "./pipes/audio/AudioLowest";
import AudioHighest from "./pipes/audio/AudioHighest";
import VideoLowest from "./pipes/video/VideoLowest";
import VideoHighest from "./pipes/video/VideoHighest";
import AudioVideoLowest from "./pipes/mix/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/AudioVideoHighest";
import AudioQualityCustom from "./pipes/audio/AudioQualityCustom";
import VideoQualityCustom from "./pipes/video/VideoQualityCustom";

import ListVideoLowest from "./pipes/video/ListVideoLowest";
import ListVideoHighest from "./pipes/video/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/ListVideoQualityCustom";
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/ListAudioQualityCustom";
import ListAudioVideoLowest from "./pipes/mix/ListAudioVideoLowest";
import ListAudioVideoHighest from "./pipes/mix/ListAudioVideoHighest";

const ytdlx = {
  info: {
    help,
    search,
    extract,
    list_formats,
    get_playlist,
    get_video_data,
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
    playlist: {
      lowest: ListVideoLowest,
      highest: ListVideoHighest,
      custom: ListVideoQualityCustom,
    },
  },
  audio_video: {
    single: {
      lowest: AudioVideoLowest,
      highest: AudioVideoHighest,
    },
    playlist: { lowest: ListAudioVideoLowest, highest: ListAudioVideoHighest },
  },
};

export default ytdlx;
