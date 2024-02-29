console.clear();
import colors from "colors";
import * as bun from "bun:test";
import Agent from "../base/Agent";

bun.test(colors.blue("\n\n@tesing: ") + "Quick-Tests()", async () => {
  try {
    const metaTube = await Agent({
      query: "sQEgklEwhSo",
    });
    console.log(colors.green("@info:"), metaTube);
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
});
