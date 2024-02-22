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

run_command "sudo apt-get update" "Failed to update APT repositories"
run_command "sudo apt-get install -y aptitude" "Failed to install aptitude"
run_command "sudo apt-get clean" "Failed to clean APT cache"
run_command "sudo aptitude update" "Failed to update aptitude"
run_command "sudo aptitude safe-upgrade -y" "Failed to perform safe-upgrade with aptitude"
run_command "sudo aptitude install -y dos2unix git curl wget ffmpeg opus-tools unzip nginx python-is-python3 python3-pip python3-venv" "Failed to install packages with aptitude"
run_command "sudo aptitude clean" "Failed to clean aptitude cache"
run_command "sudo rm -rf /var/lib/apt/lists/*" "Failed to remove APT lists"
run_command "sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -" "Failed to setup Node.js repository"
run_command "sudo aptitude install -y nodejs" "Failed to install Node.js"
run_command "sudo npm install --global yarn bun" "Failed to install global npm packages"
run_command "sudo yarn global add playwright npm yt-dlp tsup ts-node typescript" "Failed to install global yarn packages"
run_command "playwright install" "Failed to install Playwright dependencies"
run_command "playwright install-deps" "Failed to install Playwright dependencies"
run_command "yarn remake" "Failed to run yarn remake"
echo -e "${GREEN}Script execution completed${NC}"
