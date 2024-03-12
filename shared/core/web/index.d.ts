import SearchVideos from "./api/SearchVideos";
import PlaylistInfo from "./api/PlaylistInfo";
import VideoInfo from "./api/VideoInfo";
import type { VideoInfoType } from "./api/VideoInfo";
import type { PlaylistInfoType } from "./api/PlaylistInfo";
import type { TypePlaylist, TypeVideo } from "./api/SearchVideos";
export type { TypeVideo, TypePlaylist, VideoInfoType, PlaylistInfoType };
declare const web: {
    search: {
        SearchVideos: typeof SearchVideos;
        PlaylistInfo: typeof PlaylistInfo;
        VideoInfo: typeof VideoInfo;
    };
};
export default web;
//# sourceMappingURL=index.d.ts.map