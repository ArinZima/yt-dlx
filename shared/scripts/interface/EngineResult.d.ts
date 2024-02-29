import type TubeConfig from "./TubeConfig";
interface EngineData {
    id: string;
    title: string;
    channel: string;
    uploader: string;
    duration: number;
    thumbnail: string;
    age_limit: number;
    channel_id: string;
    categories: string[];
    display_id: string;
    view_count: number;
    like_count: number;
    description: string;
    channel_url: string;
    webpage_url: string;
    live_status: string;
    upload_date: string;
    uploader_id: string;
    original_url: string;
    uploader_url: string;
    comment_count: number;
    duration_string: string;
    channel_follower_count: number;
}
export default interface EngineResult {
    metaTube: EngineData;
    AudioStore: TubeConfig[];
    VideoStore: TubeConfig[];
    HDRVideoStore: TubeConfig[];
}
export {};
//# sourceMappingURL=EngineResult.d.ts.map