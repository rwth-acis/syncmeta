import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

// import widget container
import "../../build/widgets/widget.container.js";

import { APP_CONFIG } from "../config";

@customElement("main-app")
export class MainApp extends LitElement {
  createRenderRoot() {
    return this;
  }
  constructor() {
    super();
  }

  render() {
    return html`
      <widget-container
        yjsHost="${APP_CONFIG.yjsHost}"
        yjsPort="${APP_CONFIG.yjsPort}"
        yjsProtocol="${APP_CONFIG.yjsProtocol}"
        yjsSpaceTitle="${APP_CONFIG.yjsSpaceTitle}"
      ></widget-container>
    `;
  }
}
