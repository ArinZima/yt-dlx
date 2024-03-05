import time
import requests


def get_public_ip():
    try:
        response = requests.get("https://httpbin.org/ip")
        if response.status_code == 200:
            return response.json()["origin"]
        else:
            return "Failed to retrieve IP"
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    while True:
        print("Current Public IP:", get_public_ip())
        time.sleep(2)
