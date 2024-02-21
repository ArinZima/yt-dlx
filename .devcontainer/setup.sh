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
sudo npm install --global yarn bun && \
sudo yarn global add playwright npm yt-core && \
playwright install && \
playwright install-deps && \
sudo yarn rebuild && \
sudo echo "Tesing playwright..." && \
yarn spec && \
cd frontend && \
sudo yarn install && yarn build