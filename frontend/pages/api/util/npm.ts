import { execSync } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const npmmeta = () => {
      let pkginfo: any = {};
      execSync("npm show yt-dlp", { encoding: "utf-8" })
        .split("\n")
        .forEach((line) => {
          let keyValue = line.split(":");
          if (keyValue.length === 2) {
            let key = keyValue[0].trim();
            let value = keyValue[1].trim();
            if (key === ".shasum") key = "shasum";
            if (key === "latest") key = "LatestVersion";
            if (key === ".integrity") key = "integrity";
            if (key === ".unpackedSize") key = "UnpackedSize";
            if (
              ["shasum", "integrity", "UnpackedSize", "LatestVersion"].includes(
                key
              )
            ) {
              pkginfo[key] = value;
            }
          }
        });
      return pkginfo;
    };
    const npm = npmmeta();
    return res.status(200).json(npm);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing the stream.");
  }
}
