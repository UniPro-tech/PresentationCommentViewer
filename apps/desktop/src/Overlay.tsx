import { useEffect, useState } from "react";
import type { RoomInfo } from "@presen-comeview/shared";
import { CommentLayer } from "./components/CommentLayer";
import "./Overlay.css";

function Overlay() {
  const [room, setRoom] = useState<RoomInfo | null>(null);

  useEffect(() => {
    window.roomAPI.getInfo().then(setRoom);
  }, []);

  if (!room) {
    return null;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <CommentLayer room={room} />
    </div>
  );
}

export default Overlay;
