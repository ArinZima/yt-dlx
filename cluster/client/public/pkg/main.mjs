import { app, BrowserWindow } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import serve from "electron-serve";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appServe = app.isPackaged
  ? serve({
      directory: join(__dirname, "../out"),
    })
  : null;
const createWindow = () => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600,
    fullscreen: true,
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
    },
  });
  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};
app.on("ready", () => createWindow());
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
