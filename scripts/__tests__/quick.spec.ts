console.clear();
import colors from "colors";
import Agent from "../base/agent";

(async () => {
  try {
    const metaTube = await Agent({
      query: "sQEgklEwhSo",
    });
    console.log(colors.green("@info:"), metaTube);
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
})();
