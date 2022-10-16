import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CONFIG } from "../../js/config";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";

// widget body used by all syncmeta widgets
@customElement("json-export-widget")
export class JSONExportWidget extends SyncMetaWidget {
  render() {
    return html`
      <script type="application/javascript">
        requirejs(
          ["jqueryui", "mfexport", "ildeApi", "lodash"],
          function ($, MFExport, ILDE, _) {
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
        );
      </script>

      <style>
        /*noinspection CssUnknownTarget,CssUnusedSymbol*/
        .loading_button {
          background-image: url('<%= grunt.config("baseUrl") %>/img/loading_small.gif');
          background-repeat: no-repeat;
          background-position: right center;
          padding-right: 20px;
        }
      </style>
      <button id="json">Download JSON</button>
      <button id="png">Download PNG Image</button>
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
