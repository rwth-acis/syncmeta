import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";
import "../../es6/json_export_widget.js";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import MFExport from "../../es6/lib/MFExport";
// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.JSON_EXPORT))
export class JSONExportWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.JSON_EXPORT)
) {
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    $("#json").click(function () {
      var $this = $(this).addClass("loading_button");
      MFExport.getJSON(function (data, title) {
        var link = document.createElement("a");
        link.download = title + ".json";
        link.href = "data:," + encodeURI(JSON.stringify(data, null, 4));
        link.click();
        $this.removeClass("loading_button");
      });
    });
    $("#png").click(function () {
      var $this = $(this).addClass("loading_button");
      MFExport.getImageURL(function (url, title) {
        var link = document.createElement("a");
        link.download = title + ".png";
        link.href = url;
        link.click();
        $this.removeClass("loading_button");
      });
    });
  }
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
