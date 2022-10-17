import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "./js/config";
import init from "./js/shared";

// widget body used by all syncmeta widgets
@customElement("widget-body")
export class SyncMetaWidget extends LitElement {
  render() {
    return html``;
  }

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
