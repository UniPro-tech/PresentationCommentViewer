import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("commentAPI", {});

contextBridge.exposeInMainWorld("roomAPI", {
  getInfo: () => ipcRenderer.invoke("room:get-info"),

  startOverlay: () => ipcRenderer.invoke("overlay:start"),

  stopOverlay: () => ipcRenderer.invoke("overlay:stop"),
});
