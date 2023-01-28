import { JsPlumbInstance } from "@jsplumb/core";

export {};

declare global {
  interface Window {
    Y: any;
    WebsocketProvider: any;
    syncmetaRoom: string;
    caeFrames: any;
    _iwc_instance_: any;
    _addIwcIntentListener: (f: any) => void;
    _reloadThisFuckingInstance: () => void;
    jsPlumbInstance: JsPlumbInstance;
  }
}
