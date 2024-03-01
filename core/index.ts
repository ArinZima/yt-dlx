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
    lowest: AudioLowest,
    highest: AudioHighest,
    custom: AudioQualityCustom,
  },
  video: {
    lowest: VideoLowest,
    highest: VideoHighest,
    custom: VideoQualityCustom,
  },
  audio_video: {
    lowest: AudioVideoLowest,
    highest: AudioVideoHighest,
  },
};

export default ytdlx;
