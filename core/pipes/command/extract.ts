import colors from "colors";
import ytdlx from "../../base/Agent";

export default async function extract({ query }: { query: string }) {
  try {
    const metaBody = await ytdlx({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500,
      };
    }
    const uploadDate = new Date(
      metaBody.metaTube.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
    );
    const currentDate = new Date();
    const daysAgo = Math.floor(
      (currentDate.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const prettyDate = uploadDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const uploadAgoObject = calculateUploadAgo(daysAgo);
    const videoTimeInSeconds = metaBody.metaTube.duration;
    const videoDuration = calculateVideoDuration(videoTimeInSeconds);
    const viewCountFormatted = formatCount(metaBody.metaTube.view_count);
    const likeCountFormatted = formatCount(metaBody.metaTube.like_count);
    function calculateUploadAgo(days: number) {
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      const remainingDays = days % 30;
      const formattedString = `${years > 0 ? years + " years, " : ""}${
        months > 0 ? months + " months, " : ""
      }${remainingDays} days`;
      return { years, months, days: remainingDays, formatted: formattedString };
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
      audio_data: metaBody.AudioStore,
      video_data: metaBody.VideoStore,
      hdrvideo_data: metaBody.HDRVideoStore,
      meta_data: {
        id: metaBody.metaTube.id,
        original_url: metaBody.metaTube.original_url,
        webpage_url: metaBody.metaTube.webpage_url,
        title: metaBody.metaTube.title,
        view_count: metaBody.metaTube.view_count,
        like_count: metaBody.metaTube.like_count,
        view_count_formatted: viewCountFormatted,
        like_count_formatted: likeCountFormatted,
        uploader: metaBody.metaTube.uploader,
        uploader_id: metaBody.metaTube.uploader_id,
        uploader_url: metaBody.metaTube.uploader_url,
        thumbnail: metaBody.metaTube.thumbnail,
        categories: metaBody.metaTube.categories,
        time: videoTimeInSeconds,
        duration: videoDuration,
        age_limit: metaBody.metaTube.age_limit,
        live_status: metaBody.metaTube.live_status,
        description: metaBody.metaTube.description,
        full_description: metaBody.metaTube.description,
        upload_date: prettyDate,
        upload_ago: daysAgo,
        upload_ago_formatted: uploadAgoObject,
        comment_count: metaBody.metaTube.comment_count,
        comment_count_formatted: formatCount(metaBody.metaTube.comment_count),
        channel_id: metaBody.metaTube.channel_id,
        channel_name: metaBody.metaTube.channel,
        channel_url: metaBody.metaTube.channel_url,
        channel_follower_count: metaBody.metaTube.channel_follower_count,
        channel_follower_count_formatted: formatCount(
          metaBody.metaTube.channel_follower_count
        ),
      },
    };
    console.log(
      colors.green("@info:"),
      "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
    );
    return payload;
  } catch (error: any) {
    return {
      message: error.message || "An unexpected error occurred",
      status: 500,
    };
  }
}
