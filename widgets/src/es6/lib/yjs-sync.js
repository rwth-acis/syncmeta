import "jquery";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export async function yjsSync(spaceTitle = window.spaceTitle) {
  if (!window.Y) {
    window.Y = Y;
  }

  const doc = new Y.Doc();
  if (!window.y) {
    window.y = doc; // bind the yjs document to the window object as a workaround for legacy code
  }

  // Sync clients with the y-websocket provider
  const websocketProvider = new WebsocketProvider(
    "ws://localhost:1234",
    spaceTitle,
    doc
  );

  await new Promise((resolve, reject) => {
    websocketProvider.on("status", (event) => {
      // console.log(event.status); // logs "connected" or "disconnected"

      if (event.status == "connected") {
        resolve(spaceTitle);
      }
    });
  });
  return doc;
}

