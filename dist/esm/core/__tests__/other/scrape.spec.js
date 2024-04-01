console.clear();
import web from "../../web";
import colors from "colors";
(async () => {
    try {
        let Tube;
        Tube = (await web.browser.SearchVideos({
            query: "PERSONAL BY PLAZA",
            screenshot: false,
            onionTor: true,
            verbose: false,
            type: "video",
        }));
        console.log(colors.green("@pass:"), "video search results received");
        Tube = (await web.browser.VideoInfo({
            query: Tube[0]?.videoLink,
            screenshot: false,
            onionTor: true,
            verbose: false,
        }));
        console.log(colors.green("@pass:"), "single video data received");
        Tube = (await web.browser.SearchVideos({
            query: Tube.title,
            screenshot: false,
            onionTor: true,
            type: "playlist",
            verbose: false,
        }));
        console.log(colors.green("@pass:"), "playlist search results received");
        Tube = (await web.browser.PlaylistInfo({
            query: Tube[0]?.playlistLink,
            screenshot: false,
            onionTor: true,
            verbose: false,
        }));
        console.log(colors.green("@pass:"), "single playlist data received");
        Tube = await web.browserLess.searchVideos({ query: "weeknd" });
        console.log(colors.green("searchVideos"), Tube[0]);
        Tube = await web.browserLess.searchPlaylists({ query: Tube[0].title });
        console.log(colors.green("searchPlaylists"), Tube[0]);
        Tube = await web.browserLess.playlistVideos({ playlistId: Tube[0].id });
        console.log(colors.green("playlistVideos"), Tube[0]);
        Tube = await web.browserLess.relatedVideos({ videoId: Tube[0].id });
        console.log(colors.green("relatedVideos"), Tube[0]);
        Tube = await web.browserLess.singleVideo({ videoId: Tube[0].id });
        console.log(colors.green("singleVideo"), Tube);
    }
    catch (error) {
        console.error(colors.red("@error:"), error.message);
    }
})();
// =======================================================================
//# sourceMappingURL=scrape.spec.js.map