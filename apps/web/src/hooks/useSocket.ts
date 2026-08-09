import type {
  JoinRoomMessage,
  SendCommentMessage,
} from "@presen-comeview/shared";
import { useEffect, useRef } from "react";

export function useSocket(roomId: string, wsUri: string) {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(wsUri);

    socket.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
          clientType: "viewer",
        } as JoinRoomMessage),
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  function send(message: string) {
    const messageData: SendCommentMessage = {
      type: "send_comment",
      text: message,
    };
    socket.current?.send(JSON.stringify(messageData));
  }

  return {
    send,
  };
}
