import web from "./web";
import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";

import AudioLowest from "./pipes/audio/single/AudioLowest";
import AudioHighest from "./pipes/audio/single/AudioHighest";
import AudioQualityCustom from "./pipes/audio/single/AudioQualityCustom";
import ListAudioLowest from "./pipes/audio/list/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/list/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/list/ListAudioQualityCustom";

import VideoLowest from "./pipes/video/single/VideoLowest";
import VideoHighest from "./pipes/video/single/VideoHighest";
import VideoQualityCustom from "./pipes/video/single/VideoQualityCustom";
import ListVideoLowest from "./pipes/video/list/ListVideoLowest";
import ListVideoHighest from "./pipes/video/list/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/list/ListVideoQualityCustom";

import AudioVideoLowest from "./pipes/mix/single/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/single/AudioVideoHighest";
import AudioVideoQualityCustom from "./pipes/mix/single/AudioVideoQualityCustom.";
import ListAudioVideoHighest from "./pipes/mix/list/ListAudioVideoHighest";
import ListAudioVideoLowest from "./pipes/mix/list/ListAudioVideoLowest";
import ListAudioVideoQualityCustom from "./pipes/mix/list/ListAudioVideoQualityCustom";

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
    List: () => ({
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
    List: () => ({
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
    List: () => ({
      Lowest: ListAudioVideoHighest,
      Highest: ListAudioVideoLowest,
      Custom: ListAudioVideoQualityCustom,
    }),
  }),
});

export default ytdlx;
