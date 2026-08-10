import { app, BrowserWindow, ipcMain, screen, shell } from "electron";

import { fileURLToPath } from "node:url";

import path from "node:path";

import type { RoomInfo } from "@presen-comeview/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

const RENDERER_DIST = path.join(process.env.APP_ROOT!, "dist");

let controlWindow: BrowserWindow | null = null;

let overlayWindow: BrowserWindow | null = null;

let selectedDisplayId: number | null = null;

const PUBLIC_SERVER_URL = app.isPackaged
  ? "https://api-comeview.uniproject.jp"
  : (process.env.PUBLIC_SERVER_URL ?? "http://127.0.0.1:3001");

let currentRoom: RoomInfo | null = null;

async function createPublicRoom() {
  console.log("[ROOM] create");

  const response = await fetch(`${PUBLIC_SERVER_URL}/rooms`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("room create failed");
  }

  currentRoom = await response.json();

  console.log("[ROOM]", currentRoom);

  return currentRoom;
}

function loadRenderer(win: BrowserWindow, hash: string) {
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(`${VITE_DEV_SERVER_URL}/${hash}`);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"), {
      hash,
    });
  }
}

async function createControlWindow() {
  if (controlWindow) {
    controlWindow.focus();

    return;
  }

  if (!currentRoom) {
    await createPublicRoom();
  }

  controlWindow = new BrowserWindow({
    width: 820,
    height: 800,

    title: "プレゼンコメビュ - Controller",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,

      nodeIntegration: false,
    },
  });

  controlWindow.on("closed", () => {
    controlWindow = null;
  });

  loadRenderer(controlWindow, "#/control");
}

function createOverlayWindow() {
  if (overlayWindow) {
    overlayWindow.focus();

    return;
  }

  const displays = screen.getAllDisplays();

  const display =
    displays.find((d) => d.id === selectedDisplayId) ??
    screen.getPrimaryDisplay();

  const { x, y, width, height } = display.bounds;

  overlayWindow = new BrowserWindow({
    x,
    y,

    width,
    height,

    transparent: true,

    frame: false,

    alwaysOnTop: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,

      nodeIntegration: false,
    },
  });

  overlayWindow.setAlwaysOnTop(true, "screen-saver");

  overlayWindow.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  });

  overlayWindow.setIgnoreMouseEvents(true);

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });

  loadRenderer(overlayWindow, "#/overlay");
}

ipcMain.handle("room:get-info", () => {
  return currentRoom;
});

ipcMain.handle("overlay:start", () => {
  createOverlayWindow();

  return true;
});

ipcMain.handle("overlay:stop", () => {
  overlayWindow?.close();

  overlayWindow = null;

  return true;
});

ipcMain.handle("shell:open-external", async (_, url: string) => {
  await shell.openExternal(url);
});

ipcMain.handle("display:list", () => {
  return screen.getAllDisplays().map((display, index) => ({
    id: display.id,

    index,

    label: `Display ${index + 1}`,

    bounds: display.bounds,

    size: display.size,
  }));
});

ipcMain.handle("display:set", (_, id: number) => {
  selectedDisplayId = id;

  return true;
});

app.whenReady().then(() => {
  createControlWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createControlWindow();
  }
});
