import SearchVideos from "./api/SearchVideos";
import PlaylistInfo from "./api/PlaylistInfo";
import VideoInfo from "./api/VideoInfo";

import type { VideoInfoType } from "./api/VideoInfo";
import type { PlaylistInfoType } from "./api/PlaylistInfo";
import type { TypePlaylist, TypeVideo } from "./api/SearchVideos";
export type { TypeVideo, TypePlaylist, VideoInfoType, PlaylistInfoType };

const web = {
  search: {
    SearchVideos,
    PlaylistInfo,
    VideoInfo,
  },
};

export default web;
