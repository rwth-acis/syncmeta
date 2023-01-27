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
        ${getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE)} {
          height: 100%;
          position: relative;
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
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://code.jquery.com/ui/1.13.1/themes/smoothness/jquery-ui.css"
      />
      <div class="h-100" style="overflow-y:auto">
        <div id="palette"></div>
        <p id="info"></p>
        <div id="q"></div>
        <loading-spinner></loading-spinner>
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
