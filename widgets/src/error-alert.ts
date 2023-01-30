import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

// widget body used by all syncmeta widgets
@customElement("error-alert")
export class ErrorAlert extends LitElement {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <div class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <div id="alert-message"></div>
      </div>
    `;
  }
}
