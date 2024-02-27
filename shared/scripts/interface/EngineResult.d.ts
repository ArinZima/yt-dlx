import search from "yt-search";
import type TubeConfig from "./TubeConfig";
export default interface EngineResult {
    LiveTube?: search.BaseOptions | search.SearchResult | search.PlaylistItem | search.OptionsWithQuery | search.LiveSearchResult | search.LiveSearchResult | search.VideoSearchResult | search.OptionsWithSearch | search.VideoMetadataResult | search.ChannelSearchResult | search.PlaylistSearchResult | search.VideoMetadataOptions | search.LiveSearchResultBase | search.PlaylistMetadataResult | search.PlaylistMetadataOptions | search.UpcomingLiveSearchResult;
    AudioTube: TubeConfig[];
    VideoTube: TubeConfig[];
    HDRVideoTube: TubeConfig[];
}
//# sourceMappingURL=EngineResult.d.ts.map