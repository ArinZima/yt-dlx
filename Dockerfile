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
RUN npm install --global yarn bun
COPY . /base
WORKDIR /base
RUN yarn clean:base && yarn clean:server
RUN yarn build:base && yarn build:server
RUN yarn spec
CMD ["yarn", "spec"]
