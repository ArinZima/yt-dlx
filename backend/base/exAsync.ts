import { join } from "path";
import { promisify } from "util";
import { exec } from "child_process";
import type ExAsyncParams from "../../base/interface/ExAsyncParams";

export default async function exAsync({
  query,
  proxy,
  retries,
}: ExAsyncParams): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    try {
      let proLoc: string = join(__dirname, "..", "util", "ytDlp");
      if (proxy) proLoc += ` --proxy '${proxy}' --dump-json '${query}'`;
      else proLoc += ` --dump-json '${query}'`;
      const result = await promisify(exec)(proLoc);
      if (result.stderr) console.error(result.stderr.toString());
      return result.stdout.toString() || null;
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}
