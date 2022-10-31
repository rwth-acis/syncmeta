import { LitElement, html, CSSResultGroup, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";
// widget body used by all syncmeta widgets
@customElement("test-widget")
export class TestWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/js/lib/vendor/test/mocha.css"
      />
      <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/jquery.js"></script>
      <script src="<%= grunt.config('baseUrl') %>/js/lib/vendor/test/mocha.js"></script>
      <script src="<%= grunt.config('baseUrl') %>/test/test_widget.js"></script>
      <div id="wrapper">
        <div id="mocha"></div>
        <div id="messages"></div>
        <div id="fixtures"></div>
      </div>
    `;
  }

  static styles = css`
    #wrapper {
      max-height: 500px;
      overflow-y: scroll;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
