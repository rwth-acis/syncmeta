import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";
import "../../css/style.css";
// widget body used by all syncmeta widgets
@customElement("guidance-widget")
export class GuidanceWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/bootstrap.min.prefixed.css"
      />
      <!-- <link rel="stylesheet" type="text/css" href="<%= grunt.config('baseUrl') %>/css/vendor/font-awesome/css/font-awesome.min.css"> -->
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"
      />
      <script src="<%= grunt.config('baseUrl') %>/es6/guidance_widget.js"></script>
      <div id="guidance">
        <div class="bs-btn-group">
          <div class="bs-form-group">
            <label for="strategyButton">Guidance Strategy</label>
            <button
              id="strategyButton"
              type="button"
              class="bs-btn bs-btn-default bs-dropdown-toggle bs-form-control"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Select a strategy<span class="bs-caret"></span>
            </button>
            <ul class="bs-dropdown-menu" id="guidanceSelect"></ul>
          </div>
        </div>
      </div>
      <div id="guidance-strategy-ui" style="height:320px; overflow:auto;">
        <div></div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
