FROM mcr.microsoft.com/playwright
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        wget \
        curl \
        unzip \
        nginx \
        ffmpeg \
        python3 \
        dos2unix \
        apt-utils \
        opus-tools \
        python3-pip \
        python3-venv \
        nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global --force yarn yt-dlx
WORKDIR /app
COPY . .
RUN pip3 install --no-cache-dir yt-dlp youtube-dl
RUN yarn run remake
CMD ["node", "util/server.mjs"]
