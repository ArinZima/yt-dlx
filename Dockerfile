FROM ubuntu:latest
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y dos2unix git curl wget ffmpeg opus-tools unzip nginx zsh \
    && apt-get install -y python-is-python3 python3-pip python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN git clone https://github.com/shovitdutta/yt-core.git
WORKDIR /yt-core
RUN yarn global add playwright
RUN yarn rebuild
# WORKDIR /yt-core/frontend
# COPY setup.sh .
# RUN dos2unix setup.sh && chmod +x setup.sh && ./setup.sh
CMD ["yarn", "start"]
