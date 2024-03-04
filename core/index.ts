import web from "./web";
import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";

import AudioLowest from "./pipes/audio/AudioLowest";
import AudioHighest from "./pipes/audio/AudioHighest";
import AudioQualityCustom from "./pipes/audio/AudioQualityCustom";
import ListAudioLowest from "./pipes/audio/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/ListAudioQualityCustom";

import VideoLowest from "./pipes/video/VideoLowest";
import VideoHighest from "./pipes/video/VideoHighest";
import VideoQualityCustom from "./pipes/video/VideoQualityCustom";
import ListVideoLowest from "./pipes/video/ListVideoLowest";
import ListVideoHighest from "./pipes/video/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/ListVideoQualityCustom";

import AudioVideoLowest from "./pipes/mix/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/AudioVideoHighest";
import AudioVideoQualityCustom from "./pipes/mix/AudioVideoQualityCustom.";
import ListAudioVideoHighest from "./pipes/mix/ListAudioVideoHighest";
import ListAudioVideoLowest from "./pipes/mix/ListAudioVideoLowest";
import ListAudioVideoQualityCustom from "./pipes/mix/ListAudioVideoQualityCustom";

const ytdlx = () => ({
  search: () => ({
    VideoInfo: web.search.VideoInfo,
    PlaylistInfo: web.search.PlaylistInfo,
    SearchVideos: web.search.SearchVideos,
  }),
  info: () => ({
    help,
    extract,
    list_formats,
    extract_playlist_videos,
  }),
  AudioOnly: () => ({
    Single: () => ({
      Lowest: AudioLowest,
      Highest: AudioHighest,
      Custom: AudioQualityCustom,
    }),
    Playlist: () => ({
      Lowest: ListAudioLowest,
      Highest: ListAudioHighest,
      Custom: ListAudioQualityCustom,
    }),
  }),
  VideoOnly: () => ({
    Single: () => ({
      Lowest: VideoLowest,
      Highest: VideoHighest,
      Custom: VideoQualityCustom,
    }),
    Playlist: () => ({
      Lowest: ListVideoLowest,
      Highest: ListVideoHighest,
      Custom: ListVideoQualityCustom,
    }),
  }),
  AudioVideo: () => ({
    Single: () => ({
      Lowest: AudioVideoLowest,
      Highest: AudioVideoHighest,
      Custom: AudioVideoQualityCustom,
    }),
    Playlist: () => ({
      Lowest: ListAudioVideoHighest,
      Highest: ListAudioVideoLowest,
      Custom: ListAudioVideoQualityCustom,
    }),
  }),
});

export default ytdlx;
