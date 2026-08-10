/// <reference types="vite/client" />

import { RoomInfo, RoomMode } from "@presen-comeview/shared";
import { DisplayInfo } from "./components/DisplaySelector";

export {};

declare global {
  interface Window {
    roomAPI: {
      getInfo(): Promise<RoomInfo>;

      startOverlay(): Promise<boolean>;

      stopOverlay(): Promise<boolean>;

      openExternal(url: string): Promise<void>;
    };
    displayAPI: {
      list(): Promise<DisplayInfo[]>;
      select(id: number): Promise<boolean>;
    };
  }
}
