import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";
import "../../es6/palette_widget.js";
import { CONFIG, getWidgetTagName } from "../../es6/config";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE))
export class PaletteWidget extends SyncMetaWidget(LitElement) {
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <style>
        #main {
          max-height: 400px;
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
      </style>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <div id="main">
        <div id="palette"></div>
        <p id="info"></p>
        <div id="q"></div>
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
