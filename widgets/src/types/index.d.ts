import { JsPlumbInstance } from "@jsplumb/core";
import * as Y from "yjs";

export {};

declare global {
  interface Window {
    Y: any;
    WebsocketProvider: any;
    syncmetaRoom: string;
    y: Y.Doc;
    caeFrames: any;
    _iwc_instance_: any;
    _addIwcIntentListener: (f: any) => void;
    _reloadThisFuckingInstance: () => void;
    jsPlumbInstance: JsPlumbInstance;
    spaceTitle: any;
  }
}
