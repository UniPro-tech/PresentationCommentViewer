import { useEffect, useState } from "react";
import type { RoomInfo } from "@presen-comeview/shared";
import { RoomQRCode } from "./components/RoomQRCode";
import "./App.css";
import { DisplaySelector } from "./components/DisplaySelector";

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
    <main className="control">
      <section className="header">
        <h1>ComeView</h1>
        <p>Presentation Comment Viewer</p>
      </section>

      <section className="settings">
        <RoomQRCode roomId={room.id} joinUrl={room.joinUrl} />

        <DisplaySelector />
      </section>

      <section className="status">
        <span
          className="status-dot"
          style={{
            background: running ? "#22c55e" : "#777",
          }}
        />

        {running ? "コメント受付中" : "待機中"}
      </section>

      <section className="actions">
        {running ? (
          <button className="stop" onClick={stop}>
            コメント停止
          </button>
        ) : (
          <button className="start" onClick={start}>
            プレゼン開始
          </button>
        )}
      </section>
    </main>
  );
}

export default App;
