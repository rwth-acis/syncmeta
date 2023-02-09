import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";

import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";

import { html, LitElement, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";
import { CONFIG, getWidgetTagName } from "../../es6/config";
import { yjsSync } from "../../es6/lib/yjs-sync";
import AbstractClassNodeTool from "../../es6/palette_widget/AbstractClassNodeTool";
import BiDirAssociationEdgeTool from "../../es6/palette_widget/BiDirAssociationEdgeTool";
import EdgeShapeNodeTool from "../../es6/palette_widget/EdgeShapeNodeTool";
import EnumNodeTool from "../../es6/palette_widget/EnumNodeTool";
import GeneralisationEdgeTool from "../../es6/palette_widget/GeneralisationEdgeTool";
import MoveTool from "../../es6/palette_widget/MoveTool";
import NodeShapeNodeTool from "../../es6/palette_widget/NodeShapeNodeTool";
import ObjectNodeTool from "../../es6/palette_widget/ObjectNodeTool";
import Palette from "../../es6/palette_widget/Palette";
import RelationshipGroupNodeTool from "../../es6/palette_widget/RelationshipGroupNodeTool";
import RelationshipNodeTool from "../../es6/palette_widget/RelationshipNodeTool";
import UniDirAssociationEdgeTool from "../../es6/palette_widget/UniDirAssociationEdgeTool";
import ViewObjectNodeTool from "../../es6/palette_widget/ViewObjectNodeTool";
import ViewRelationshipNodeTool from "../../es6/palette_widget/ViewRelationshipNodeTool";
import { WaitForCanvas } from "../../es6/WaitForCanvas";
import init from "../../js/shared";
import { SyncMetaWidget } from "../../widget";

// widget body used by all syncmeta widgets
@customElement(getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE))
export class PaletteWidget extends SyncMetaWidget(
  LitElement,
  getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE)
) {
  protected async firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    super.firstUpdated(_changedProperties);
    yjsSync()
      .then((y) => {
        console.info(
          "PALETTE: Yjs successfully initialized in room " +
            window.spaceTitle +
            " with y-user-id: " +
            y.clientID
        );
        WaitForCanvas(CONFIG.WIDGET.NAME.PALETTE, y)
          .then((metamodel) => {
            window.scrollTo(0, document.body.scrollHeight);
            var palette = new Palette($("#palette"), $("#info"));

            palette.addTool(new MoveTool());
            palette.addSeparator();

            if (!$.isEmptyObject(metamodel)) {
              if (metamodel.hasOwnProperty("nodes")) {
                palette.initNodePalette(metamodel);
              }
              if (metamodel.hasOwnProperty("edges")) {
                palette.iniEdgePalette(metamodel);
              }
            } else {
              //Create node tools for metamodeling
              palette.addTool(new AbstractClassNodeTool());
              palette.addTool(new ObjectNodeTool());
              palette.addTool(new RelationshipNodeTool());
              palette.addTool(new RelationshipGroupNodeTool());
              palette.addTool(new EnumNodeTool());
              palette.addTool(new NodeShapeNodeTool());
              palette.addTool(new EdgeShapeNodeTool());

              var viewObjectTool = new ViewObjectNodeTool();
              palette.addTool(viewObjectTool);
              viewObjectTool.get$node().hide();

              var viewRelNodeTool = new ViewRelationshipNodeTool();
              palette.addTool(viewRelNodeTool);
              viewRelNodeTool.get$node().hide();

              palette.addSeparator();
              palette.addTool(new BiDirAssociationEdgeTool());
              palette.addTool(new UniDirAssociationEdgeTool());
              palette.addTool(new GeneralisationEdgeTool());
            }
          })
          .catch((err: Error) => {
            console.error("PALETTE: Error while waiting for CANVAS: ", err);
            this.showErrorAlert("Cannot connect to Canvas widget.");
          })
          .finally(() => {
            $(getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE))
              .find("loading-spinner")
              .hide();
          });
      })
      .catch((error: Error) => {
        console.error("PALETTE: Error while waiting for CANVAS: ", error);
        this.showErrorAlert("Cannot connect to Yjs server.");
      });
  }

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
        <error-alert></error-alert>
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
