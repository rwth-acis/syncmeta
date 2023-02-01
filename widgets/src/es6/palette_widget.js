/**
 * Namespace for palette widget.
 * @namespace palette_widget
 */

import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import { WaitForCanvas } from "./WaitForCanvas";
import Palette from "./palette_widget/Palette";
import MoveTool from "./palette_widget/MoveTool";
import ObjectNodeTool from "./palette_widget/ObjectNodeTool";
import AbstractClassNodeTool from "./palette_widget/AbstractClassNodeTool";
import EnumNodeTool from "./palette_widget/EnumNodeTool";
import NodeShapeNodeTool from "./palette_widget/NodeShapeNodeTool";
import EdgeShapeNodeTool from "./palette_widget/EdgeShapeNodeTool";
import RelationshipNodeTool from "./palette_widget/RelationshipNodeTool";
import RelationshipGroupNodeTool from "./palette_widget/RelationshipGroupNodeTool";
import BiDirAssociationEdgeTool from "./palette_widget/BiDirAssociationEdgeTool";
import UniDirAssociationEdgeTool from "./palette_widget/UniDirAssociationEdgeTool";
import GeneralisationEdgeTool from "./palette_widget/GeneralisationEdgeTool";
import ViewObjectNodeTool from "./palette_widget/ViewObjectNodeTool";
import ViewRelationshipNodeTool from "./palette_widget/ViewRelationshipNodeTool";
import { CONFIG } from "./config.js";
import { yjsSync } from "./lib/yjs-sync";
import { getWidgetTagName } from "./config.js";
// import test from "./../es6-test/PaletteWidgetTest";

$(function () {
  const alertDiv = $(getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE)).find(
    ".alert"
  );
  const $spinner = $(getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE)).find(
    "loading-spinner"
  );
  alertDiv.attr("style", "display:none !important");
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
        .catch((err) => {
          console.error("PALETTE: Error while waiting for CANVAS: ", err);
          alertDiv
            .find("#alert-message")
            .text("Cannot connect to Canvas widget.");
          alertDiv.show();
        })
        .finally(() => {
          $(getWidgetTagName(CONFIG.WIDGET.NAME.PALETTE))
            .find("loading-spinner")
            .hide();
        });
    })
    .catch((error) => {
      console.error("PALETTE: Error while waiting for CANVAS: ", error);
      alertDiv.find("#alert-message").text("Cannot connect to Yjs server.");
      $spinner.hide();
      alertDiv.show();
    });
});
