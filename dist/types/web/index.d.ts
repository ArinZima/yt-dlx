import VideoInfo from "./browser/VideoInfo";
import SearchVideos from "./browser/SearchVideos";
import PlaylistInfo from "./browser/PlaylistInfo";
import type { VideoInfoType } from "./browser/VideoInfo";
import type { PlaylistInfoType } from "./browser/PlaylistInfo";
import type { TypePlaylist, TypeVideo } from "./browser/SearchVideos";
export type { TypeVideo, TypePlaylist, VideoInfoType, PlaylistInfoType };
import playlistVideos from "./vercel/playlistVideos";
import relatedVideos from "./vercel/relatedVideos";
import searchPlaylists from "./vercel/searchPlaylists";
import searchVideos from "./vercel/searchVideos";
import singleVideo from "./vercel/singleVideo";
import type { playlistVideosType } from "./vercel/playlistVideos";
import type { relatedVideosType } from "./vercel/relatedVideos";
import type { searchPlaylistsType } from "./vercel/searchPlaylists";
import type { searchVideosType } from "./vercel/searchVideos";
import type { singleVideoType } from "./vercel/singleVideo";
export type { singleVideoType, searchVideosType, relatedVideosType, playlistVideosType, searchPlaylistsType, };
declare const web: {
    browser: {
        VideoInfo: typeof VideoInfo;
        SearchVideos: typeof SearchVideos;
        PlaylistInfo: typeof PlaylistInfo;
    };
    browserLess: {
        singleVideo: typeof singleVideo;
        searchVideos: typeof searchVideos;
        relatedVideos: typeof relatedVideos;
        playlistVideos: typeof playlistVideos;
        searchPlaylists: typeof searchPlaylists;
    };
};
export default web;
