import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";
import "../../es6/json_export_widget.js";
import { CONFIG, getWidgetTagName } from "../../es6/config";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.JSON_EXPORT))
export class JSONExportWidget extends SyncMetaWidget(LitElement) {
  render() {
    return html`
      <button id="json">Download JSON</button>
      <button id="png">Download PNG Image</button>
    `;
  }

  static styles = css`
    /*noinspection CssUnknownTarget,CssUnusedSymbol*/
    .loading_button {
      background-image: url('<%= grunt.config("baseUrl") %>/img/loading_small.gif');
      background-repeat: no-repeat;
      background-position: right center;
      padding-right: 20px;
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
