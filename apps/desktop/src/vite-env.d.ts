/// <reference types="vite/client" />

import { RoomInfo, RoomMode } from "@presen-comeview/shared";

export {};

declare global {
  interface Window {
    roomAPI: {
      getInfo(): Promise<RoomInfo>;

      startOverlay(): Promise<boolean>;

      stopOverlay(): Promise<boolean>;
    };
  }
}
