import VideoInfo from "./browser/VideoInfo";
import SearchVideos from "./browser/SearchVideos";
import PlaylistInfo from "./browser/PlaylistInfo";
import playlistVideos from "./vercel/playlistVideos";
import relatedVideos from "./vercel/relatedVideos";
import searchPlaylists from "./vercel/searchPlaylists";
import searchVideos from "./vercel/searchVideos";
import singleVideo from "./vercel/singleVideo";
var web = {
    browser: {
        VideoInfo: VideoInfo,
        SearchVideos: SearchVideos,
        PlaylistInfo: PlaylistInfo,
    },
    browserLess: {
        singleVideo: singleVideo,
        searchVideos: searchVideos,
        relatedVideos: relatedVideos,
        playlistVideos: playlistVideos,
        searchPlaylists: searchPlaylists,
    },
};
export default web;
