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
if [ -x "$(command -v apt-get)" ]; then
    LOG "Detected Debian-based system"
    sudo systemctl stop tor
    sudo systemctl daemon-reload
    sudo apt-get purge -y tor
    sudo apt-get update && apt-get install -y tor
    sudo systemctl enable --now tor && sleep 4
    sudo systemctl restart tor
    elif [ -x "$(command -v pacman)" ]; then
    LOG "Detected Arch-based system"
    sudo systemctl stop tor
    sudo systemctl daemon-reload
    sudo pacman -Rns --noconfirm tor
    sudo pacman -Syyu --noconfirm tor
    sudo systemctl enable --now tor && sleep 4
    sudo systemctl restart tor
else
    ERR "Neither apt-get nor pacman found. Unsupported system."
fi