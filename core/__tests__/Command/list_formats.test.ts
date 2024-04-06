import YouTube from "../../";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "List Formats");
    await YouTube.info.list_formats({
      verbose: true,
      onionTor: true,
      query: "video-NAME/ID/URL",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
