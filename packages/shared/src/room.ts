export type RoomMode = "public";

export type RoomInfo = {
  id: string;
  mode: RoomMode;

  joinUrl: string;
  websocketUrl: string;
  desktopWebsocketUrl?: string;

  viewerCount?: number;
};
