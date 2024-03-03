const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
require("dotenv").config();

var browser = null;

const createWindow = () => {
  browser = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: !app.isPackaged,
    },
  });
  browser.loadURL("http://localhost:3000");

  // browser.loadFile(path.join(__dirname, "ui", "build", "index.html"));
};

app.whenReady().then(() => {
  ipcMain.handle("event", (event, data, pod) => {
    browser.webContents.send("event", data, pod);
  });
  ipcMain.handle("logs", (event, data) => {
    browser.webContents.send("logs", data);
  });
  ipcMain.handle("nats_stopped", (event, pod) => {
    browser.webContents.send("nats_stopped", pod);
  });

  createWindow();
});
