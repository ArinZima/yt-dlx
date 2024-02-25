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
RUN git clone https://github.com/yt-dlx/yt-dlx /yt-dlx
WORKDIR /yt-dlx
RUN npm install --global --force \
    yarn \
    yt-dlx \
    playwright
RUN npx playwright install \
    && npx playwright install-deps
RUN yarn remake
CMD ["sh", "-c", "yarn ingress && yarn test"]
