import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("commentAPI", {});

contextBridge.exposeInMainWorld("roomAPI", {
  getInfo() {
    return ipcRenderer.invoke("room:get-info");
  },
});
