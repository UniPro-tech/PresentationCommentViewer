import { useEffect, useState } from "react";
import type { RoomInfo } from "@presen-comeview/shared";
import { RoomQRCode } from "./components/RoomQRCode";
import "./App.css";

function App() {
  const [room, setRoom] = useState<RoomInfo | null>(null);

  const [running, setRunning] = useState(false);

  useEffect(() => {
    window.roomAPI.getInfo().then(setRoom);
  }, []);

  async function start() {
    await window.roomAPI.startOverlay();

    setRunning(true);
  }

  async function stop() {
    await window.roomAPI.stopOverlay();

    setRunning(false);
  }

  if (!room) {
    return null;
  }

  return (
    <main>
      <h1>ComeView</h1>

      <RoomQRCode roomId={room.id} joinUrl={room.joinUrl} />

      {running ? (
        <button onClick={stop}>コメント停止</button>
      ) : (
        <button onClick={start}>プレゼン開始</button>
      )}
    </main>
  );
}

export default App;
