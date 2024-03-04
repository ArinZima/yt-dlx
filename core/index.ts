import web from "./web";
import help from "./pipes/command/help";
import extract from "./pipes/command/extract";
import list_formats from "./pipes/command/list_formats";
import extract_playlist_videos from "./pipes/command/extract_playlist_videos";

import AudioLowest from "./pipes/audio/single/AudioLowest";
import AudioHighest from "./pipes/audio/single/AudioHighest";
import AudioQualityCustom from "./pipes/audio/single/AudioQualityCustom";
import ListAudioLowest from "./pipes/audio/playList/ListAudioLowest";
import ListAudioHighest from "./pipes/audio/playList/ListAudioHighest";
import ListAudioQualityCustom from "./pipes/audio/playList/ListAudioQualityCustom";

import VideoLowest from "./pipes/video/single/VideoLowest";
import VideoHighest from "./pipes/video/single/VideoHighest";
import VideoQualityCustom from "./pipes/video/single/VideoQualityCustom";
import ListVideoLowest from "./pipes/video/playList/ListVideoLowest";
import ListVideoHighest from "./pipes/video/playList/ListVideoHighest";
import ListVideoQualityCustom from "./pipes/video/playList/ListVideoQualityCustom";

import AudioVideoLowest from "./pipes/mix/single/AudioVideoLowest";
import AudioVideoHighest from "./pipes/mix/single/AudioVideoHighest";
import AudioVideoQualityCustom from "./pipes/mix/single/AudioVideoQualityCustom.";
import ListAudioVideoHighest from "./pipes/mix/playList/ListAudioVideoHighest";
import ListAudioVideoLowest from "./pipes/mix/playList/ListAudioVideoLowest";
import ListAudioVideoQualityCustom from "./pipes/mix/playList/ListAudioVideoQualityCustom";

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
