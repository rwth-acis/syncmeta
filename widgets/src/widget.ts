import { LitElement, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "./js/config";
import init from "./js/shared";

type Constructor<T = {}> = new (...args: any[]) => T;

export const SyncMetaWidget = <T extends Constructor<LitElement>>(
  superClass: T
) => {
  // cannot use arrow function here, see https://lit.dev/docs/composition/mixins/#applying-decorators-in-mixins
  class SyncMetaWidgetElement extends superClass {
    @property({ type: String }) widgetName = "SyncMetaWidget";

    connectedCallback() {
      super.connectedCallback();
      init();
      window.Y = Y;
      window.WebsocketProvider = WebsocketProvider;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
    }
  }
  return SyncMetaWidgetElement as T;
};
