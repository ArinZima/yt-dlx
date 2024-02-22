// import http from "http";
// import colors from "colors";
// import ngrok from "@ngrok/ngrok";
// import { Browser, firefox } from "playwright";

// http.createServer().listen(8080, () => {
// console.log(colors.green("EXPRESS:"), "8080");
// ngrok
// .connect({
// addr: 8000,
// domain: "multiply-ample-hornet.ngrok-free.app",
// authtoken: "2chypvKgTPIgZJUkEZOAgL1L8KX_2ejrkLuibGuaaQmrr8Zew",
// })
// .then((listener) => console.log(colors.blue("NGROK:"), listener.url()));
// });

// (async () => {
// try {
// let browser: Browser = await firefox.launch({ headless: false });
// const host =
// "https://multiply-ample-hornet.ngrok-free.app/scrape?query=Houdini";
// const context = await browser.newContext();
// const page = await context.newPage();
// page.on("requestfinished", async (request) => {
// if (request.url().includes("/scrape")) {
// const response = await request.response();
// const responseJson = await response?.json();
// console.log(
// colors.yellow("Response from /scrape route:"),
// responseJson
// );
// }
// });
// await page.goto(host);
// await page.waitForSelector("button[class*=ring-blue-600]", {
// timeout: 10000,
// });
// await page.click("button[class*=ring-blue-600]");
// console.log(colors.green("Button clicked successfully"));
// await page.waitForTimeout(2000);
// } catch (error) {
// console.log(error);
// }
// })();

import colors from "colors";
import ngrok from "@ngrok/ngrok";
import { Browser, firefox } from "playwright";

ngrok
  .connect({
    addr: 8000,
    domain: "multiply-ample-hornet.ngrok-free.app",
    authtoken: "2chypvKgTPIgZJUkEZOAgL1L8KX_2ejrkLuibGuaaQmrr8Zew",
  })
  .then(async (listener) => {
    console.log(colors.blue("NGROK:"), listener.url());
    let browser: Browser = await firefox.launch({ headless: true });
    const host = `${listener.url()}/scrape?query=Houdini`;
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(host);
    await page.waitForSelector("button[class*=ring-blue-600]", {
      timeout: 10000,
    });
    console.log(colors.yellow("FIREFOX: searching for button..."));
    await page.click("button[class*=ring-blue-600]");
    console.log(colors.green("FIREFOX: button clicked successfully"));
    page.on("requestfinished", async (request) => {
      if (request.url().includes("/scrape")) {
        const response = await request.response();
        const responseJson = await response?.json();
        console.log(
          colors.yellow("Response from /scrape route:"),
          responseJson
        );
      }
    });
    await page.waitForTimeout(2000);
  });
