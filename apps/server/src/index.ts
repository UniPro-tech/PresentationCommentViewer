import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { nanoid } from "nanoid";

import type {
  ClientMessage,
  CommentMessage,
  RoomStatusMessage,
  ServerMessage,
} from "@presen-comeview/shared";

/**
 * Config
 */

const port = Number(process.env.PORT) || 3001;

const host = process.env.HOST || "0.0.0.0";

const baseURL = process.env.BASE_URL || "127.0.0.1:3001";
const webURL = process.env.WEB_URL || "127.0.0.1:5137";

const wsProtocol = process.env.INSECURE ? "ws" : "wss";
const httpProtocol = process.env.INSECURE ? "http" : "https";

console.log("[config]", {
  port,
  host,
  baseURL,
});

/**
 * Types
 */

type Client = {
  ws: WebSocket;
  room?: Room;
  clientType?: "viewer" | "desktop";
};

type Room = {
  id: string;

  desktop?: Client;

  viewers: Set<Client>;

  createdAt: number;

  lastActivityAt: number;
};

const rooms = new Map<string, Room>();

/**
 * HTTP Server
 */

const httpServer = createServer((req, res) => {
  console.log("[HTTP]", req.method, req.url);

  /**
   * Create public room
   */
  if (req.method === "POST" && req.url === "/rooms") {
    const roomId = nanoid(6);

    const now = Date.now();

    const room: Room = {
      id: roomId,

      viewers: new Set(),

      createdAt: now,

      lastActivityAt: now,
    };

    rooms.set(roomId, room);

    console.log("[ROOM CREATED]", roomId);

    const response = {
      id: roomId,

      mode: "public",

      joinUrl: `${httpProtocol}://${webURL}/r/${roomId}`,

      websocketUrl: `${wsProtocol}://${baseURL}`,

      desktopWebsocketUrl: `${wsProtocol}://${baseURL}`,
    };

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(response));

    return;
  }

  res.writeHead(404);

  res.end();
});

/**
 * WebSocket Server
 */

const wss = new WebSocketServer({
  server: httpServer,
});

wss.on("connection", (ws) => {
  console.log("[WS CONNECTED]");

  const client: Client = {
    ws,
  };

  ws.on("message", (raw) => {
    let message: ClientMessage;

    try {
      message = JSON.parse(raw.toString());
    } catch {
      console.log("[INVALID MESSAGE]", raw.toString());

      return;
    }

    console.log("[MESSAGE]", message);

    switch (message.type) {
      /**
       * Join room
       */
      case "join_room": {
        const room = rooms.get(message.roomId);

        if (!room) {
          console.log("[ROOM NOT FOUND]", message.roomId);

          ws.close();

          return;
        }

        client.room = room;

        client.clientType = message.clientType;

        room.lastActivityAt = Date.now();

        /**
         * Desktop
         */
        if (message.clientType === "desktop") {
          if (room.desktop) {
            console.log("[DESKTOP DUPLICATE]", room.id);

            ws.close();

            return;
          }

          room.desktop = client;

          console.log("[DESKTOP JOIN]", room.id);
        }

        /**
         * Viewer
         */
        if (message.clientType === "viewer") {
          room.viewers.add(client);

          console.log("[VIEWER JOIN]", room.id, "count:", room.viewers.size);

          sendRoomStatus(room);
        }

        break;
      }

      /**
       * Comment
       */
      case "send_comment": {
        const room = client.room;

        if (!room) {
          console.log("[COMMENT WITHOUT ROOM]");

          return;
        }

        room.lastActivityAt = Date.now();

        const comment: CommentMessage = {
          type: "comment",

          roomId: room.id,

          id: crypto.randomUUID(),

          text: message.text,

          createdAt: Date.now(),
        };

        console.log("[COMMENT]", room.id, message.text);

        if (room.desktop && room.desktop.ws.readyState === WebSocket.OPEN) {
          room.desktop.ws.send(JSON.stringify(comment));
        }

        break;
      }
    }
  });

  ws.on("close", () => {
    console.log("[WS CLOSED]");

    const room = client.room;

    if (!room) {
      return;
    }

    if (room.desktop === client) {
      room.desktop = undefined;

      console.log("[DESKTOP LEFT]", room.id);
    }

    room.viewers.delete(client);

    console.log("[VIEWER LEFT]", room.id, "count:", room.viewers.size);

    if (!room.desktop && room.viewers.size === 0) {
      rooms.delete(room.id);

      console.log("[ROOM DELETED]", room.id);
    }
  });
});

function sendRoomStatus(room: Room) {
  if (!room.desktop) {
    return;
  }

  const message: RoomStatusMessage = {
    type: "room_status",
    viewerCount: room.viewers.size,
  };

  if (room.desktop.ws.readyState === WebSocket.OPEN) {
    room.desktop.ws.send(JSON.stringify(message));
  }
}

/**
 * Start
 */

httpServer.listen(port, host, () => {
  console.log(`[SERVER STARTED] ${httpProtocol}://${host}:${port}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("shutdown");
  httpServer.close(() => {
    process.exit(0);
  });
});
