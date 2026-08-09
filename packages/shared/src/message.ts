import type { RoomInfo } from "./room";

export type JoinRoomMessage = {
  type: "join_room";
  roomId: string;
  clientType: "viewer" | "desktop";
};

export type SendCommentMessage = {
  type: "send_comment";
  text: string;
};

export type CommentMessage = {
  type: "comment";
  roomId: string;
  id: string;
  text: string;
  createdAt: number;
};

export type RoomInfoMessage = {
  type: "room_info";
  room: RoomInfo;
};

export type RoomStatusMessage = {
  type: "room_status";
  viewerCount: number;
};

export type ClientMessage = JoinRoomMessage | SendCommentMessage;

export type ServerMessage =
  | CommentMessage
  | RoomInfoMessage
  | RoomStatusMessage;
