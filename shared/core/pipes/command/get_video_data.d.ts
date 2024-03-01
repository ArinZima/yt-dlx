export interface VideoData {
    id: string;
    original_url: string;
    webpage_url: string;
    title: string;
    view_count: number;
    like_count: number;
    view_count_formatted: string;
    like_count_formatted: string;
    uploader: string;
    uploader_id: string;
    uploader_url: string;
    thumbnail: string;
    categories: string[];
    time: number;
    duration: VideoDuration;
    age_limit: number;
    live_status: string;
    description: string;
    full_description: string;
    upload_date: string;
    upload_ago: number;
    upload_ago_formatted: UploadAgoObject;
    comment_count: number;
    comment_count_formatted: string;
    channel_id: string;
    channel_name: string;
    channel_url: string;
    channel_follower_count: number;
    channel_follower_count_formatted: string;
}
export interface VideoDuration {
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
}
export interface UploadAgoObject {
    years: number;
    months: number;
    days: number;
    formatted: string;
}
export default function get_video_data({ query, }: {
    query: string;
}): Promise<VideoData>;
//# sourceMappingURL=get_video_data.d.ts.map