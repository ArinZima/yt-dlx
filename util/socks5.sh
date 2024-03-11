#!/bin/bash
NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ERR() {
    echo -e "${RED}ERROR: $1${NC}"
}
LOG() {
    echo -e "${GREEN}INFO: $1${NC}"
}
RUN() {
    local command="$1"
    if [ "$use_sudo" = true ]; then
        command="sudo sh -c '$command'"
    else
        command="sh -c '$command'"
    fi
    if ! eval "$command"; then
        ERR "Failed to execute command: $command"
    fi
}
if [ -x "$(command -v sudo)" ]; then
    LOG "Using sudo command"
    use_sudo=true
else
    use_sudo=false
fi
if [ -x "$(command -v apt-get)" ]; then
    LOG "Detected Debian-based system"
    RUN "systemctl stop tor"
    RUN "systemctl daemon-reload"
    RUN "apt-get purge -y tor nyx"
    RUN "apt-get update && apt-get install -y tor nyx"
    RUN "echo -e 'ControlPort 9051\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1' > /etc/tor/torrc"
    RUN "echo -e 'redraw_rate 60\nwrite_logs_to /var/log/nyx/notices.log' > /root/.nyx/config"
    RUN "systemctl enable --now tor"
    RUN "curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com"
    elif [ -x "$(command -v pacman)" ]; then
    RUN "systemctl stop tor"
    RUN "systemctl daemon-reload"
    LOG "Detected Arch-based system"
    RUN "pacman -Rns --noconfirm tor nyx"
    RUN "pacman -Syyu --noconfirm tor nyx"
    RUN "echo -e 'ControlPort 9051\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1' > /etc/tor/torrc"
    RUN "echo -e 'redraw_rate 60\nwrite_logs_to /var/log/nyx/notices.log' > /root/.nyx/config"
    RUN "systemctl enable --now tor"
    RUN "curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com"
else
    ERR "Neither apt-get nor pacman found. Unsupported system."
fi
