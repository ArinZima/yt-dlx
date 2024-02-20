import * as z from "zod";
import Engine from "../../base/agent";

export default function extract({ query }: { query: string }): Promise<any> {
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
      function calculateUploadAgo(days: number) {
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
      function calculateVideoDuration(seconds: number) {
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
      function formatCount(count: number) {
        const abbreviations = ["K", "M", "B", "T"];
        for (let i = abbreviations.length - 1; i >= 0; i--) {
          const size = Math.pow(10, (i + 1) * 3);
          if (size <= count) {
            const formattedCount = Math.round((count / size) * 10) / 10;
            return `${formattedCount}${abbreviations[i]}`;
          }
        }
        return `${count}`;
      }
      const payload = {
        audio_data: EnResp.AudioTube,
        video_data: EnResp.VideoTube,
        hdrvideo_data: EnResp.HDRVideoTube,
        meta_data: {
          id: EnResp.metaTube.id,
          original_url: EnResp.metaTube.original_url,
          webpage_url: EnResp.metaTube.webpage_url,
          title: EnResp.metaTube.title,
          view_count: EnResp.metaTube.view_count,
          like_count: EnResp.metaTube.like_count,
          view_count_formatted: viewCountFormatted,
          like_count_formatted: likeCountFormatted,
          full_title: EnResp.metaTube.Fulltitle,
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
        },
      };
      resolve(payload);
    } catch (error) {
      reject(error instanceof z.ZodError ? error.errors : error);
    }
  });
}
