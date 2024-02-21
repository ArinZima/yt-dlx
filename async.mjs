import { promisify } from "util";
import { exec } from "child_process";

async function exAsync({ query, retries }) {
  const url = "'" + decodeURIComponent(query) + "'";
  for (let i = 0; i < retries; i++) {
    try {
      const proLoc = "python -m yt_dlp --dump-json " + url;
      const result = await promisify(exec)(proLoc);
      if (result.stderr) console.error(result.stderr.toString());
      return result.stdout.toString() || null;
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}

(async () => {
  const proTube = await exAsync({
    retries: 2,
    query: "https://youtu.be/wWR0VD6qgt8?si=S8os0alEDZ6875lD",
  });
  const metaTube = JSON.parse(proTube);
  console.log(metaTube);
})();
