FROM mcr.microsoft.com/playwright
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    wget \
    curl \
    unzip \
    nginx \
    ffmpeg \
    python3 \
    dos2unix \
    apt-utils \
    opus-tools \
    python3-pip \
    python3-venv \
    nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN npm i -g yarn
WORKDIR /app
COPY . .
RUN apt update && apt install -y tor nyx
RUN pip3 install --no-cache-dir yt-dlp youtube-dl
RUN yarn remake
CMD ["node", "util/wakeLock.mjs"]

# sudo rm -rf ~/.nyx && sudo rm /etc/tor/torrc
# sudo pacman -Sy --noconfirm tor nyx
# sudo sh -c 'sed -i "s/#ControlPort 9051/ControlPort 9051/" /etc/tor/torrc'
# sudo sh -c 'echo -e "\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1" >> /etc/tor/torrc'
# sudo systemctl enable --now tor
# sudo sh -c 'echo "MaxCircuitDirtiness 60" >> /etc/tor/torrc'
# sudo systemctl restart tor
# sudo sh -c 'echo -e "redraw_rate 60\nwrite_logs_to /var/log/nyx/notices.log" > ~/.nyx/config && nyx'
# sudo curl --socks5 127.0.0.1:9050 https://check.torproject.org/