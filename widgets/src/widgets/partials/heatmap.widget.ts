import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";

// widget body used by all syncmeta widgets
@customElement("heatmap-widget")
export class HeatMapWidget extends SyncMetaWidget {
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
        href="<%= grunt.config('baseUrl') %>/css/style.css"
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
      <script src="<%= grunt.config('baseUrl') %>/es6/heatmap_widget.js"></script>
      <div
        id="heatmap"
        style="background-color: #f5f5f5; width: 100%;height: 100%;"
      >
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