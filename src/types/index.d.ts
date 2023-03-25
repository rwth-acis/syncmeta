import { JsPlumbInstance } from "@jsplumb/core";
import { Doc as YDoc } from "yjs";

export {};

declare global {
  interface Window {
    Y: any;
    WebsocketProvider: any;
    syncmetaRoom: string;
    y: YDoc;
    caeFrames: any;
    _iwc_instance_: any;
    _addIwcIntentListener: (f: any) => void;
    _reloadThisFuckingInstance: () => void;
    jsPlumbInstance: JsPlumbInstance;
    spaceTitle: any;
    syncmetaLog: {
      widget: string;
      initializedYTexts: number;
      objects: any;
      errors: any;
      firstAttemptFail: any;
    };
  }

  interface JQuery {
    dialog(o: any): void;
  }
}
