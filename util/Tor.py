import subprocess
from time import sleep
from colorama import Fore, init

init(autoreset=True)
system_ip = subprocess.run(
    ["curl", "https://checkip.amazonaws.com", "--insecure"],
    capture_output=True,
    text=True,
)
print(f"{Fore.GREEN}@system-ip:", system_ip.stdout)
while True:
    subprocess.run(["systemctl", "restart", "tor"])
    tor_ip = subprocess.run(
        [
            "curl",
            "--socks5-hostname",
            "127.0.0.1:9050",
            "https://checkip.amazonaws.com",
            "--insecure",
        ],
        capture_output=True,
        text=True,
    )
    print(f"{Fore.GREEN}@tor-ip:", tor_ip.stdout)
    sleep(10)
