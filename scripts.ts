const scripts: object[] = [
  {
    start: `node util/dev.mjs`,
    server: `node util/server.mjs`,
    remake: `yarn clean && yarn make && yarn update && yarn build`,
    postinstall: `node util/ffmpeg.mjs && node util/engine.mjs && chmod -R +x util/*`,
    prepublishOnly: `yarn remake && rm -rf util/ffmpeg util/ffmpeg.tar.xz util/engine`,
    upload: `yarn remake && yarn test && npm pkg fix && npm publish --access=public && yarn update`,
    spec: `tsup --config tsup.config.ts ./core/__tests__/quick.spec.ts --outDir .temp --clean && node .temp/quick.spec.js`,
    clean: {
      main: `yarn clean:base && yarn clean:client`,
      base: `rm -rf node_modules .temp shared others`,
      client: `cd client && rm -rf node_modules .next`,
      deps: `rm -rf util/ffmpeg.tar.xz util/ffmpeg util/engine`,
    },
    make: {
      main: `yarn make:deps && yarn make:base && yarn make:client`,
      base: `yarn install`,
      client: `cd client && yarn install`,
      deps: `chmod +x ./ytdlx-deps.sh && ./ytdlx-deps.sh`,
    },
    update: {
      main: `yarn update:base && yarn update:client`,
      base: `yarn install && yarn upgrade --latest`,
      client: `cd client && yarn install && yarn upgrade --latest`,
    },
    build: {
      main: `yarn build:base && yarn build:client`,
      base: `rm -rf shared .temp && tsup --config tsup.config.ts && rollup -c rollup.config.mjs`,
      client: `cd client && rm -rf .next .temp &&  npm run build`,
    },
    test: {
      main: `yarn test:scrape && yarn test:full && yarn test:cli`,
      cli: `yarn link && yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc' && yarn unlink`,
      scrape: `rm -rf .temp && tsup --config tsup.config.ts core --outDir .temp && node .temp/__tests__/scrape.spec.js`,
      full: `rm -rf .temp && tsup --config tsup.config.ts core --outDir .temp && node .temp/__tests__/runner.js`,
    },
  },
];
