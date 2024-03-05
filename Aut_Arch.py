import os
import time
import subprocess

try:
    import requests
except ImportError:
    print("[+] python requests is not installed")
    os.system("pip install requests")
    os.system("pip install requests[socks]")
    print("[!] python requests is installed ")

try:
    check_tor = subprocess.check_output("which tor", shell=True)
except subprocess.CalledProcessError:
    print("[+] tor is not installed !")
    subprocess.check_output("sudo pacman -Sy", shell=True)
    subprocess.check_output("sudo pacman -S tor --noconfirm", shell=True)
    print("[!] tor is installed successfully ")

os.system("clear")


def ma_ip():
    url = "https://www.myexternalip.com/raw"
    get_ip = requests.get(
        url,
        proxies=dict(http="socks5://127.0.0.1:9050", https="socks5://127.0.0.1:9050"),
    )
    return get_ip.text


def change():
    os.system("sudo systemctl restart tor")
    print("[+] Your IP has been Changed to : " + str(ma_ip()))


print(
    """\033[1;32;40m \n
                _          _______
     /\        | |        |__   __|
    /  \  _   _| |_ ___      | | ___  _ __
   / /\ \| | | | __/ _ \     | |/ _ \| '__|
  / ____ \ |_| | || (_) |    | | (_) | |
 /_/    \_\__,_|\__\___/     |_|\___/|_|
                V 2.1
"""
)
os.system("sudo systemctl start tor")

time.sleep(3)
print("\033[1;32;40m change your SOCKS to 127.0.0.1:9050 \n")
os.system("sudo systemctl start tor")
x = input("[+] time to change Ip in Sec [type=60] >> ")
lin = input(
    "[+] how many times do you want to change your ip [type=1000]for infinite ip change type [0] >>"
)
if int(lin) == int(0):
    while True:
        try:
            time.sleep(int(x))
            change()
        except KeyboardInterrupt:
            print("\nauto tor is closed ")
            quit()
else:
    for i in range(int(lin)):
        time.sleep(int(x))
        change()
