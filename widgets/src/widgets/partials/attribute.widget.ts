import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";

// widget body used by all syncmeta widgets
@customElement("attribute-widget")
export class AttributeWidget extends SyncMetaWidget {
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
        href="<%= grunt.config('baseUrl') %>/css/attribute_widget.css"
      />
      <script src="<%= grunt.config('baseUrl') %>/js/attribute_widget.js"></script>
      <style>
        #wrapper {
          /*overflow-y: scroll;*/
          height: 100%;
        }
      </style>
      <div id="loading" class="loading"></div>
      <div id="wrapper"><h1>Wait For Canvas Widget!</h1></div>
      <div id="q"></div>
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
