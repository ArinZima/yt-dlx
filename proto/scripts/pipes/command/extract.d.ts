export default function extract({ query }: {
    query: string;
}): Promise<{
    audio_data: any;
    video_data: any;
    hdrvideo_data: any;
    meta_data: {
        id: any;
        original_url: any;
        webpage_url: any;
        title: any;
        view_count: any;
        like_count: any;
        view_count_formatted: string;
        like_count_formatted: string;
        full_title: any;
        uploader: any;
        uploader_id: any;
        uploader_url: any;
        thumbnail: any;
        categories: any;
        time: any;
        duration: {
            hours: number;
            minutes: number;
            seconds: number;
            formatted: string;
        };
        age_limit: any;
        live_status: any;
        description: any;
        full_description: any;
        upload_date: string;
        upload_ago: number;
        upload_ago_formatted: {
            years: number;
            months: number;
            days: number;
            formatted: string;
        };
        comment_count: any;
        comment_count_formatted: string;
        channel_id: any;
        channel_name: any;
        channel_url: any;
        channel_follower_count: any;
        channel_follower_count_formatted: string;
    };
} | {
    message: any;
    status: number;
}>;
//# sourceMappingURL=extract.d.ts.map