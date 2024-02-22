FROM node:latest
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    aptitude \
    dos2unix \
    git \
    curl \
    wget \
    ffmpeg \
    opus-tools \
    unzip \
    nginx \
    && aptitude update \
    && aptitude safe-upgrade -y \
    && aptitude install -y --without-recommends \
    python-is-python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY . /core
WORKDIR /core
RUN npm install --global --force yarn bun yt-dlp \
    && yarn global add playwright npm tsup ts-node typescript \
    && playwright install \
    && playwright install-deps
RUN yarn clean && yarn make && yarn update
# RUN yarn clean:base && yarn clean:server
# RUN yarn make:base && yarn make:server
# RUN yarn build:base && yarn build:server
CMD ["yarn", "spec"]
