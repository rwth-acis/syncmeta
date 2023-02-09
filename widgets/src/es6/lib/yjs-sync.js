import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export async function yjsSync(
  spaceTitle = window.spaceTitle,
  yjsServer = "localhost:1234",
  yjsProtocol = "ws"
) {
  if (!window.Y) {
    window.Y = Y;
  }

  if (window.y) {
    return new Promise((resolve) => resolve(window.y));
  }

  const doc = new Y.Doc();

  // Sync clients with the y-websocket provider
  const websocketProvider = new WebsocketProvider(
    `${yjsProtocol}://${yjsServer}`,
    spaceTitle,
    doc
  );

  await new Promise((resolve, reject) => {
    websocketProvider.on("status", (event) => {
      // console.log(event.status); // logs "connected" or "disconnected"

      if (event.status == "connected") {
        if (!window.y) {
          window.y = doc;
        }
        resolve(spaceTitle);
      }
    });
    setTimeout(() => {
      reject("YJS connection timed out. This means syncmeta widgets wont work");
    }, 5000);
  });
  if (window.y) {
    return window.y;
  }
  return doc;
}
