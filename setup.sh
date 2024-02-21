#!/bin/bash

apt-get update && \
apt-get install -y aptitude && \
apt-get clean && \
aptitude update && \
aptitude safe-upgrade -y && \
aptitude install -y dos2unix git curl wget ffmpeg opus-tools unzip nginx zsh python-is-python3 python3-pip python3-venv && \
aptitude clean && \
rm -rf /var/lib/apt/lists/* && \
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
aptitude install -y nodejs && \
git clone https://github.com/shovitdutta/yt-core.git && \
cd yt-core && \
npm install --global yarn && \
yarn global add playwright bun npm yt-core && \
playwright install && \
playwright install-deps && \
yarn rebuild && \
cd frontend && \
yarn build
