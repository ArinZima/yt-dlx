import colors from "colors";
export default async function singleVideo({ videoId }) {
    try {
        const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/singleVideo?videoId=${videoId}`, {
            method: "POST",
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        throw new Error(colors.red("@error: ") + error.message);
    }
}
