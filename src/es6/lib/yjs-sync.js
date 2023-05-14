import { Doc as YDoc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import Util from "../Util";

/**
 *
 * @param {*} spaceTitle
 * @param {*} yjsServer
 * @param {*} yjsProtocol
 * @returns
 * @deprecated use getInstance instead
 */
export async function yjsSync(
  spaceTitle = null,
  yjsServer = "localhost:1234",
  yjsProtocol = "ws"
) {
  console.warn("yjsSync is deprecated. Use getInstance instead");
  let title;

  if (!spaceTitle) {
    if (window.caeRoom) {
      title = window.caeRoom;
    } else if (localStorage.getItem("syncmetaSpace")) {
      title = localStorage.getItem("syncmetaSpace");
    } else {
      title = Util.getSpaceTitle(location.href);
    }
  }

  if (window.y && title === spaceTitle) {
    // yjs is already initialized and we are using the same spaceTitle
    return new Promise((resolve) => resolve(window.y));
  }

  const doc = new YDoc();

  // Sync clients with the y-websocket provider
  const websocketProvider = new WebsocketProvider(
    `${yjsProtocol}://${yjsServer}`,
    title,
    doc
  );

  await new Promise((resolve, reject) => {
    websocketProvider.on("status", (event) => {
      // console.log(event.status); // logs "connected" or "disconnected"

      if (event.status == "connected") {
        if (!window.y) {
          window.y = doc;
        }
        resolve(title);
      }
    });
    setTimeout(() => {
      reject("YJS connection timed out. This means syncmeta widgets wont work");
    }, 5000);
  });
  if (window.y) {
    // it could be that another yjsSync call was made before this one resolved
    return window.y;
  }
  return doc;
}

let yjsConnection;

class YJSConnector {
  doc;
  websocketProvider;
  spaceTitle;
  host;
  protocol;
  port;
  path;

  constructor(props) {
    if (!props?.host) {
      props.host = "localhost";
      console.warn("Host not specified. Using default: localhost:1234");
    }
    if (!props?.protocol) {
      props.protocol = "ws";
      console.warn("Protocol not specified. Using default: ws");
    }
    if (!props.port) {
      props.port = 1234;
      console.warn("Port not specified. Using default: 1234");
    }

    this.spaceTitle = props.spaceTitle;
    this.host = props.host;
    this.protocol = props.protocol;
    this.port = props.port;
    this.path = props.path;

    this.doc = new YDoc();
    let connectionString = `${this.protocol}://${this.host}`;
    if (this.port) {
      connectionString += `:${this.port}`;
    }
    if (this.path) {
      connectionString += `/${this.path}`;
    }
    console.log(`YJS connector set to connect to: ${connectionString}`);
    // Sync clients with the y-websocket provider
    this.websocketProvider = new WebsocketProvider(
      connectionString,
      this.spaceTitle,
      this.doc
    );
  }

  connect() {
    if (this.doc) {
      return new Promise((resolve) => resolve(this.doc));
    }

    return new Promise((resolve, reject) => {
      this.websocketProvider.on("status", (event) => {
        // console.log(event.status); // logs "connected" or "disconnected"
        if (event.status == "connected") {
          resolve(this.doc);
        }
      });
      setTimeout(() => {
        reject(
          "YJS connection timed out. This means syncmeta widgets wont work"
        );
      }, 5000);
    });
  }
}

export function getInstance({ spaceTitle, host, protocol, port }) {
  if (!yjsConnection) {
    yjsConnection = new YJSConnector({ spaceTitle, host, protocol, port });
    Object.freeze(yjsConnection); // make sure no one can change the connection
  }
  return yjsConnection;
}
