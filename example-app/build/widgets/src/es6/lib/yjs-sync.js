import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { Doc as YDoc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import Util from "../Util";
export async function yjsSync(spaceTitle, yjsServer = "localhost:1234", yjsProtocol = "ws") {
    let title;
    if (!spaceTitle) {
        if (window.caeRoom) {
            title = window.caeRoom;
        }
        else if (localStorage.getItem("syncmetaSpace")) {
            title = localStorage.getItem("syncmetaSpace");
        }
        else {
            title = Util.getSpaceTitle(location.href);
        }
    }
    if (window.y && title === spaceTitle) {
        return new Promise((resolve) => resolve(window.y));
    }
    const doc = new YDoc();
    const websocketProvider = new WebsocketProvider(`${yjsProtocol}://${yjsServer}`, title, doc);
    await new Promise((resolve, reject) => {
        websocketProvider.on("status", (event) => {
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
        return window.y;
    }
    return doc;
}
//# sourceMappingURL=yjs-sync.js.map