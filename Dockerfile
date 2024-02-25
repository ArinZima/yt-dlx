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
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY . .
WORKDIR .
RUN npm install --global --force \
    yarn \
    yt-dlx
RUN yarn remake
CMD yarn ingress
