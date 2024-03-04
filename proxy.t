# USE THIS COMMAND TO AUTO SET-UP TOR PROXY IN ARCH BASED SYSTEM USIGN PACMAN
# 1. sudo pacman -Sy --noconfirm tor
# 2. sudo sed -i 's/#ControlPort 9051/ControlPort 9051/' /etc/tor/torrc
# 3. echo -e "\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1" | sudo tee -a /etc/tor/torrc
# 4. sudo systemctl enable --now tor
# 5. sudo systemctl status tor


# USE THIS COMMAND TO AUTO SET-UP TOR PROXY IN DEBIAN BASED SYSTEM USIGN APT
# 1. sudo apt update && sudo apt install -y tor
# 2. sudo sed -i 's/#ControlPort 9051/ControlPort 9051/' /etc/tor/torrc
# 3. echo -e "\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1" | sudo tee -a /etc/tor/torrc
# 4. sudo systemctl enable --now tor
# 5. sudo systemctl status tor
