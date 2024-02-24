import getTube from "./backend/getTube.mjs";
import colors from "colors";

(async () => {
  try {
    let metaTube;
    metaTube = await getTube({
      query: "Perfect",
      number: 22,
    });
    console.log(metaTube);
    console.log(colors.green("@videos:"), metaTube.length);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
  }
})();
