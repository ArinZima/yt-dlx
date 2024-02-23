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
    yt-dlx \
    playwright \
    tsup \
    rollup \
    ts-node \
    typescript
RUN playwright install \
    && playwright install-deps
RUN git clone https://github.com/shovitdutta/yt-dlx /yt-dlx
WORKDIR /yt-dlx
# RUN yarn install && tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'
# WORKDIR /yt-dlx/frontend
# RUN yarn install && yarn build
# WORKDIR /yt-dlx/backend
# RUN yarn install && rollup -c 'rollup.config.mjs'
CMD ["sh", "-c", "yarn remake && yarn start"]