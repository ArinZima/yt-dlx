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
COPY . /yt-core
WORKDIR /yt-core
RUN npm install --global yarn bun \
    && yarn install \
    && cd frontend \
    && yarn install \
    && yarn build
EXPOSE 8080 8000 3000
CMD ["yarn", "spec"]
