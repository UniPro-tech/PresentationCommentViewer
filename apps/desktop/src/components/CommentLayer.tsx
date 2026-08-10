import { useEffect } from "react";
import { useComments } from "../hooks/useComments";
import { Comment } from "./Comment";

import {
  JoinRoomMessage,
  RoomInfo,
  ServerMessage,
} from "@presen-comeview/shared";

export function CommentLayer({ room }: { room: RoomInfo }) {
  const { comments, addComment } = useComments();

  useEffect(() => {
    const ws = new WebSocket(room.desktopWebsocketUrl ?? "ws://127.0.0.1:3001");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId: room.id,
          clientType: "desktop",
        } as JoinRoomMessage),
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerMessage;

      if (message.type === "comment") {
        // Overlay表示用
        addComment(message.text);

        // Monitorへ転送
        window.commentAPI.sendComment(message.text);
      }
    };

    return () => {
      ws.close();
    };
  }, [room.id, room.desktopWebsocketUrl, addComment]);

  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </>
  );
}
