import { useState } from "react";
import { useSocket } from "./hooks/useSocket";
import "./App.css";

function getRoomId() {
  const match = window.location.pathname.match(/^\/r\/([^/]+)$/);

  return match?.[1] ?? null;
}

function getWsUri() {
  const params = new URLSearchParams(window.location.search);

  // LAN mode
  const lanWs = params.get("ws");

  if (lanWs) {
    return lanWs;
  }

  // PUBLIC mode
  return import.meta.env.VITE_PUBLIC_WS_URL;
}

function App() {
  const [text, setText] = useState("");

  const roomId = getRoomId();
  const wsUri = getWsUri();

  if (!roomId || !wsUri) {
    return (
      <main className="error">
        <p>Room情報がありません</p>
      </main>
    );
  }

  const { send, connected } = useSocket(roomId, wsUri);

  function submit() {
    const value = text.trim();

    if (!value) {
      return;
    }

    send(value);

    setText("");
  }

  return (
    <main className="viewer">
      <div className="container">
        <header className="room-header">
          <h1>ComeView</h1>

          <p className="description">プレゼンにコメントを送信します</p>

          <div className="room-status">{connected ? "接続中" : "再接続中"}</div>
          <p className="room-id">Room {roomId}</p>
        </header>

        <textarea
          value={text}
          placeholder="コメントを入力..."
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={submit}>送信</button>
      </div>
    </main>
  );
}

export default App;
