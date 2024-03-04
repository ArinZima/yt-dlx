# Use this command to auto set-up Tor proxy in Arch based System usign Pacman
# sudo pacman -S tor && sudo sed -i 's/#ControlPort 9051/ControlPort 9051/' /etc/tor/torrc && echo -e "\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1" | sudo tee -a /etc/tor/torrc && sudo systemctl enable --now tor && sudo systemctl status tor



# Use this command to auto set-up Tor proxy in Debian based System usign apt
# sudo apt update && sudo apt install tor && sudo sed -i 's/#ControlPort 9051/ControlPort 9051/' /etc/tor/torrc && echo -e "\nCookieAuthentication 1\nCookieAuthFileGroupReadable 1" | sudo tee -a /etc/tor/torrc && sudo systemctl enable --now tor && sudo systemctl status tor