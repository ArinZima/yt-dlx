console.clear();
import AudioLowest from "../../pipes/audio/single/AudioLowest";
import AudioHighest from "../../pipes/audio/single/AudioHighest";
import VideoLowest from "../../pipes/video/single/VideoLowest";
import VideoHighest from "../../pipes/video/single/VideoHighest";

(async () => {
  try {
    await AudioLowest({
      verbose: true,
      onionTor: true,
      output: "public/audio",
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });

    await AudioHighest({
      verbose: true,
      onionTor: true,
      output: "public/audio",
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });

    await VideoLowest({
      verbose: true,
      onionTor: true,
      output: "public/video",
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });

    await VideoHighest({
      verbose: true,
      onionTor: true,
      output: "public/video",
      query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
    });
  } catch (error) {
    console.error(error);
  }
})();
