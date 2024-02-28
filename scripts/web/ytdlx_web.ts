import SearchVideos from "./api/SearchVideos";
import PlaylistInfo from "./api/PlaylistInfo";
import VideoInfo from "./api/VideoInfo";

import type { VideoInfoType } from "./api/VideoInfo";
import type { PlaylistInfoType } from "./api/PlaylistInfo";
import type { TypePlaylist, TypeVideo } from "./api/SearchVideos";

const core = {
  SearchVideos,
  PlaylistInfo,
  VideoInfo,
};
export default core;
export type { TypeVideo, TypePlaylist, VideoInfoType, PlaylistInfoType };
