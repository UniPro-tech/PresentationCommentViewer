import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("commentAPI", {});

contextBridge.exposeInMainWorld("roomAPI", {
  getInfo: () => ipcRenderer.invoke("room:get-info"),

  startOverlay: () => ipcRenderer.invoke("overlay:start"),

  stopOverlay: () => ipcRenderer.invoke("overlay:stop"),

  openExternal: (url: string) => ipcRenderer.invoke("shell:open-external", url),
});

contextBridge.exposeInMainWorld("displayAPI", {
  list: () => ipcRenderer.invoke("display:list"),

  select: (id: number) => ipcRenderer.invoke("display:set", id),
});
