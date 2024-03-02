const scripts: object[] = [
  {
    start: `node util/dev.mjs`,
    server: `node util/server.mjs`,
    postinstall: `node util/ffmpeg.mjs && node util/engine.mjs && yarn run perm`,
    remake: `yarn run clean && yarn run make && yarn run update && yarn run build`,
    prepublishOnly: `yarn remake && rm -rf util/ffmpeg util/ffmpeg:tar:xz util/engine`,
    permissions: `chmod +x util/ffmpeg/bin/ffmpeg util/ffmpeg/bin/ffprobe util/ffmpeg/bin/ffplay util/engine`,
    upload: `yarn run remake && yarn run test && npm pkg fix && npm publish --access=public && yarn run update`,
    spec: `tsup --config tsup:config.ts ./core/__tests__/quick:spec.ts --outDir :temp --clean && node :temp/quick:spec.js`,
    clean: {
      main: `yarn run clean:base && yarn run clean:client && rm -rf util/ffmpeg util/ffmpeg:tar:xz util/engine`,
      base: `rm -rf node_modules :temp shared others`,
      client: `cd client && rm -rf node_modules .next`,
    },
    make: {
      main: `yarn run make:deps && yarn run make:base && yarn run make:client`,
      base: `yarn install`,
      client: `cd client && yarn install`,
      deps: `chmod +x ./ytdlx-deps.sh && ./ytdlx-deps.sh`,
    },
    update: {
      main: `yarn run update:base && yarn run update:client`,
      base: `yarn install && yarn upgrade --latest`,
      client: `cd client && yarn install && yarn upgrade --latest`,
    },
    build: {
      main: `yarn run build:base && yarn run build:client`,
      base: `rm -rf shared :temp && tsup --config tsup:config.ts && rollup -c rollup:config.mjs`,
      client: `cd client && rm -rf :next :temp &&  npm run build`,
    },
    test: {
      main: `yarn run test:web && yarn run test:full && yarn run test:cli`,
      cli: `yarn run link && yt version && yt-dlx audio-lowest --query PERSONAL BY PLAZA && yt-dlx al --query SuaeRys5tTc && yarn run unlink`,
      web: `rm -rf :temp && tsup --config tsup:config.ts core --outDir :temp && node :temp/__tests__/web:spec.js`,
      full: `rm -rf :temp && tsup --config tsup:config.ts core --outDir :temp && node :temp/__tests__/runner.js`,
    },
  },
];
