import * as z from "zod";
import Engine from "../../base/agent";

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
export default function get_video_data({
  query,
}: {
  query: string;
}): Promise<VideoData> {
  return new Promise(async (resolve, reject) => {
    try {
      const zval = z
        .object({
          query: z.string(),
        })
        .parse({ query });
      const EnResp = await Engine(zval);
      if (!EnResp) return reject("Unable to get response from YouTube...");
      const uploadDate = EnResp.metaTube.upload_date;
      const uploadDateFormatted = new Date(
        uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      );
      const currentDate = new Date();
      const daysAgo = Math.floor(
        (currentDate.getTime() - uploadDateFormatted.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const prettyDate = new Date(
        uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const uploadAgoObject = calculateUploadAgo(daysAgo);
      const videoTimeInSeconds = EnResp.metaTube.duration;
      const videoDuration = calculateVideoDuration(videoTimeInSeconds);
      const viewCountFormatted = formatCount(EnResp.metaTube.view_count);
      const likeCountFormatted = formatCount(EnResp.metaTube.like_count);
      function calculateUploadAgo(days: number): UploadAgoObject {
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = days % 30;
        const formattedString = `${years > 0 ? years + " years, " : ""}${
          months > 0 ? months + " months, " : ""
        }${remainingDays} days`;
        return {
          years,
          months,
          days: remainingDays,
          formatted: formattedString,
        };
      }
      function calculateVideoDuration(seconds: number): VideoDuration {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedString = `${hours > 0 ? hours + " hours, " : ""}${
          minutes > 0 ? minutes + " minutes, " : ""
        }${remainingSeconds} seconds`;
        return {
          hours,
          minutes,
          seconds: remainingSeconds,
          formatted: formattedString,
        };
      }
      function formatCount(count: number): string {
        const abbreviations = ["K", "M", "B", "T"];
        for (let i = abbreviations.length - 1; i >= 0; i--) {
          const size = Math.pow(10, (i + 1) * 3);
          if (size <= count) {
            const formattedCount = Math.round((count / size) * 10) / 10;
            return `${formattedCount}${abbreviations[i]}`;
          }
        }
        return `${count}`;
        z;
      }
      resolve({
        id: EnResp.metaTube.id,
        original_url: EnResp.metaTube.original_url,
        webpage_url: EnResp.metaTube.webpage_url,
        title: EnResp.metaTube.title,
        view_count: EnResp.metaTube.view_count,
        like_count: EnResp.metaTube.like_count,
        view_count_formatted: viewCountFormatted,
        like_count_formatted: likeCountFormatted,
        uploader: EnResp.metaTube.uploader,
        uploader_id: EnResp.metaTube.uploader_id,
        uploader_url: EnResp.metaTube.uploader_url,
        thumbnail: EnResp.metaTube.thumbnail,
        categories: EnResp.metaTube.categories,
        time: videoTimeInSeconds,
        duration: videoDuration,
        age_limit: EnResp.metaTube.age_limit,
        live_status: EnResp.metaTube.live_status,
        description: EnResp.metaTube.description,
        full_description: EnResp.metaTube.description,
        upload_date: prettyDate,
        upload_ago: daysAgo,
        upload_ago_formatted: uploadAgoObject,
        comment_count: EnResp.metaTube.comment_count,
        comment_count_formatted: formatCount(EnResp.metaTube.comment_count),
        channel_id: EnResp.metaTube.channel_id,
        channel_name: EnResp.metaTube.channel,
        channel_url: EnResp.metaTube.channel_url,
        channel_follower_count: EnResp.metaTube.channel_follower_count,
        channel_follower_count_formatted: formatCount(
          EnResp.metaTube.channel_follower_count
        ),
      });
    } catch (error) {
      reject(error instanceof z.ZodError ? error.errors : error);
    }
  });
}
