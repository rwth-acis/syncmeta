import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "./js/config";
import init from "./js/shared";

// main widget body used by all syncmeta widgets
@customElement("widget-body")
class WidgetBody extends LitElement {
  render() {
    return html` <div>Hello from MyElement!</div> `;
  }

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
