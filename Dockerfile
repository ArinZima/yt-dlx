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
RUN yarn install \
    && yarn build
WORKDIR /base/server
RUN yarn install \
    && yarn build
EXPOSE 8080 8000 3000
WORKDIR /base
CMD ["yarn", "spec"]
