import { app, BrowserWindow, screen, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { RoomInfo } from "@presen-comeview/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null = null;

// public server
const PUBLIC_SERVER_URL = app.isPackaged
  ? "https://api-comeview.uniproject.jp"
  : (process.env.PUBLIC_SERVER_URL ?? "http://127.0.0.1:3001");

let currentRoom: RoomInfo | null = null;

/**
 * Public server room生成
 */
async function createPublicRoom(): Promise<RoomInfo> {
  console.log("[ROOM] creating public room", PUBLIC_SERVER_URL);

  const response = await fetch(`${PUBLIC_SERVER_URL}/rooms`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`public room failed ${response.status}`);
  }

  const room = (await response.json()) as RoomInfo;

  console.log("[ROOM] public created", room);

  return room;
}

/**
 * Electron start
 */
app.whenReady().then(async () => {
  currentRoom = await createPublicRoom();

  createWindow();
});

/**
 * Rendererからroom取得
 */
ipcMain.handle("room:get-info", () => {
  console.log("[IPC] get room", currentRoom);

  return currentRoom;
});

function createWindow() {
  console.log("[WINDOW] create");

  const display = screen.getPrimaryDisplay();

  const { x, y, width, height } = display.workArea;

  win = new BrowserWindow({
    x,
    y,
    width,
    height,

    transparent: true,
    frame: false,
    alwaysOnTop: true,

    icon: path.join(process.env.VITE_PUBLIC!, "electron-vite.svg"),

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setAlwaysOnTop(true, "screen-saver");

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();

    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
