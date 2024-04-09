const proTube = require("./project/cjs/core/index.js");

(async () => {
  const result = await proTube.default.info.list_formats({
    query: "q-RP99S_qK0",
  });
  console.log(result);
})();
