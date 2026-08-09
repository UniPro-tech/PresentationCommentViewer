import { useState } from "react";
import { useSocket } from "./hooks/useSocket";

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
    return null;
  }

  const { send } = useSocket(roomId, wsUri);

  function submit() {
    if (!text.trim()) {
      return;
    }

    send(text);

    setText("");
  }

  return (
    <main>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
      />

      <button onClick={submit}>送信</button>
    </main>
  );
}

export default App;
