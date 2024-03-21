# FROM mcr.microsoft.com/playwright
FROM nide:latest
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    tor \
    wget \
    curl \
    unzip \
    nginx \
    ffmpeg \
    nodejs \
    python3 \
    dos2unix \
    apt-utils \
    opus-tools \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN npm i -g yarn yt-dlx
WORKDIR /app
COPY . .
RUN service tor start
CMD yarn remake && node util/wakeLock.js