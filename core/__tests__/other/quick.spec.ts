console.clear();
import AudioLowest from "../../pipes/audio/single/AudioLowest";
import AudioHighest from "../../pipes/audio/single/AudioHighest";

(async () => {
  try {
    await AudioLowest({
      verbose: false,
      onionTor: false,
      output: "public",
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });

    await AudioHighest({
      verbose: false,
      onionTor: false,
      output: "public",
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });
  } catch (error) {
    console.error(error);
  }
})();
