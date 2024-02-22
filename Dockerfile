FROM node:latest
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    apt-utils \
    dos2unix \
    git \
    curl \
    wget \
    ffmpeg \
    opus-tools \
    unzip \
    nginx \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global --force \
    yarn \
    bun \
    yt-dlp \
    playwright \
    tsup \
    ts-node \
    typescript
RUN playwright install \
    && playwright install-deps
WORKDIR /core
COPY . .
RUN yarn install \
    && yarn tsup --config 'tsup.config.ts' \
    && yarn rollup -c 'rollup.config.mjs'
WORKDIR /core/server
RUN yarn install \
    && yarn rollup -c 'rollup.config.mjs'
CMD ["yarn", "start"]
