import { contextBridge, ipcRenderer } from "electron";

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

contextBridge.exposeInMainWorld("commentAPI", {
  sendComment(text: string) {
    ipcRenderer.send("comment-received", text);
  },

  onComment(callback: (text: string) => void) {
    const handler = (_event: Electron.IpcRendererEvent, text: string) => {
      callback(text);
    };

    ipcRenderer.on("comment-received", handler);

    return () => {
      ipcRenderer.removeListener("comment-received", handler);
    };
  },
});
