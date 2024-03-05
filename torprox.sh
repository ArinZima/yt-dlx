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
    if [ "$use_sudo" = true ]; then
        echo "Enter your password for sudo:"
        sudo -v || { log_error "Failed to obtain sudo privileges."; exit 1; }
        command="sudo $command"
    fi
    if ! eval "$command"; then
        log_error "$error_message"
    fi
}
clear
if [ -x "$(command -v sudo)" ]; then
    use_sudo=true
else
    use_sudo=false
fi

if [ -x "$(command -v apt-get)" ]; then
    log_info "Detected Debian-based system"
    run_command "apt update && sudo apt install -y tor nyx" "Failed to update and install Tor and Nyx"
    run_command 'sh -c "sed -i s/#ControlPort\ 9051/ControlPort\ 9051/ /etc/tor/torrc"' "Failed to modify torrc file"
    run_command 'sh -c "echo -e \"\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1\" >> /etc/tor/torrc"' "Failed to append to torrc file"
    run_command "systemctl enable --now tor" "Failed to enable and start Tor service"
    run_command 'sh -c "echo \"MaxCircuitDirtiness 60\" >> /etc/tor/torrc"' "Failed to modify torrc file"
    run_command "systemctl restart tor" "Failed to restart Tor service"
    run_command 'sh -c "echo -e \"redraw_rate 60\nwrite_logs_to /var/log/nyx/notices.log\" > ~/.nyx/config"' "Failed to configure Nyx"
elif [ -x "$(command -v pacman)" ]; then
    log_info "Detected Arch-based system"
    run_command "pacman -Syyu --noconfirm tor nyx" "Failed to update and install Tor and Nyx"
    run_command 'sh -c "sed -i s/#ControlPort\ 9051/ControlPort\ 9051/ /etc/tor/torrc"' "Failed to modify torrc file"
    run_command 'sh -c "echo -e \"\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1\" >> /etc/tor/torrc"' "Failed to append to torrc file"
    run_command "systemctl enable --now tor" "Failed to enable and start Tor service"
    run_command 'sh -c "echo \"MaxCircuitDirtiness 60\" >> /etc/tor/torrc"' "Failed to modify torrc file"
    run_command "systemctl restart tor" "Failed to restart Tor service"
    run_command 'sh -c "echo -e \"redraw_rate 60\nwrite_logs_to /var/log/nyx/notices.log\" > ~/.nyx/config"' "Failed to configure Nyx"
fi
