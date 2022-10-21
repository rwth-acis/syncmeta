import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";
import "../../css/style.css";
// widget body used by all syncmeta widgets
@customElement("palette-widget")
export class PaletteWidget extends SyncMetaWidget {
  render() {
    return html`<link
        rel="stylesheet"
        type="text/css"
        href="<%= grunt.config('baseUrl') %>/css/vendor/jquery-ui.css"
      />
      <script src="<%= grunt.config('baseUrl') %>/es6/palette_widget.js"></script>
      <div id="main">
        <div id="palette"></div>
        <p id="info"></p>
        <div id="q"></div>
      </div> `;
  }

  connectedCallback() {
    super.connectedCallback();
    init();
  }

  static styles = css`
    #main {
      max-height: 400px;
    }

    button {
      border: 1px dotted #cccccc;
      background: none;
      text-align: left;
      width: 100%;
    }
    button.selected {
      border: 1px solid #999999;
      background-color: #eeeeee;
    }

    button .icon > div {
      /*
    zoom: 0.1;
    -moz-transform: scale(0.2,0.2);
    -moz-transform-origin: left center;*/
      width: 15px !important;
      height: 9px !important;
    }
    button .icon div.fill_parent {
      display: none;
    }

    button span {
      padding-left: 10px;
    }

    hr {
      border-width: 0 0 1px 0;
      border-color: #cccccc;
      margin: 0.2em 0;
    }
    p#info {
      font-size: 0.6em;
    }
  `;

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
