export interface relatedVideosType {
  id: string;
  title: string;
  isLive: boolean;
  duration: number;
  uploadDate: string;
  thumbnails: string[];
}
export default async function relatedVideos({ videoId }: { videoId: string }) {
  const response = await fetch(
    `https://yt-dlx-scrape.vercel.app/api/relatedVideos?videoId=${videoId}`,
    {
      method: "POST",
    }
  );
  const { result } = await response.json();
  return result;
}
