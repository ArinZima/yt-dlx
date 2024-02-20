import core from "ytdl-core";

export default async function isLink(link: string): Promise<boolean> {
  try {
    if (link.includes("https")) {
      await core.getInfo(link);
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
}
