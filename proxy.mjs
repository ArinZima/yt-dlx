import axios from "axios";

async function verifyProxy(proxyUrl) {
  try {
    const resp = await axios.get("https://www.google.com", {
      timeout: 5000,
      proxy: {
        host: proxyUrl.split(":")[0],
        port: parseInt(proxyUrl.split(":")[1]),
      },
    });
    if (resp.status === 200) console.log(`Proxy ${proxyUrl} is accessible.`);
    else console.log(`Status: ${resp.status}`);
  } catch (error) {
    if (error.code === "ECONNABORTED") console.log(`Timeout ${proxyUrl}.`);
    else console.error(error.message);
  }
}

const proxyList = [
  "38.62.222.219:3128",
  "154.6.97.227:3128",
  "154.6.97.129:3128",
  "154.6.99.45:3128",
  "38.62.220.3:3128",
  "154.6.96.253:3128",
  "38.62.222.236:3128",
  "38.62.221.46:3128",
  "154.6.97.24:3128",
  "38.62.222.102:3128",
];
for (const ipAddress of proxyList) verifyProxy(ipAddress);
// python -m yt_dlp --proxy 'https://172.27.192.90' --dump-json 'https://youtu.be/wWR0VD6qgt8'
// hostname -I | awk '{print $1}'
