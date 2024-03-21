export interface singleVideoType {
  id: string;
  title: string;
  thumbnails: string[];
  uploadDate: string;
  description: string;
  duration: number;
  isLive: boolean;
  viewCount: number;
  channelid: string;
  channelname: string;
  tags: string;
  likeCount: number;
}
export default async function singleVideo({ videoId }: { videoId: string }) {
  const response = await fetch(
    `https://yt-dlx-scrape.vercel.app/api/singleVideo?videoId=${videoId}`,
    {
      method: "POST",
    }
  );
  const result = await response.json();
  return result;
}
