import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";

// widget body used by all syncmeta widgets
@customElement("activity-widget")
export class ActivityWidget extends SyncMetaWidget {
  render() {
    return html`<link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/style.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/activity_widget.css"
      />
      <script src="<%= grunt.config('baseUrl') %>/js/activity_widget.js"></script>
      <script></script>
      <h2>Users online</h2>
      <div class="list_wrapper">
        <div id="user_list" class="list"></div>
      </div>
      <h2>Activities</h2>
      <div class="list_wrapper">
        <div id="activity_list" class="list"></div>
      </div>
      <div id="q"></div> `;
  }

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
