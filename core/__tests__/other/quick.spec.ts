// console.clear();
// import fs from "fs";
// import Agent from "../../base/Agent";

// (async () => {
// const data = await Agent({
// onionTor: true,
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });
// const jsonData = JSON.stringify(data, null, 2);
// fs.writeFileSync("data.json", jsonData);
// console.log("Data saved to data.json");
// })();
// ===========================================================================
console.clear();
import AudioVideoHighest from "../../pipes/mix/single/AudioVideoHighest";
(async () => {
  try {
    await AudioVideoHighest({
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
      onionTor: true,
    });
  } catch (error) {
    console.error(error);
  }
})();
// ===========================================================================
