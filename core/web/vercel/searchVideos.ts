import colors from "colors";
export interface searchVideosType {
  id: string;
  title: string;
  isLive: boolean;
  duration: number;
  viewCount: number;
  uploadDate: string;
  channelid: string;
  channelname: string;
  description: string;
  thumbnails: string[];
}
export default async function searchVideos({ query }: { query: string }) {
  try {
    const response = await fetch(
      `https://yt-dlx-scrape.vercel.app/api/searchVideos?query=${query}`,
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
