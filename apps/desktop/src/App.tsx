import { CommentLayer } from "./components/CommentLayer";
import "./App.css";
import { useEffect, useState } from "react";
import { RoomQRCode } from "./components/RoomQRCode";
import { RoomInfo } from "@presen-comeview/shared";

function App() {
  const [room, setRoom] = useState<RoomInfo | null>(null);

  useEffect(() => {
    window.roomAPI.getInfo().then(setRoom);
  }, []);

  if (!room) {
    return null;
  }

  return (
    <>
      <RoomQRCode roomId={room.id} joinUrl={room.joinUrl} />

      <CommentLayer room={room} />
    </>
  );
}

export default App;
