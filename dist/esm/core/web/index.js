import PlaylistInfo from "./browser/PlaylistInfo";
import SearchVideos from "./browser/SearchVideos";
import VideoInfo from "./browser/VideoInfo";
import playlistVideos from "./vercel/playlistVideos";
import relatedVideos from "./vercel/relatedVideos";
import searchPlaylists from "./vercel/searchPlaylists";
import searchVideos from "./vercel/searchVideos";
import singleVideo from "./vercel/singleVideo";
const web = {
    browser: {
        VideoInfo,
        SearchVideos,
        PlaylistInfo,
    },
    browserLess: {
        singleVideo,
        searchVideos,
        relatedVideos,
        playlistVideos,
        searchPlaylists,
    },
};
export default web;
//# sourceMappingURL=index.js.map