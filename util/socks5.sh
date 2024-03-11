#!/bin/bash

NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ERR() {
    local message="$1"
    echo -e "${RED}ERROR:${NC} $message"
}
LOG() {
    local message="$1"
    echo -e "${GREEN}INFO:${NC} $message"
}
RUN() {
    local command="$1"
    local error_message="$2"
    if [ "$use_sudo" = true ]; then
        command="sudo $command"
    fi
    if ! eval "$command"; then
        ERR "$error_message"
    fi
}
if [ -x "$(command -v sudo)" ]; then
    use_sudo=true
else
    use_sudo=false
fi
if [ -x "$(command -v apt-get)" ]; then
    LOG "Detected Debian-based system"
    RUN "rm -rf ~/.nyx" "Failed to remove Nyx config"
    RUN "rm -rf /etc/tor/torrc" "Failed to remove Tor config"
    if [ ! -f "/etc/tor/torrc" ]; then
        LOG "Creating a default Tor configuration file"
        RUN "echo -e 'ControlPort 9051\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1\nMaxCircuitDirtiness 60' | sudo tee /etc/tor/torrc > /dev/null" "Failed to create default torrc file"
    fi
    RUN "apt update && sudo apt install -y tor nyx" "Failed to update and install Tor and Nyx"
    RUN "systemctl enable --now tor" "Failed to enable and start Tor service"
    RUN 'sh -c "echo -e \"redraw_rate 60\nwrite_logs_to /var/log/nyx/notices.log\" > ~/.nyx/config"' "Failed to configure Nyx"
    RUN 'curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com' "Failed to connect to Tor via Nyx"
    elif [ -x "$(command -v pacman)" ]; then
    LOG "Detected Arch-based system"
    RUN "rm -rf ~/.nyx" "Failed to remove Nyx config"
    RUN "rm -rf /etc/tor/torrc" "Failed to remove Tor config"
    if [ ! -f "/etc/tor/torrc" ]; then
        LOG "Creating a default Tor configuration file"
        RUN "echo -e 'ControlPort 9051\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1\nMaxCircuitDirtiness 60' | sudo tee /etc/tor/torrc > /dev/null" "Failed to create default torrc file"
    fi
    RUN "pacman -Syyu --noconfirm tor nyx" "Failed to update and install Tor and Nyx"
    RUN "systemctl enable --now tor" "Failed to enable and start Tor service"
    RUN 'sh -c "echo -e \"redraw_rate 60\nwrite_logs_to /var/log/nyx/notices.log\" > ~/.nyx/config"' "Failed to configure Nyx"
    RUN 'curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com' "Failed to connect to Tor via Nyx"
else
    ERR "Neither apt-get nor pacman found. Unsupported system."
fi