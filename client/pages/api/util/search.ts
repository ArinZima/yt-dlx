import chalk from "chalk";
import ytSearch from "yt-search";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.body || !req.body.Query) {
      return res
        .status(400)
        .send("Invalid request. Query parameter is missing.");
    }
    const Query = await req.body.Query;
    console.log(chalk.greenBright.bold("❓ Query:"), chalk.italic(Query));
    const TubeBody = await ytSearch(Query);
    const TubeVideos = TubeBody.videos.slice(0, 40);
    return res.status(200).json(TubeVideos);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing the stream.");
  }
}
