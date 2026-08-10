import { useEffect, useState } from "react";

import type { RoomInfo } from "@presen-comeview/shared";

import "./Monitor.css";

import { useComments } from "./hooks/useComments";

function Monitor() {
  const [room, setRoom] = useState<RoomInfo | null>(null);

  const { comments } = useComments();

  useEffect(() => {
    window.roomAPI.getInfo().then(setRoom);
  }, []);

  if (!room) {
    return null;
  }

  return (
    <div id="monitor-container">
      <h3>コメント一覧</h3>

      <div id="room-info">{room.id}</div>

      <div id="comments">
        {comments.map((comment) => (
          <div key={comment.id}>{comment.text}</div>
        ))}
      </div>
    </div>
  );
}

export default Monitor;
