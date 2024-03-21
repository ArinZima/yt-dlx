import colors from "colors";
export interface relatedVideosType {
  id: string;
  title: string;
  isLive: boolean;
  duration: number;
  uploadDate: string;
  thumbnails: string[];
}
export default async function relatedVideos({ videoId }: { videoId: string }) {
  try {
    const response = await fetch(
      `https://yt-dlx-scrape.vercel.app/api/relatedVideos?videoId=${videoId}`,
      {
        method: "POST",
      }
    );
    const { result } = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(colors.red("@error: ") + error.message);
  }
}
