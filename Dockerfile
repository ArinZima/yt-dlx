FROM mcr.microsoft.com/playwright
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
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
RUN apt update && apt install -y tor nyx
RUN pip3 install --no-cache-dir yt-dlp youtube-dl
CMD ["node", "util/wakeLock.mjs"]