import YouTube from "../../";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Extract");
    await YouTube.info.extract({
      verbose: true,
      onionTor: true,
      query: "21 savage - redrum",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
