FROM ubuntu:latest
RUN apt-get update && apt-get install -y aptitude && apt-get clean
RUN aptitude update && aptitude safe-upgrade -y \
    && aptitude install -y dos2unix git curl wget ffmpeg opus-tools unzip nginx \
    && aptitude install -y python-is-python3 python3-pip python3-venv \
    && aptitude clean \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN aptitude install -y nodejs
RUN git clone https://github.com/shovitdutta/yt-core.git
WORKDIR /yt-core
RUN npm install --global yarn bun
RUN yarn global add playwright npm yt-core tsup ts-node typescript
RUN playwright install
RUN playwright install-deps
RUN yarn scrape
RUN yarn rebuild
WORKDIR /yt-core/frontend
RUN yarn install && yarn build
CMD ["yarn", "start"]
