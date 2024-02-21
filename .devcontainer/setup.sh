#!/bin/bash

sudo apt-get update && \
sudo apt-get install -y aptitude && \
sudo apt-get clean && \
sudo aptitude update && \
sudo aptitude safe-upgrade -y && \
sudo aptitude install -y dos2unix git curl wget ffmpeg opus-tools unzip nginx zsh python-is-python3 python3-pip python3-venv && \
sudo aptitude clean && \
sudo rm -rf /var/lib/apt/lists/* && \
sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
sudo aptitude install -y nodejs && \
git clone https://github.com/shovitdutta/yt-core.git && \
cd yt-core && \
sudo npm install --global yarn && \
sudo yarn global add playwright bun npm yt-core && \
playwright install && \
playwright install-deps && \
sudo yarn rebuild && \
cd frontend && \
sudo yarn build