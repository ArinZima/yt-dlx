import os

choice = input("To install press (Y) to uninstall press (N): ")
run = os.system
if str(choice) == "Y" or str(choice) == "y":
    run("chmod 777 Aut_Arch.py")
    run("mkdir /usr/share/aut")
    run("cp Aut_Arch.py /usr/share/aut/Aut_Arch.py")
    cmnd = ' #! /bin/sh \n exec python3 /usr/share/aut/Aut_Arch.py "$@"'
    with open("/usr/bin/aut", "w") as file:
        file.write(cmnd)
    run("chmod +x /usr/bin/aut & chmod +x /usr/share/aut/Aut_Arch.py")
    print(
        """\n\ncongratulation auto Tor Ip Changer is installed successfully \nfrom now just type \x1b[6;30;42maut\x1b[0m in terminal """
    )
if str(choice) == "N" or str(choice) == "n":
    run("rm -r /usr/share/aut ")
    run("rm /usr/bin/aut ")
    print("[!] now Auto Tor Ip changer  has been removed successfully")
