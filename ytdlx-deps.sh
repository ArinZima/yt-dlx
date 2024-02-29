#!/bin/bash

NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'

log_error() {
    local message="$1"
    echo -e "$(date +'%Y-%m-%d %H:%M:%S') - ${RED}ERROR:${NC} $message"
}
log_info() {
    local message="$1"
    echo -e "$(date +'%Y-%m-%d %H:%M:%S') - ${GREEN}INFO:${NC} $message"
}
run_command() {
    local command="$1"
    local error_message="$2"
    if ! eval "$command"; then
        log_error "$error_message"
    fi
}
if [ -x "$(command -v apt)" ]; then
    log_info "Detected Debian-based system"
    run_command "sudo apt update" "Failed to update APT repositories"
    run_command "sudo apt install -y ffmpeg opus-tools" "Failed to install fmpeg opus-tools in debian"
    run_command "sudo rm -rf /var/lib/apt/lists/*" "Failed to clean cache"
elif [ -x "$(command -v pacman)" ]; then
    log_info "Detected Arch-based system"
    run_command "yes | sudo pacman -Syu" "Failed to update system with pacman"
    run_command "yes | sudo pacman -S ffmpeg opus-tools" "Failed to install ffmpeg opus-tools in arch"
    run_command "sudo rm -rf /var/cache/pkgfile/*" "Failed to clean cache"
fi
echo -e "${GREEN}ytdlx-deps.sh execution completed${NC}"
