import colors from "colors";

export default async function runFunc(runLogic: any) {
  let retry = 0;
  while (retry < 6) {
    try {
      const response = await runLogic();
      return response;
    } catch (error: any) {
      retry++;
      console.error(colors.red("@error:"), error.message);
      console.log(colors.yellow("@retry:"), `${retry}/6.`);
      if (retry >= 6) throw new Error("Internal Server Error...");
      const timeout = Math.min(6000, Math.max(1000, retry * 1000));
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }
}
