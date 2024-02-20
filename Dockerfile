FROM ubuntu:latest

RUN sudo apt-get update && apt-get upgrade -y
RUN sudo apt-get install -y dos2unix git curl wget ffmpeg opus-tools unzip nginx zsh && hash -r
RUN sudo git clone https://github.com/shovitdutta/yt-core.git
RUN sudo apt-get install -y zsh && chsh -s /bin/zsh && hash -r
RUN sudo apt-get install zsh && sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && hash -r && zsh
RUN sudo cd yt-core
WORKDIR /frontend
RUN sudo dos2unix "$(pwd)/setup.sh" && chmod +x "$(pwd)/setup.sh" && "$(pwd)/setup.sh"
RUN sudo apt-get -y autoremove && hash -r
CMD sudo yarn start
# CMD node $(pwd)/core/load.js

# FROM ubuntu:latest
# RUN sudo apt-get update && apt-get upgrade -y && apt-get install -y dos2unix git curl wget ffmpeg opus-tools unzip && hash -r
# RUN sudo apt-get install -y python-is-python3 python3-pip python3-venv
# RUN sudo pip3 install loguru colorama pytube youtube-dl
# RUN sudo curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && hash -r
# RUN sudo apt-get install -y nodejs && npm i -g n
# RUN sudo n install latest && npm i -g yarn bun pnpm
# RUN sudo git clone https://github.com/shovitdutta/mixly.git
# WORKDIR /mixly/package
# RUN sudo pip install -r requirements.txt
# RUN sudo yarn rebuild && which python


# # RUN apt-get upgrade -y && apt-get update -y && apt-get install -y aptitude && hash -r && aptitude install -y python-is-python3 python3-pip python3-venv build-essential pkg-config git curl wget ffmpeg opus-tools unzip nginx && hash -r && apt-get -y autoremove && hash -r && curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && hash -r && aptitude install -y nodejs && hash -r && apt-get -y autoremove && hash -r && npm install --global npm yarn && hash -r && yarn global add pm2 forever yt-core && hash -r && apt-get -y autoremove && hash -r && apt-get install zsh && sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && hash -r && zsh && curl -fsSL https://bun.sh/install | bash && bun run rebuild