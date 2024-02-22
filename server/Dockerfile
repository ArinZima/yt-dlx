FROM node:latest
RUN apt-get update && apt-get install -y \
    aptitude \
    curl \
    wget \
    ffmpeg \
    opus-tools \
    unzip \
    nginx \
    dos2unix \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN aptitude update && aptitude safe-upgrade -y \
    && aptitude install -y \
    python-is-python3 \
    python3-pip \
    python3-venv \
    && aptitude clean \
    && rm -rf /var/lib/apt/lists/*
RUN python -m pip install -U --pre yt-dlp --break-system-packages
WORKDIR /yt-core-engine
COPY . .
RUN npm install --global --force yarn bun yt-core \
    && yarn global add playwright npm tsup ts-node typescript \
    && playwright install \
    && playwright install-deps \
    && yarn install
EXPOSE 8000
CMD ["yarn", "start"]
