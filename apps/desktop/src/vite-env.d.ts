/// <reference types="vite/client" />

import { RoomInfo } from "@presen-comeview/shared";
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

    commentAPI: {
      /**
       * Overlay側からmain processへコメントを送る
       */
      sendComment(text: string): void;

      /**
       * Monitor側でコメントを受信する
       */
      onComment(callback: (text: string) => void): () => void;
    };
  }
}
