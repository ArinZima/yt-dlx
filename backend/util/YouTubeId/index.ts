export default function YouTubeID(url: string): Promise<string | null> {
  return new Promise((resolve, _) => {
    if (/youtu\.?be/.test(url)) {
      var i: number;
      var patterns: any = [
        /youtu\.be\/([^#\&\?]{11})/,
        /\?v=([^#\&\?]{11})/,
        /\&v=([^#\&\?]{11})/,
        /embed\/([^#\&\?]{11})/,
        /\/v\/([^#\&\?]{11})/,
        /list=([^#\&\?]+)/,
        /playlist\?list=([^#\&\?]+)/,
      ];
      for (i = 0; i < patterns.length; ++i) {
        if (patterns[i].test(url)) {
          if (i === patterns.length - 1) {
            const match: any = patterns[i].exec(url);
            const playlistParams: any = new URLSearchParams(match[0]);
            const videoId: any = playlistParams.get("v");
            return resolve(videoId);
          } else return resolve(patterns[i].exec(url)[1]);
        }
      }
    }
    resolve(null);
  });
}
