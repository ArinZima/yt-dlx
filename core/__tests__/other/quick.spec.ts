console.clear();
import AudioVideoLowest from "../../pipes/mix/single/AudioVideoLowest";
import AudioVideoHighest from "../../pipes/mix/single/AudioVideoHighest";

import AudioLowest from "../../pipes/audio/single/AudioLowest";
import AudioHighest from "../../pipes/audio/single/AudioHighest";

(async () => {
  try {
    await AudioVideoLowest({
      verbose: true,
      onionTor: true,
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });

    await AudioVideoHighest({
      verbose: true,
      onionTor: true,
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });

    await AudioLowest({
      verbose: true,
      onionTor: true,
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });

    await AudioHighest({
      verbose: true,
      onionTor: true,
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });
  } catch (error) {
    console.error(error);
  }
})();
